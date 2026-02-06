import { WorkflowEntrypoint } from 'cloudflare:workers';
import { allContent } from './data/allContent.ts';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';

// GitHub repository configuration for image CDN
const GITHUB_CONFIG = {
	owner: 'sepva',
	repo: 'personal-website-rag',
	branch: 'main',
	basePath: 'src/data/content',
};

/**
 * Transform markdown image references from local paths to GitHub raw URLs
 * Handles both Markdown syntax ![](path) and HTML <img src="path"> tags
 * @param {string} markdownContent - The markdown content
 * @param {string} markdownFilePath - Path to the markdown file (e.g., "projects/proj1.md")
 * @returns {Promise<string>} - Transformed markdown with GitHub URLs
 */
async function transformMarkdownImages(markdownContent, markdownFilePath) {
	const processor = remark().use(remarkParse);
	const tree = processor.parse(markdownContent);

	const transformations = [];

	// Find all image nodes in the markdown AST
	visit(tree, 'image', (node) => {
		const imageSrc = node.url;

		// Only transform relative paths (not already http/https URLs)
		if (!imageSrc.startsWith('http://') && !imageSrc.startsWith('https://')) {
			// Parse query parameters if present
			const [pathPart, queryPart] = imageSrc.split('?');

			// Resolve relative path to absolute path within the content directory
			// Simple path.dirname equivalent: get directory part of path
			const markdownDir = markdownFilePath.substring(0, markdownFilePath.lastIndexOf('/'));
			// Simple path.join equivalent: concatenate paths
			const resolvedPath = markdownDir ? `${markdownDir}/${pathPart}` : pathPart;

			// Create GitHub raw URL
			const githubUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.basePath}/${resolvedPath}`;

			// Preserve query parameters (though GitHub ignores them, good for documentation)
			const finalUrl = queryPart ? `${githubUrl}?${queryPart}` : githubUrl;

			transformations.push({
				original: imageSrc,
				transformed: finalUrl,
				type: 'markdown',
			});
		}
	});

	// Also find HTML img tags with src attributes
	const imgTagRegex = /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi;
	let match;
	while ((match = imgTagRegex.exec(markdownContent)) !== null) {
		const fullImgTag = match[0];
		const imageSrc = match[1];

		// Only transform relative paths (not already http/https URLs)
		if (!imageSrc.startsWith('http://') && !imageSrc.startsWith('https://')) {
			// Parse query parameters if present
			const [pathPart, queryPart] = imageSrc.split('?');

			// Resolve relative path to absolute path within the content directory
			const markdownDir = markdownFilePath.substring(0, markdownFilePath.lastIndexOf('/'));
			const resolvedPath = markdownDir ? `${markdownDir}/${pathPart}` : pathPart;

			// Create GitHub raw URL
			const githubUrl = `https://raw.githubusercontent.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.basePath}/${resolvedPath}`;

			// Preserve query parameters
			const finalUrl = queryPart ? `${githubUrl}?${queryPart}` : githubUrl;

			transformations.push({
				original: imageSrc,
				transformed: finalUrl,
				type: 'html',
				fullTag: fullImgTag,
			});
		}
	}

	// Apply transformations to the markdown content
	let transformedContent = markdownContent;

	// Transform Markdown syntax images
	for (const transformation of transformations.filter((t) => t.type === 'markdown')) {
		const { original, transformed } = transformation;
		// Escape special regex characters in the original path
		const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(`!\\[([^\\]]*)\\]\\(${escapedOriginal}\\)`, 'g');
		transformedContent = transformedContent.replace(regex, `![$1](${transformed})`);
	}

	// Transform HTML img tags
	for (const transformation of transformations.filter((t) => t.type === 'html')) {
		const { original, transformed, fullTag } = transformation;
		// Escape special regex characters
		const escapedOriginal = original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const escapedFullTag = fullTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		// Replace the src attribute value
		const regex = new RegExp(escapedFullTag, 'g');
		const newTag = fullTag.replace(original, transformed);
		transformedContent = transformedContent.replace(regex, newTag);
	}

	return transformedContent;
}

