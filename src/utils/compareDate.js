const compareDate = (date1, date2, asc = true) => {
  if (new Date(date1) > new Date(date2)) return asc;
  else if (new Date(date1) < new Date(date2)) return -asc;
  else return 'equal';
};

export default compareDate;
