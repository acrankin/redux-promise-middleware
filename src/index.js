export const isPromise = payload => {
  return typeof payload.then === 'function'
};
