import { Checkbox, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
  checkField: {
    margin: '4px'
  }
}));
const CustomCheckField = (props) => {
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const { form, field, label, className } = props;
  const { value, name } = field;
  const handleChange = () => {
    form.setFieldValue(name, !value);
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value}
          onChange={handleChange}
          className={className ? className : classes.checkField}
          color="primary"
          name={name}
          value={value}
        />
      }
      label={label}
    />
  );
};

export default CustomCheckField;
