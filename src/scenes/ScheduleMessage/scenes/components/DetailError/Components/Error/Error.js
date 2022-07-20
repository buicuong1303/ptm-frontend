import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  fileItem: {
    borderBottom: '1px solid #d2d2d2',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
    transition: 'all 1s',
    '&:hover': {
      backgroundColor: '#e7e7e7'
    }
  },

  header: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#d2d2d2'
  },

  dataItem: {
    paddingLeft: theme.spacing(2),
    textAlign: 'left'
  },

  listDepartment: {
    listStyle: 'none',
    maxHeight: '130px',
    overflowY: 'auto'
  },

  icon: {
    marginRight: '5px'
  }
}));

const Error = (props) => {
  // eslint-disable-next-line
  const { error, no, ...rest} = props;

  const classes = useStyles();

  //* UI
  return (
    <li className={classes.fileItem}>
      <div className={classes.dataItem} style={{ flex: '1' }}>
        {no}
      </div>
      <div className={classes.dataItem} style={{ flex: '4' }}>
        {error.column}
      </div>
      <div className={classes.dataItem} style={{ flex: '2' }}>
        {error.row}
      </div>
      <div className={classes.dataItem} style={{ flex: '2' }}>
        {`[${error.location}]`}
      </div>
      <div className={classes.dataItem} style={{ flex: '6' }}>
        {error.phoneNumber}
      </div>
      <div className={classes.dataItem} style={{ flex: '6' }}>
        {error.message}
      </div>
    </li>
  );
};

Error.propTypes = {
  error: PropTypes.object,
  no: PropTypes.number
};

export default Error;
