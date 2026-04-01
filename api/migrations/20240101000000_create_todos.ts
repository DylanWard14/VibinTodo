import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('todos', (table) => {
    table.text('id').primary();
    table.text('user_id').notNullable().index();
    table.text('text').notNullable();
    table.boolean('completed').notNullable().defaultTo(false);
    table.bigInteger('created_at').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('todos');
}
