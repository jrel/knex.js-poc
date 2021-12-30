import knex, { Knex } from "knex";

const config: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
  },
  migrations: {
    directory: __dirname + "/.knex/migrations",
  },
  seeds: {
    directory: __dirname + "/.knex/seeds/test",
  },
};

declare module "knex/types/tables" {
  interface Name {
    name: string;
  }

  interface Tables {
    names: Name;
  }
}

export default () => import("../knexfile").then((m) => knex(m.default));
