/* eslint-disable prettier/prettier */

import entityStatus from './entityStatus';

const compareCompanyCustomer = (oldArray, newArray) => {
  const compareArray = newArray.filter((item) => {
    const indexCompanyInOldArray = oldArray.map(item => item.companyId).indexOf(item.companyId);
    if (oldArray[indexCompanyInOldArray]) {
      if (item.status !== oldArray[indexCompanyInOldArray].status) return true;
      return false;
    } else {
      if (item.status === entityStatus.ACTIVE) return true;
      return false;
    }
  });

  return compareArray;
};

export default compareCompanyCustomer;
