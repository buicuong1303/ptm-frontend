/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField as MuiTextField } from '@material-ui/core';
import { useField } from 'formik';

const TextField = (props) => {
  const {
    className,
    style,
    form,
    field,
    inputComponent,
    onUpdateValue,
    readOnly,
    debounce,
    ...rest
  } = props;
  const [fieldChild, meta, helpers] = useField(field.name);

  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [value, setValue] = useState('');

  const onChange = (value) => {
    setValue(value);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    setDebounceTimeout(
      setTimeout(() => {
        form.setFieldValue(field.name, value);
        if (onUpdateValue) {
          onUpdateValue();
        }
      }, debounce)
    );
  };

  useEffect(() => {
    setValue(field.value === null ? '' : field.value);
  }, [field]);

  return inputComponent ? (
    <MuiTextField
      InputProps={{
        inputComponent: inputComponent
      }}
      autoComplete="off"
      className={className}
      error={!!meta.error}
      helperText={meta.error}
      onChange={(event) => onChange(event.target.value)}
      readOnly={readOnly}
      style={style}
      value={value}
      {...rest}
    />
  ) : (
    <MuiTextField
      autoComplete="off"
      className={className}
      error={!!meta.error}
      helperText={meta.error}
      onChange={(event) => onChange(event.target.value)}
      readOnly={readOnly}
      style={style}
      value={value}
      {...rest}
    />
  );
};

TextField.propTypes = {
  className: PropTypes.string,
  inputComponent: PropTypes.any,
  style: PropTypes.object
};

export default React.memo(TextField);
