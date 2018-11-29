export const isPromise = payload => {
  return payload && typeof payload.then === 'function'
};

export const middleware = store => next => action => {
  if(!isPromise(action.payload)) return next(action);
  store.dispatch({
    type: 'LOAD_START'
  });

  return action.payload
    .then(result => {
      store.dispatch({ type: 'LOAD_END' });
      store.dispatch({ type: 'PROMISE_ACTION', payload: result });
    })
    .catch(err => {
      store.dispatch({ type: 'LOAD_END' });
      store.dispatch({ type: 'ERROR', payload: err });
    })
};