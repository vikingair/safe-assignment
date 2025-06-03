type WithErrResultPlain<T> = [Error, undefined] | [undefined, T];
type WithErrResult<T> = T extends Promise<infer U>
  ? Promise<WithErrResultPlain<U>>
  : WithErrResultPlain<T>;
type WithErr<T> = T extends Promise<unknown> ? WithErrResult<T>
  : T extends () => infer U ? WithErrResult<U>
  : never;

const wrapErr = (err: unknown) =>
  err instanceof Error
    ? err
    : new Error(`Non-error object was thrown or rejected: ${err}`);

const handleProm = <T extends Promise<unknown>>(
  p: Promise<T>,
): Promise<WithErrResultPlain<T>> =>
  p.then<WithErrResultPlain<T>, WithErrResultPlain<T>>(
    (r) => [undefined, r],
    (err) => [wrapErr(err), undefined],
  );

/**
 * This function is designed to return an error as first param of the returned tuple, that would require
 * handling before accessing the data type in the success case.
 *
 * @param funcOrProm Can be either a promise or function that is expected to reject or throw an error.
 * @returns The potential error and response as a tuple.
 */
export const withErr = <T extends (() => unknown) | Promise<unknown>>(
  funcOrProm: T,
): WithErr<T> => {
  if (funcOrProm instanceof Promise) {
    return handleProm(funcOrProm) as WithErr<T>;
  }

  try {
    const r = funcOrProm();
    if (r instanceof Promise) return handleProm(r) as WithErr<T>;
    return [undefined, r] as WithErr<T>;
  } catch (err) {
    return [wrapErr(err), undefined] as WithErr<T>;
  }
};
