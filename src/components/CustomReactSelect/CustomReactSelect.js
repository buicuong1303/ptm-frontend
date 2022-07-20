/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import chroma from 'chroma-js';

const colourStyles = {
  control: (styles, state) => ({
    ...styles,
    boxShadow: state.isFocused ? '0 0 0 0.1px #2684ff' : null
  }),
  placeholder: (styles) => ({
    ...styles,
    fontSize: '14px',
    color: '#58717d'
  }),
  input: (styles) => ({
    ...styles
  }),

  noOptionsMessage: (styles) => ({
    ...styles,
    fontSize: '14px'
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: isDisabled
        ? null
        : isSelected
        ? data.color
        : isFocused
        ? color.alpha(0.1).css()
        : null,
      color: isDisabled
        ? '#ccc'
        : isSelected
        ? chroma.contrast(color, 'white') > 2
          ? 'white'
          : 'black'
        : data.color,
      fontSize: '16px',
      padding: '10px'
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css()
    };
  },
  indicatorsContainer: (styles) => ({
    ...styles
    // display: 'none'
  }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
    fontSize: '85%',
    padding: '1px 2px'
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white'
    },
    padding: '0px'
  })
};

const CustomReactSelect = (props) => {
  const { className, ...rest } = props;

  return <Select className={className} styles={colourStyles} {...rest} />;
};

CustomReactSelect.propTypes = {
  className: PropTypes.string,
  optionsSelected: PropTypes.array,
  options: PropTypes.array
};
CustomReactSelect.defaultProps = {
  optionsSelected: [],
  options: []
};

export default React.memo(CustomReactSelect);
