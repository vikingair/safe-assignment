# Safe Assignment

[![JSR](https://jsr.io/badges/@backend/safe-assignment)](https://jsr.io/@backend/safe-assignment)
[![JSR Score](https://jsr.io/badges/@backend/safe-assignment/score)](https://jsr.io/@backend/safe-assignment)

> ⚠️ This is a type-safe implementation of the
> [safe-assignment operator](https://github.com/arthurfiorette/proposal-safe-assignment-operator)
> as a function without requiring JS syntax changes. It can be used for a smooth
> transition while the proposal might progress or be rejected. In any case it
> should help us to get a better feeling about using a different kind of error
> handling in JS might be useful or not.

## Design decisions

- The explicit error handling of the Go programming language is the role model
- Hence, a tuple will be returned to allow arbitrary naming and mimic the Go
  code
- In contrary to Go, the error will be returned on first position, to make it
  more obvious if an error would be ignored, i.e.,
  `const [result] = await withErr(p)` vs. `const [, result] = await withErr(p)`.
  We will not force to handle the error in order to read the returned value,
  which could then be potentially also `undefined`.
- The name of the function should be short, but clearly distinguishable from
  reserved keywords such as `try` and meaningful
- The wrapper should support wrapping `Promise` as well as functions that don't
  require any params, but may return any values.
- When the provided function runs synchronous code (i.e. not returning a
  promise), wrapping it will stay a synchronous operation as well.

## Example usages

```ts
import { withErr } from "@backend/safe-assignment";

// Async Function:
const [err, resp] = await withErr(loadMyData);

// Promise
const [err, result] = await withErr(somePromise);

// Sync Function
const [err, data] = withErr(() => parseData(someData));
```

## Already noticed caveats

- In Go, the error variable could be redeclared with the same name, which is why
  usually the `err` variable exists exactly once for a chain of checks. This is
  not possible in TS unless the response type would stay the same or would be
  initially declared as a union of all types returned by the checks. However,
  this is possible in general in JS using `let`s, and if the proposal will make
  it through, TS could potentially provide a way to transform such code in a way
  that it will work just as in Go.
- When handling different errors always the same way, the resulting code will be
  more boilerplate.
