import { makeStyles } from '@material-ui/styles';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
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
  const { className, columns } = props;
  const classes = useStyles();

  const renderTableHead = (columns) => {
    return columns.map((column, index) => (
      <div style={{ ...column.cellStyles, fontWeight: 'bold' }} key={index}>
        {column.name}
      </div>
    ));
  };

  return (
    <div className={clsx(classes.header, className)}>
      {renderTableHead(columns)}
    </div>
  );
};

export default TableHead;

TableHead.propTypes = {
  className: PropTypes.string,
  columns: PropTypes.array.isRequired
};
