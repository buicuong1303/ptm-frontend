import { makeStyles } from '@material-ui/styles';
import {
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  FormHelperText
} from '@material-ui/core';
import React from 'react';
const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row'
  },
  textField: {
    margin: '4px'
  },
  wrapper: {
    margin: '4px'
  }
}));
const CustomRadioField = (props) => {
  // eslint-disable-next-line no-unused-vars
  const classes = useStyles();
  const { field, label, options, form } = props;
  const { name } = field;
  const { errors } = form;
  const showError = errors[name];
  // const handleRadioChange = (event) => {
  //   const value = event.target.value;
  //   setValue(event.target.value);
  //   setHelperText(' ');
  //   setError(false);
  // };

  return (
    <div className={classes.wrapper}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup aria-label="quiz" {...field} className={classes.root}>
        {options &&
          options.map((item) => (
            <FormControlLabel
              control={<Radio />}
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
      </RadioGroup>
      {!!showError && (
        <FormHelperText style={{ color: '#e53935' }}>
          {errors[name]}
        </FormHelperText>
      )}
    </div>
  );
};

export default CustomRadioField;
