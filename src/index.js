import { WorkflowEntrypoint } from 'cloudflare:workers';
import { Hono } from 'hono';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { allContent } from './data/mockData';
const app = new Hono();

export class RAGWorkflow extends WorkflowEntrypoint {
	async run(event, step) {
		const env = this.env;
		for (const [name, data] of Object.entries(allContent)) {
			const record = await step.do(`create database record entry for ${name}`, async () => {
				// Create table if it doesn't exist
				const keys = Object.keys(data[0]);
				const columns = keys.map((key) => `${key} TEXT`).join(', ');
				const createTableQuery = `CREATE TABLE IF NOT EXISTS ${name} (${columns})`;
				await env.DB.prepare(createTableQuery).run();

				const query = `INSERT INTO ${name} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')}) RETURNING *`;
				const preparedQuery = env.DB.prepare(query);
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
					const { results } = await preparedQuery.bind(...values).run();
					const record = results[0];
					if (!record) throw new Error(`Failed to create entry in ${name}`);
				}
				return `${data.length} entries created in ${name}`;
			});
		}
		// let texts = await step.do('split text', async () => {
		// 	const splitter = new RecursiveCharacterTextSplitter();
		// 	const output = await splitter.createDocuments(data);
		// 	return output.map((doc) => doc.pageContent);
		// });

		// for (const index in texts) {
		// 	const text = texts[index];
		// 	const record = await step.do(`create database record: ${index}/${texts.length}`, async () => {
		// 		const query = 'INSERT INTO notes (text) VALUES (?) RETURNING *';

		// 		const { results } = await env.DB.prepare(query).bind(text).run();

		// 		const record = results[0];
		// 		if (!record) throw new Error('Failed to create note');
		// 		return record;
		// 	});

		// 	const embedding = await step.do(`generate embedding: ${index}/${texts.length}`, async () => {
		// 		const embeddings = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
		// 			text: text,
		// 		});
		// 		const values = embeddings.data[0];
		// 		if (!values) throw new Error('Failed to generate vector embedding');
		// 		return values;
		// 	});

		// 	await step.do(`insert vector: ${index}/${texts.length}`, async () => {
		// 		return env.VECTOR_INDEX.upsert([
		// 			{
		// 				id: record.id.toString(),
		// 				values: embedding,
		// 			},
		// 		]);
		// 	});
		// }
	}
}

app.post('/data', async (c) => {
	await c.env.RAG_WORKFLOW.create();
	return c.text('Created note', 201);
});

export default app;
