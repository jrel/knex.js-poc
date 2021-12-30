import DB from "./db";

describe("Knex.js POC", () => {
  async function makeSut() {
    const db = await DB();
    return {
      db,
      async destroy() {
        await db.destroy();
      },
    };
  }

  it("should be possible instantiate sut", (done) => {
    expect(async function () {
      const { db, destroy } = await makeSut();
      const actual = await db.raw("SELECT 'test connection' as test;");
      const expected = expect.objectContaining({
        rows: [{ test: "test connection" }],
      });
      expect(actual).toEqual(expected);
      destroy();
      done();
    }).not.toThrow();
  });
  describe("", () => {
    let sut: Awaited<ReturnType<typeof makeSut>>;
    beforeEach(async () => {
      sut = await makeSut();
      await sut.db.migrate.latest();
      await sut.db.seed.run();
    });
    afterEach(async () => {
      await sut.db.migrate.rollback();
      await sut.destroy();
    });

    async function doExpect(
      {
        column,
        operator,
        value,
      }: {
        column: string;
        operator: string;
        value: string;
      },
      result: any
    ) {
      const expectedValue = value.replace(/(")/g, "$1");
      const query = sut.db("names").where(column, operator, value);
      expect(query.toSQL()).toEqual(
        expect.objectContaining({
          sql: `select * from "names" where "${column}" ${operator} ?`,
          bindings: [expectedValue],
        })
      );
      expect(expectedValue).toEqual(query.toSQL().bindings[0]);
      expect(await query).toEqual(result);
    }

    it("should be possible generate where", async () => {
      await doExpect(
        {
          column: "name",
          operator: "=",
          value: "name 1",
        },
        [
          {
            name: "name 1",
          },
        ]
      );
    });

    it("should parse chars from value object", async () => {
      await doExpect(
        {
          column: "name",
          operator: "ilike",
          value: "4",
        },
        []
      );
      await doExpect(
        {
          column: "name",
          operator: "ilike",
          value: '%"%',
        },
        [
          {
            name: 'name 4 "four"',
          },
        ]
      );
    });
  });
});
