/* eslint-disable indent */
import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import chroma from 'chroma-js';
import { makeStyles } from '@material-ui/styles';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Close';
import { isArrayEqual } from 'utils/lodashCustom';

import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  select: {
    display: 'flex',
    flex: 1
  },
  selectContainer: {
    flex: 1
  },
  hidden: {
    display: 'none'
  },
  icon: {
    fontSize: '18px'
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      transform: 'scale(1.25)',
      transition: 'transform 0.2s'
    },
    padding: '0px 2px'
  }
}));

const colourStyles = {
  control: (styles, state) => ({
    ...styles,
    backgroundColor: '#ffffff',
    height: '25px',
    minHeight: '25px',
    borderWidth: '0.1px',
    padding: '0px 2px',
    boxShadow: state.isFocused ? '0 0 0 0.1px #2684ff' : null,
    flex: '1 !important',
    display: 'flex !important',
    overflowX: 'auto !important',
    overflowY: 'hidden !important',
    '::-webkit-scrollbar': {
      height: '4px'
    },
    borderRadius: '3px',
    position: 'relative'
  }),
  valueContainer: (styles) => ({
    ...styles,
    padding: '0px',
    flexWrap: 'nowrap !important',
    display: 'flex !important',
    flexDirection: 'row !important',
    minWidth: '100px',
    position: 'absolute'
  }),
  placeholder: (styles) => ({
    ...styles,
    fontSize: '10px'
  }),
  input: (styles) => ({
    ...styles,
    fontSize: '10px',
    position: 'relative',
    height: '100%'
  }),
  indicatorsContainer: (styles) => ({
    ...styles,
    display: 'none'
  }),
  noOptionsMessage: (styles) => ({
    ...styles,
    fontSize: '10px'
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
      fontSize: '10px',
      padding: '5px'
    };
  },
  multiValue: (styles, { data }) => {
    const color = chroma(data.color);
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css()
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: data.color,
    fontSize: '10px',
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

const LabelsSelect = (props) => {
  const { className, optionsSelected, options, onSave, onCancel } = props;
  const classes = useStyles();
  const [isChanged, setIsChanged] = useState(false);
  const [values, setValues] = useState([]);
  const selectRef = useRef(null);

  useLayoutEffect(() => {
    //* set scroll to last position when change value
    const controlElement = selectRef.current.children[0].children[1];

    if (controlElement.scrollWidth > controlElement.clientWidth) {
      controlElement.scrollLeft = controlElement.scrollWidth;
    }
  }, [values]);

  const handleOnChange = (newValues) => {
    setIsChanged(!isArrayEqual(newValues, optionsSelected));
    setValues(newValues);
  };

  const handleSave = (event) => {
    event.preventDefault();
    onSave(values);
  };

  const handleCancel = (event = null) => {
    event?.preventDefault();
    onCancel();
  };

  const handleOnKeyDown = (event) => {
    if (event.code === 'Escape') {
      handleCancel();
    }
  };

  const preventOnClickToParent = (event) => {
    event?.preventDefault();
    event?.stopPropagation();
  };

  return (
    <div
      onClick={preventOnClickToParent}
      className={clsx(classes.root, className)}
    >
      <div className={classes.select} ref={selectRef}>
        <Select
          className={classes.selectContainer}
          defaultValue={optionsSelected}
          closeMenuOnSelect={false}
          isMulti
          options={[...options]}
          styles={colourStyles}
          isClearable={false}
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
          placeholder="Select label..."
          isSearchable
        />
      </div>

      <div onClick={handleCancel} className={classes.button}>
        <CancelIcon className={classes.icon} />
      </div>

      {isChanged && (
        <div onClick={handleSave} className={classes.button}>
          <DoneIcon className={classes.icon} />
        </div>
      )}
    </div>
  );
};

LabelsSelect.propTypes = {
  className: PropTypes.string,
  optionsSelected: PropTypes.array,
  options: PropTypes.array,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
};

export default React.memo(LabelsSelect);
