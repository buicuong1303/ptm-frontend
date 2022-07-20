/* eslint-disable no-unused-vars */
import React from 'react';
import { makeStyles } from '@material-ui/styles';
import GroupItem from '../GroupItem';

const useStyles = makeStyles((theme) => ({
  groupList: {
    // padding: '10px 10px',
    overflowY: 'auto'
  }
}));

function GroupList(props) {
  const { dataGroup, setUpdate, authorPermission } = props;
  const classes = useStyles();

  return (
    <>
      <ul className={classes.groupList}>
        {dataGroup.map((group, index) => (
          <GroupItem
            key={index}
            stt={index + 1}
            group={group}
            setUpdate={setUpdate}
            authorPermission={authorPermission}
          />
        ))}
      </ul>
    </>
  );
}

GroupList.propTypes = {};

GroupList.defaultProps = {
  dataCompany: []
};
export default GroupList;
