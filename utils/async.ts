export const promiseAll = (array: Array<Promise<any>>) => {
  return new Promise((resolve, reject) => {
    Promise.all(array)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};
