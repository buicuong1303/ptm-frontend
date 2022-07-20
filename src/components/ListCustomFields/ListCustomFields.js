/* eslint-disable no-unused-vars */
import { makeStyles, withStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { Checkbox, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: '100%',
    overflowY: 'auto'
  },
  wrapperInput: {
    display: 'flex',
    alignItems: 'start',
    margin: theme.spacing(1, 1, 2)
  },
  customFieldItem: {
    margin: '5px 3px',
    width: '100%',
    '& .MuiFormHelperText-root': {
      position: 'absolute',
      top: '100%',
      marginTop: 0
    }
  },
  removeIcon: {
    color: theme.palette.error.main,
    marginLeft: '2px',
    cursor: 'pointer'
  }
}));

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'blue'
    },
    '& label': {
      color: 'gray'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green'
    }
  }
})(TextField);
let findDuplicates = (arr) =>
  arr.filter((item, index) => arr.indexOf(item) !== index);
const ListCustomFields = ({
  listCustomFields,
  onRemove,
  onChange,
  showError,
  disable
}) => {
  const classes = useStyles();
  const hardFields = [
    'companyPhone',
    'customerPhone',
    'content',
    'time',
    'status'
  ];
  const [customFieldsError, setCustomFieldsError] = useState([]);
  const [columnErrors, setColumnErrors] = useState([]);
  const handleChange = (e) => {
    const indexChange = +e.target.getAttribute('data-index');
    const newData = listCustomFields.map((item, index) => {
      if (indexChange === index)
        return {
          ...item,
          [e.target.name]: e.target.value
        };
      return item;
    });
    onChange(newData);
  };

  useEffect(() => {
    const errors = [];
    const columnErrors = [];
    const listFields = listCustomFields.map((item) => item.field);
    const listColumns = listCustomFields.map((item) => item.column);
    const duplicateFields = [...new Set(findDuplicates(listFields))];
    const duplicateColumns = [...new Set(findDuplicates(listColumns))];
    listCustomFields?.map((item, index) => {
      const error = {};
      const columnError = {};
      if (item.status === 'active') {
        if (!item.field)
          error[0] = {
            message: 'Field is required.'
          };
        if (hardFields.includes(item.field)) {
          error[0] = {
            message: 'Field is invalid.'
          };
        }
        const valueRegex = /^\d+$/;
        if (valueRegex.test(item.field))
          error[1] = {
            message: 'Minimum 1 letter required.'
          };
        if (item.field && duplicateFields.includes(item.field)) {
          error[0] = {
            message: 'Field is duplicated.'
          };
        }
        if (duplicateColumns.includes(item.column)) {
          columnError['message'] = 'Column is duplicated.';
        }
      }
      columnErrors.push(columnError);
      errors.push(error);
      return item;
    });
    setCustomFieldsError(errors);
    setColumnErrors(columnErrors);
  }, [listCustomFields]);
  return (
    <div className={classes.root}>
      {listCustomFields.length > 0 && (
        <>
          {listCustomFields.map((item, index) => (
            <div key={index} className={classes.wrapperInput}>
              <CssTextField
                name="field"
                error={
                  (showError && !item.field && item.status === 'active') ||
                  !!customFieldsError?.[index]?.[0]?.message ||
                  !!customFieldsError?.[index]?.[1]?.message
                }
                className={classes.customFieldItem}
                label="* Field"
                type="text"
                variant="outlined"
                margin="dense"
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  'data-index': index
                }}
                disabled={item.status === 'inactive' ? true : false}
                value={item.field}
                helperText={
                  customFieldsError?.[index]?.[0]?.message ||
                  customFieldsError?.[index]?.[1]?.message
                }
              />
              <CssTextField
                name="column"
                className={classes.customFieldItem}
                label="Column"
                type="text"
                variant="outlined"
                margin="dense"
                InputLabelProps={{
                  shrink: true
                }}
                inputProps={{
                  'data-index': index,
                  readOnly: true
                }}
                onChange={handleChange}
                value={item.column}
                disabled={item.status === 'inactive' ? true : false}
                error={
                  (showError && !item.column && item.status === 'active') ||
                  !!columnErrors?.[index]?.message
                }
                helperText={columnErrors?.[index]?.message}
              />
              {/* <RemoveCircleOutlineIcon
                className={classes.removeIcon}
                onClick={() => onRemove(index)}
              /> */}
              <Checkbox
                checked={item.status === 'active' ? true : false}
                onChange={() => onRemove(index)}
                disabled={disable}
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

ListCustomFields.propTypes = {
  onChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

ListCustomFields.defaultProps = {
  listCustomFields: []
};

export default ListCustomFields;
