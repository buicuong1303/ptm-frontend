/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { makeStyles } from '@material-ui/styles';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Fab } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';

const useStyles = makeStyles((theme) => ({
  btnAdd: {},
}));

const ButtonUpload = (props) => {
  const classes = useStyles();
  const { children, disabled, className, size, accept, handleChooseFile, style, ...rest } = props;

  const onChange = (event) => {
    const files = event.target.files;
    let listFile = [];
    let filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function(f) {
      listFile.push(f);
    });

    handleChooseFile(listFile);
    event.target.value = null;
  };

  // useEffect(() => {
  //   let inputs = document.querySelectorAll('.inputFile');

  //   Array.prototype.forEach.call(inputs, function (input) {
  //     let label = input.nextElementSibling;
  //     let labelVal = label.innerHTML;

  //     input.addEventListener('change', function (e) {
  //       let fileName = '';
  //       if (this.files && this.files.length > 1)
  //         fileName = (this.getAttribute('data-multiple-caption') || '').replace(
  //           '{count}',
  //           this.files.length,
  //         );
  //       else fileName = e.target.value.split('\n').pop();

  //       if (fileName) label.querySelector('span').innerHTML = fileName;
  //       else label.innerHTML = labelVal;
  //     });
  //   });

  // }, []);
  //* render UI
  return (
    <label htmlFor="file">
      <input
        accept={accept}
        style={{ display: 'none' }}
        id="file"
        name="file"
        onChange={(event) => onChange(event)}
        type="file"
      />
      <Fab
        aria-label="add"
        component="span"
        className={className}
        color="primary"
        size={size}
        disabled={disabled}
        style={style}
      >
        {children ? children : <PublishIcon />}
      </Fab>
    </label>

  );
};

ButtonUpload.defaultProps = {
  disabled: false,
  children: null,
  className: '',
  size: 'small',
  style: {}
};

ButtonUpload.propsType = {
  disabled: PropTypes.bool,
  children: PropTypes.any,
  className: PropTypes.any,
  onClick: PropTypes.func,
  size: PropTypes.string,
  style: PropTypes.any
};

export default ButtonUpload;
