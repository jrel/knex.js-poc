import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("names", function (table) {
    table.string("name");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("names");
}
