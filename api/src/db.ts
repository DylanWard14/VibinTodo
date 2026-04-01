import knex from 'knex';
import config from './knexConfig';

const db = knex(config);

export default db;
