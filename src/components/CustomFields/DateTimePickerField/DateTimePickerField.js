/* eslint-disable no-unused-vars */
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React from 'react';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import { FormHelperText } from '@material-ui/core';

const DateTimePickerField = (props) => {
  const { field, label, form } = props;
  const { name, value } = field;
  const { errors, touched, isSubmitting } = form;
  const handleDateChange = (value) => {
    const date = value;
    const changeEvent = {
      target: {
        name: name,
        value: moment(date, 'YYYY-MM-DD hh:mm:ss A').format()
      }
    };

    field.onChange(changeEvent);
  };
  let showError = false;
  if (errors[name] || (errors[name] && isSubmitting)) showError = true;

  return (
    <>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DateTimePicker
          label={label}
          value={value ? value : new Date()}
          disablePast
          error={showError}
          onChange={handleDateChange}
          variant="dialog"
          inputVariant="outlined"
        />
      </MuiPickersUtilsProvider>
      {showError && <FormHelperText error>{errors[name]}</FormHelperText>}
    </>
  );
};

DateTimePickerField.defaultProps = {
  value: null
};
export default DateTimePickerField;
