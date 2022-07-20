/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import SensitiveItem from '../SensitiveItem';

const useStyles = makeStyles((theme) => ({
  sensitiveList: {
    flex: 1,
    padding: theme.spacing(1, 1),
    overflowY: 'auto'
  }
}));

function SensitiveList(props) {
  const { sensitives, onEdit, onDelete, authorPermission } = props;
  const classes = useStyles();

  return (
    <ul className={classes.sensitiveList}>
      {sensitives.map((sensitive, index) => (
        <SensitiveItem
          key={index}
          sensitive={sensitive}
          onEdit={onEdit}
          onDelete={onDelete}
          index={index}
          no={index + 1}
          authorPermission={authorPermission}
        />
      ))}
    </ul>
  );
}

SensitiveList.propTypes = {
  sensitives: PropTypes.array,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

SensitiveList.defaultProps = {
  sensitives: []
};
export default SensitiveList;
