import { isPromise, middleware } from './index';
import { createStore, applyMiddleware } from 'redux';

describe('isPromise', () => {
  test('it returns true if passed a promise', () => {
    const promise = new Promise((resolve, reject) => {
      console.log('foo');
    });
    expect(isPromise(promise)).toEqual(true);
  });

  test('it returns false if passed anything other than a promise', () => {
    const notPromise = { hair: 'red', eyes: 'blue' };
    expect(isPromise(notPromise)).toEqual(false);
  })
});

describe('promise middleware', () => {
  const reducer = jest.fn((state) => state);
  const store = createStore(reducer, {}, applyMiddleware(middleware));

  test('resolves promise and pushes payload to the reducer', () => {
    const promise = Promise.resolve('ouch');
    store.dispatch({
      type: 'PROMISE_ACTION',
      payload: promise
    });

    return promise.then(() => {
      expect(reducer.mock.calls).toContain([{}, { type: 'PROMISE_ACTION', payload: 'ouch'}])
    })
  })
})