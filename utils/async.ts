export const promiseAll = (array: Promise<any>[]) => {
  return new Promise((resolve, reject) => {
    Promise.all(array)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};
