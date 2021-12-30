import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("names").insert([
    { name: "name 1" },
    { name: "name 2" },
    { name: "name 3" },
    { name: "name 4 \"four\"" },
  ]);
}
