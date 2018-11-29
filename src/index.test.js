import { isPromise } from './index';

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
