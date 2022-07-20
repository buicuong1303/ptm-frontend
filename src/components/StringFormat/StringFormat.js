/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  stringFormat: {}
}));

const StringFormat = (props) => {
  const {
    isDollar,
    isPercent,
    isHours,
    isMinutes,
    thousandSeparator,
    isPhoneNumber,
    value,
    ...other
  } = props;

  const classes = useStyles();

  return (
    <NumberFormat
      {...other}
      format={
        isPhoneNumber && value
          ? value.length > 10
            ? value.indexOf('+1') !== -1
              ? '(###) ###-####'
              : '+#(###) ###-####'
            : '#'.repeat(value.length)
          : false
      }
      prefix={isDollar ? '$' : ''}
      suffix={isPercent ? '%' : isHours ? ' hrs' : isMinutes ? ' mins' : ''}
      thousandSeparator={thousandSeparator}
      value={
        isPhoneNumber && value
          ? value.indexOf('+1') !== -1
            ? value.slice(2)
            : value
          : value
      }
      readOnly
      className={classes.stringFormat}
      displayType="text"
    />
  );
};

StringFormat.propTypes = {
  isDollar: PropTypes.bool,
  isPercent: PropTypes.bool,
  isHours: PropTypes.bool,
  isMinutes: PropTypes.bool,
  thousandSeparator: PropTypes.bool,
  isPhoneNumber: PropTypes.bool,
  value: PropTypes.any
};

export default StringFormat;
