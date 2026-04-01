import knex from 'knex';
import config from './knexConfig';

const db = knex(config);

await db.migrate.latest();
await db.destroy();

console.log('Migration complete.');
