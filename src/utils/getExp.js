import moment from 'moment';

export default (exp) => {
  return Math.floor(
    exp - moment(new Date()).add(4, 'm').add(30, 's').valueOf() / 1000
  );
};
