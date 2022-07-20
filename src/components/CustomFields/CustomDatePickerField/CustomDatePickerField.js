import { makeStyles, withStyles } from '@material-ui/styles';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import clsx from 'clsx';
import moment from 'moment';
const useStyles = makeStyles(() => ({
  picker: {
    margin: '4px',
    width: '100%'
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
})(KeyboardDatePicker);
const CustomDatePickerField = (props) => {
  const classes = useStyles();

  const { field, label, maxDate } = props;
  const { name, value } = field;
  const handleDateChange = (value) => {
    const date = value;
    const changeEvent = {
      target: {
        name: name,
        value: moment(date).format('YYYY-MM-DD')
      }
    };
    field.onChange(changeEvent);
  };
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <CssTextField
        KeyboardButtonProps={{
          'aria-label': 'change date'
        }}
        className={clsx(classes.picker, props.className)}
        disableToolbar
        format="MM/dd/yyyy"
        id="date-picker-inline"
        inputVariant={'outlined'}
        label={label}
        margin="dense"
        maxDate={maxDate}
        onChange={handleDateChange}
        value={value}
        variant="inline"
      />
    </MuiPickersUtilsProvider>
  );
};

CustomDatePickerField.defaultProps = {
  value: null
};
export default CustomDatePickerField;
