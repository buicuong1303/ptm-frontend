import entityStatus from './entityStatus';

const compareCampaignCustomer = (oldArray, newArray) => {
  oldArray.filter((item) => {
    const indexCampaignInOldArray = newArray
      .map((item) => item.value)
      .indexOf(item.value);

    if (!newArray[indexCampaignInOldArray])
      newArray.push({
        ...item,
        status: entityStatus.INACTIVE
      });
  });

  return newArray;
};

export default compareCampaignCustomer;
