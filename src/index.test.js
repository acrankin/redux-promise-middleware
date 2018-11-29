import { isPromise, middleware } from './index';
import { createStore, applyMiddleware } from 'redux';
import { BADFAMILY } from 'dns';

describe('isPromise', () => {
  it('it returns true if passed a promise', () => {
    const promise = new Promise((resolve, reject) => {
      console.log('foo');
    });
    expect(isPromise(promise)).toEqual(true);
  });

  it('it returns false if passed anything other than a promise', () => {
    const notPromise = { hair: 'red', eyes: 'blue' };
    expect(isPromise(notPromise)).toEqual(false);
  });
});

describe('promise middleware', () => {

  it('passes a LOAD_START action to the reducer', () => {
    const reducer = jest.fn((state) => state);
    const store = createStore(reducer, {}, applyMiddleware(middleware));

    const promise = Promise.resolve('ouch');
    store.dispatch({
      type: 'PROMISE_ACTION',
      payload: promise
    });

    return promise.then(() => {
      expect(reducer.mock.calls[1]).toEqual([{}, { type: 'LOAD_START' }])
    });
  });

  it('passes the LOAD_END action for a successful promise', () => {
    const reducer = jest.fn((state) => state);
    const store = createStore(reducer, {}, applyMiddleware(middleware));

    const promise = Promise.resolve('ouch');
    store.dispatch({
      type: 'PROMISE_ACTION',
      payload: promise
    });

    return promise.then(() => {
      expect(reducer.mock.calls[2]).toEqual([{}, { type: 'LOAD_END' }])
    });

  })

  it('passes the PROMISE_ACTION for a successful promise', () => {
    const reducer = jest.fn((state) => state);
    const store = createStore(reducer, {}, applyMiddleware(middleware));

    const promise = Promise.resolve('ouch');
    store.dispatch({
      type: 'PROMISE_ACTION',
      payload: promise
    });

    return promise.then(() => {
      expect(reducer.mock.calls[3]).toEqual([{}, { type: 'PROMISE_ACTION', payload: 'ouch' }])
    });
  });

  it('passes the LOAD_END action for an unsuccessful promise', () => {
    const reducer = jest.fn((state) => state);
    const store = createStore(reducer, {}, applyMiddleware(middleware));
    const FAKE_ACTION = 'FAKE_ACTION'

    const badPromise = Promise.reject(new Error('fail'));
    return middleware(store)(() => {})({
      type: FAKE_ACTION,
      payload: badPromise
    })
      .finally(() => {
        expect(reducer.mock.calls[2]).toEqual([{}, { type: 'LOAD_END' }])
    });
  });

  it('passes the ERROR action', () => {
    const reducer = jest.fn((state) => state);
    const store = createStore(reducer, {}, applyMiddleware(middleware));
    const FAKE_ACTION = 'FAKE_ACTION'

    const badPromise = Promise.reject(new Error('fail'));
    return middleware(store)(() => {})({
      type: FAKE_ACTION,
      payload: badPromise
    })
      .finally(() => {
      expect(reducer.mock.calls[3]).toEqual([{}, { type: 'ERROR', payload: new Error('fail')}])
    })
  })
});