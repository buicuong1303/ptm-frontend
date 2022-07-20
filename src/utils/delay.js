const delay = async (milliseconds) => {
  await new Promise((res) => {
    setTimeout(() => {
      res();
    }, milliseconds);
  });
};

export default delay;
