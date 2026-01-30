import { WorkflowEntrypoint } from 'cloudflare:workers';
import { allContent } from './data/allContent.ts';


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
				return Response.json(
					{ success: false, error: 'Server configuration error' },
					{ status: 500 }
				);
			}

			if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
				console.warn('Unauthorized attempt to trigger RAGWorkflow');
				return Response.json(
					{ success: false, error: 'Unauthorized' },
					{ status: 401 }
				);
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
					{ status: 500 }
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
				// Create table if it doesn't exist
				const keys = Object.keys(data[0]);
				const columns = keys.map((key) => `${key} TEXT`).join(', ');
				const createTableQuery = `CREATE TABLE IF NOT EXISTS ${name} (${columns})`;
				await env.DB.prepare(createTableQuery).run();

				// Get all ids
				const getAllIdsQuery = `SELECT id FROM ${name}`;
				const ids = await env.DB.prepare(getAllIdsQuery).all();

				// Clear existing data from SQL table
				const clearDataQuery = `DELETE FROM ${name}`;
				await env.DB.prepare(clearDataQuery).run();

				// Clear existing vectors from vector index
				if (ids.results && ids.results.length > 0) {
					const vectorIds = ids.results.map((row) => row.id.toString());
					await env.VECTOR_INDEX.deleteByIds(vectorIds);
				}

				// Insert new data
				const insertDataQuery = `INSERT INTO ${name} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')}) RETURNING *`;
				const preparedQuery = env.DB.prepare(insertDataQuery);

				for (const item of data) {
					const values = keys.map((key) => {
						const value = item[key];
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
							text: item.fullContent,
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