export function myTransform() {
  return async function* (stream) {
    throw new Error("I must be caught!");

    for await (const chunk of stream) {
      yield chunk;
    }
  };
}
