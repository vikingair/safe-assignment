import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withErr } from "./index.ts";

type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

describe("withErr", () => {
  it("synchronous success", () => {
    const [err, resp] = withErr((): { test: string } =>
      JSON.parse('{"test":"foo"}')
    );
    type Check1 = Expect<Equal<typeof resp, { test: string } | undefined>>;
    if (err) throw err;
    type Check2 = Expect<Equal<typeof resp, { test: string }>>;
    expect(resp.test).toBe("foo");
  });

  it("synchronous fail", () => {
    const [err, resp] = withErr((): number[] => JSON.parse("{"));
    type Check1 = Expect<Equal<typeof resp, number[] | undefined>>;
    type Check2 = Expect<Equal<typeof err, Error | undefined>>;
    expect(err).toBeInstanceOf(Error);
    expect(err!.message).toMatch(/'}' in JSON/);
  });

  it("wraps errors", () => {
    const [err] = withErr((): number[] => {
      throw "ups";
    });
    expect(err).toBeInstanceOf(Error);
    expect(err!.message).toBe(
      "Non-error object was thrown or rejected: ups",
    );
  });

  it("promise success", async () => {
    const [err, resp] = await withErr(Promise.resolve(123));
    type Check1 = Expect<Equal<typeof resp, number | undefined>>;
    if (err) throw err;
    type Check2 = Expect<Equal<typeof resp, number>>;
    expect(resp).toBe(123);
  });

  it("promise fail", async () => {
    const [err, resp] = await withErr(Promise.reject(new Error("ups")));
    type Check1 = Expect<Equal<typeof resp, undefined>>;
    expect(err).toBeInstanceOf(Error);
    expect(err!.message).toBe("ups");
  });

  it("async function success", async () => {
    const [err, resp] = await withErr(() => Promise.resolve(123));
    type Check1 = Expect<Equal<typeof resp, number | undefined>>;
    if (err) throw err;
    type Check2 = Expect<Equal<typeof resp, number>>;
    expect(resp).toBe(123);
  });

  it("async function fail", async () => {
    const [err, resp] = await withErr(() => Promise.reject(new Error("ups")));
    type Check1 = Expect<Equal<typeof resp, undefined>>;
    expect(err).toBeInstanceOf(Error);
    expect(err!.message).toBe("ups");
  });
});