// Default export for the Worker with fetch handler
export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		// Endpoint to trigger the RAGWorkflow (used after deployment)
		if (url.pathname === '/trigger-rag-rebuild' && request.method === 'POST') {
			// Verify the authorization token
			const authHeader = request.headers.get('Authorization');
			const expectedToken = env.DEPLOYMENT_SECRET;

			if (!expectedToken) {
				console.error('DEPLOYMENT_SECRET not configured');
				return Response.json({ success: false, error: 'Server configuration error' }, { status: 500 });
			}

			if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
				console.warn('Unauthorized attempt to trigger RAGWorkflow');
				return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
			}

			try {
				console.log('Authorized request - triggering RAGWorkflow to rebuild database...');
				const workflowInstance = await env.RAG_WORKFLOW.create();
				return Response.json({
					success: true,
					message: 'RAGWorkflow triggered successfully',
					workflowId: workflowInstance.id,
				});
			} catch (error) {
				console.error('Error triggering RAGWorkflow:', error);
				return Response.json(
					{
						success: false,
						error: error.message,
					},
					{ status: 500 },
				);
			}
		}

		return Response.json({ message: 'Personal Website RAG API' });
	},
};

export class RAGWorkflow extends WorkflowEntrypoint {
	async run(event, step) {
		const env = this.env;
		for (const [name, data] of Object.entries(allContent)) {
			await step.do(`create database record entry for ${name}`, async () => {
				// Handle empty content list - delete table and vectors if they exist
				if (!data || data.length === 0) {
					console.log(`No content found for ${name}, deleting table and vectors if they exist...`);

					// First, get all vector IDs for this data type before dropping the table
					try {
						const getAllIdsQuery = `SELECT id FROM ${name}`;
						const ids = await env.DB.prepare(getAllIdsQuery).all();

						// Delete corresponding vectors from vector index
						if (ids.results && ids.results.length > 0) {
							const vectorIds = ids.results.map((row) => row.id.toString());
							console.log(`Deleting ${vectorIds.length} vectors for ${name}...`);
							await env.VECTOR_INDEX.deleteByIds(vectorIds);
						}
					} catch (error) {
						// Table might not exist, which is fine
						console.log(`Table ${name} does not exist or is already empty`);
					}

					// Drop the table
					const dropTableQuery = `DROP TABLE IF EXISTS ${name}`;
					await env.DB.prepare(dropTableQuery).run();
					return;
				}

				// Create table if it doesn't exist
				const keys = Object.keys(data[0]);
				const columns = keys.map((key) => `${key} TEXT`).join(', ');
				const createTableQuery = `CREATE TABLE IF NOT EXISTS ${name} (${columns})`;
				await env.DB.prepare(createTableQuery).run();

				// Get all existing IDs before clearing
				const getAllIdsQuery = `SELECT id FROM ${name}`;
				const existingIds = await env.DB.prepare(getAllIdsQuery).all();

				// Create a set of new IDs from the incoming data
				const newIds = new Set(data.map((item) => item.id));

				// Find IDs that exist in the database but not in the new data (deleted items)
				const deletedIds = existingIds.results
					? existingIds.results.filter((row) => !newIds.has(row.id)).map((row) => row.id.toString())
					: [];

				// Clear existing data from SQL table
				const clearDataQuery = `DELETE FROM ${name}`;
				await env.DB.prepare(clearDataQuery).run();

				// Delete vectors for removed items
				if (deletedIds.length > 0) {
					console.log(`Deleting ${deletedIds.length} vectors for removed items in ${name}...`);
					await env.VECTOR_INDEX.deleteByIds(deletedIds);
				}

				// Insert new data
				const insertDataQuery = `INSERT INTO ${name} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')}) RETURNING *`;
				const preparedQuery = env.DB.prepare(insertDataQuery);

				for (const item of data) {
					// Transform markdown images to GitHub URLs
					let processedItem = { ...item };
					if (item.fullContent) {
						// Construct the markdown file path relative to content directory
						// Assuming the structure: <type>/<filename>.md
						const markdownPath = `${name}/${item.id}.md`;
						processedItem.fullContent = await transformMarkdownImages(item.fullContent, markdownPath);
					}

					const values = keys.map((key) => {
						const value = processedItem[key];
						// Handle undefined values
						if (value === undefined) {
							return null;
						}
						// Convert arrays and objects to JSON strings for D1
						if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
							return JSON.stringify(value);
						}
						return value;
					});

					// Insert record into the database
					const { results } = await preparedQuery.bind(...values).run();
					const record = results[0];
					if (!record) throw new Error(`Failed to create entry in ${name}`);

					// Generate embedding for the content
					const embedding = await step.do(`generate embedding for ${item.id}`, async () => {
						const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
							text: processedItem.fullContent,
						});
						const values = embedding.data[0];
						if (!values) throw new Error('Failed to generate vector embedding');
						return values;
					});

					// Insert embedding into the vector index
					await step.do(`insert vectors for ${item.id}`, async () => {
						return env.VECTOR_INDEX.upsert([
							{
								id: record.id.toString(),
								values: embedding,
								metadata: { data_type: name },
							},
						]);
					});
				}
			});
		}
	}
}
