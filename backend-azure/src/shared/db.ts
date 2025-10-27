import { CosmosClient } from '@azure/cosmos';

const endpoint = process.env.COSMOS_ENDPOINT || '';
const key = process.env.COSMOS_KEY || '';
const dbName = process.env.COSMOS_DB_NAME || 'candidate-eval';

let client: CosmosClient | null = null;

export function cosmos() {
  if (!endpoint || !key) return null;
  if (!client) client = new CosmosClient({ endpoint, key });
  return client;
}

export async function ensureContainers() {
  const c = cosmos();
  if (!c) return null;
  const { database } = await c.databases.createIfNotExists({ id: dbName });
  await database.containers.createIfNotExists({ id: 'evaluations', partitionKey: '/candidateId' });
  await database.containers.createIfNotExists({ id: 'reports', partitionKey: '/candidateId' });
  return database;
}
