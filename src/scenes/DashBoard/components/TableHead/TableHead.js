import { makeStyles } from '@material-ui/styles';
import React from 'react';
const useStyles = makeStyles(() => ({
  root: {
    height: '40px',
    backgroundColor: '#ccc'
  },
  headerItem: {
    fontWeight: 'bold'
  },
  header: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    padding: '10px 10px'
  }
}));
const TableHead = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <div className={classes.headerItem} style={{ flex: 1 }}>
          No.
        </div>
        <div className={classes.headerItem} style={{ flex: 2 }}>
          Phone
        </div>
        <div className={classes.headerItem} style={{ flex: 10 }}>
          Message
        </div>
        <div className={classes.headerItem} style={{ flex: 2 }}>
          Time
        </div>
        <div
          className={classes.headerItem}
          style={{ flex: 1, textAlign: 'center' }}
        >
          Company
        </div>
      </div>
    </div>
  );
};

export default TableHead;
