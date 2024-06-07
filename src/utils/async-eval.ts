export const asyncEval = async (code: string) => {
  const result = eval(code);

  if (result instanceof Promise) {
    return await result;
  }

  return result;
};
