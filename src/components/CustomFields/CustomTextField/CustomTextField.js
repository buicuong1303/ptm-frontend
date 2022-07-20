/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { makeStyles, withStyles } from '@material-ui/styles';
import { TextField } from '@material-ui/core';
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
// eslint-disable-next-line
const useStyles = makeStyles((theme) => ({
  textField: {
    width: '100%',
    '& .MuiFormHelperText-root': {
      position: 'absolute',
      top: '100%',
      marginTop: 0
    }
  }
}));
const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'blue'
    },
    '& label': {
      color: '#263238'
    },
    '& .MuiOutlinedInput-root': {
      // '& fieldset': {
      //   borderColor: 'blue'
      // }
    }
  }
})(TextField);
const CustomTextField = (props) => {
  const {
    field,
    label,
    type,
    className,
    inputProps,
    InputLabelProps,
    form,
    disable,
    multiline,
    maxRows,
    margin,
    styles,
    variant,
    InputProps,
    rows,
    placeholder
  } = props;
  const { name, value } = field;
  const { errors, isValid, touched, isSubmitting } = form;
  let showError = false;

  if (errors[name] && touched[name]) showError = true;
  else if (errors[name] && isSubmitting) showError = true;

  const handleTextFieldChange = (e) => {
    let textValue = e.target.value;
    if (type === 'time' && textValue.split(':').length < 3) {
      textValue = textValue + ':00';
    }

    if (type === 'phone') {
      textValue = textValue.replace(/[^+0-9]/g, '');

      let regexpPlus = /^\+\d{0,11}$/gi;
      let regexp = /^\d{0,10}$/gi;
      let isMatch = false;
      if (textValue && textValue[0] === '+') {
        isMatch = regexpPlus.test(textValue);
      } else {
        isMatch = regexp.test(textValue);
      }
      if (isMatch) {
        const changeEvent = {
          target: {
            name: name,
            value: textValue
          }
        };
        field.onChange(changeEvent);
      }
    } else {
      const changeEvent = {
        target: {
          name: name,
          value: textValue
        }
      };
      field.onChange(changeEvent);
    }
  };
  const classes = useStyles();

  return (
    <>
      <CssTextField
        error={showError}
        id={name}
        {...field}
        InputLabelProps={InputLabelProps}
        className={clsx(classes.textField, className)}
        disabled={disable}
        helperText={showError && errors[name]}
        inputProps={inputProps}
        label={label}
        margin={margin || 'dense'}
        multiline={multiline}
        onChange={handleTextFieldChange}
        maxRows={maxRows}
        rows={rows}
        type={type}
        value={value}
        variant={variant || 'outlined'}
        style={styles}
        InputProps={InputProps}
        placeholder={placeholder}
      />
      {/* {showError && <p>{errors[name]}</p>} */}
    </>
  );
};
CustomTextField.propTypes = {
  // props của formik
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,

  type: PropTypes.string,
  label: PropTypes.string,
  disable: PropTypes.bool,
  placeholder: PropTypes.string
};
CustomTextField.defaultProps = {
  type: 'text',
  label: '',
  placeholder: '',
  disable: false
};

export default CustomTextField;
