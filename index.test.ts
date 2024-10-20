import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { withErr } from "./index.ts";

type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? true : false;

describe("withErr", () => {
    it("computes common dir for absolute paths", () => {
        const [err, resp] = withErr((): { test: string } =>
            JSON.parse('{"test":"foo"}')
        );
        type Check1 = Expect<Equal<typeof resp, { test: string } | undefined>>;
        if (err) throw err;
        type Check2 = Expect<Equal<typeof resp, { test: string }>>;
        expect(resp.test).toBe("foo");
    });
});
