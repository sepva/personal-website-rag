import { WorkflowEntrypoint } from 'cloudflare:workers';
// import { Hono } from 'hono';
import { allContent } from './data/mockData';
// const app = new Hono();

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

// app.post('/data', async (c) => {
// 	await c.env.RAG_WORKFLOW.create();
// 	return c.text('Created note', 201);
// });

// app.get('/data/:dataType/:query', async (c) => {
// 	const { dataType, query } = c.req.param();
// 	const env = c.env;

// 	// Generate embedding for the query
// 	const queryEmbedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
// 		text: query,
// 	});
// 	const queryVector = queryEmbedding.data[0];
// 	if (!queryVector) throw new Error('Failed to generate query vector embedding');

// 	// Query the vector index
// 	const searchResults = await env.VECTOR_INDEX.query(queryVector, {
// 		topK: 1,
// 		filter: { data_type: dataType },
// 	});

// 	let vecId;
// 	if (searchResults.matches && searchResults.matches.length > 0 && searchResults.matches[0]) {
// 		vecId = searchResults.matches[0].id;
// 	} else {
// 		console.log('No matching vector found or searchResults.matches is empty');
// 	}

// 	// Retrieve full records from D1
// 	if (vecId) {
// 		const getRecordQuery = `SELECT * FROM ${dataType} WHERE id = ?`;
// 		const { results } = await env.DB.prepare(getRecordQuery).bind(vecId).all();
// 		return c.json(results);
// 	} else {
// 		return c.json({ message: 'No matching records found' }, 404);
// 	}
// });

// export default app;
