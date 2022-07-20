import { makeStyles } from '@material-ui/styles';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '40px',
    backgroundColor: theme.palette.header.primary
  },
  headerItem: {
    fontWeight: 'bold'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: '40px',
    backgroundColor: theme.palette.header.primary,
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    padding: theme.spacing(1, 2)
  }
}));
const TableHead = (props) => {
  const classes = useStyles();
  const renderTableHead = (columns) => {
    let jsx = '';
    jsx = columns.map((column, index) => (
      <div
        style={{
          flex: column.flex,
          textAlign: column.textAlign,
          marginLeft: column.marginLeft,
          fontWeight: 'bold'
        }}
        key={index}
      >
        {column.name}
      </div>
    ));
    return jsx;
  };
  return (
    <div className={clsx(classes.header, props.className)}>
      {renderTableHead(props.columns)}
    </div>
  );
};

export default TableHead;
TableHead.propTypes = {
  columns: PropTypes.array.isRequired
};
