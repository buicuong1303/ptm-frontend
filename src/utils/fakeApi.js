const fakeApi = (resolve = true, data, delay) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (resolve) return res({ data: data });
      return rej();
    }, delay);
  });
};

export default fakeApi;
