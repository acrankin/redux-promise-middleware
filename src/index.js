export const isPromise = payload => {
  return payload && typeof payload.then === 'function'
};

export const middleware = store => next => action => {
  // Check if the payload is a promise using the isPromise function
  if(!isPromise(action.payload)) return next(action);
  //dispatch new loading action
  store.dispatch({
    type: 'LOAD_START'
  });

  return action.payload
    .then(result => {
    //do the promise action
    })
    .catch(err => {
      //dispatch DONE_LOADING
      store.dispatch({ type: 'LOAD_END' })
      //dispatch the error action
      store.dispatch({ type: 'ERROR', payload: err });
    })

}