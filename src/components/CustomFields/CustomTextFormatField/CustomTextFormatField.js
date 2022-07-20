import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

const TextFieldNumberFormat = (props) => {
  const {
    inputRef,
    onChange,
    isDollar,
    isPercent,
    isYear,
    thousandSeparator,
    maxValue,
    onUpdateValueField,
    isSsn,
    isPhoneNumber,
    ...other
  } = props;

  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const onKeyUp = () => {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    setDebounceTimeout(
      setTimeout(() => {
        if (onUpdateValueField) {
          onUpdateValueField();
        }
      }, 400)
    );
  };

  return (
    <NumberFormat
      {...other}
      format={isPhoneNumber ? '(###) ###-####' : isSsn ? '###-##-####' : false}
      getInputRef={inputRef}
      onKeyUp={onKeyUp}
      onValueChange={(values) => {
        onChange({
          target: {
            value: maxValue
              ? values.value <= Number(maxValue)
                ? values.value
                : Number(maxValue)
              : values.value
          }
        });
      }}
      prefix={isDollar ? '$' : ''}
      suffix={isPercent ? '%' : isYear ? ' (Years)' : ''}
      thousandSeparator={thousandSeparator}
    />
  );
};

TextFieldNumberFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdateValueField: PropTypes.any
};

export default TextFieldNumberFormat;
