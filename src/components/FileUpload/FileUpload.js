/* eslint-disable no-unused-vars */
import { CardContent, Fab, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import iconFile from 'images/excel.png';
import { readAsArrayBuffer } from 'utils/readFilePromise';
import clsx from 'clsx';
import GroupInput from 'components/GroupInput';
import { convertFileSize } from 'utils/convertFileSize';
const useStyles = makeStyles((theme) => ({
  dropContainer: {
    height: '100px',
    border: '1px dashed #ccc',
    position: 'relative',
    // margin: '16px 0',
    //* xóa outline khi focus
    '&:focus': {
      outline: 'none'
    }
  },
  error: {
    border: '1px dashed red'
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    listStyle: 'none',
    position: 'relative',
    marginLeft: '5px'
  },
  infoFile: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '10px',
    position: 'relative',
    width: '100%'
  },
  filePath: {
    width: '90%',
    fontSize: '15px',
    fontWeight: 'bold',
    lineHeight: '20px',
    display: '-webkit-box',
    WebkitLineClamp: '1',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  fileSize: {
    fontSize: '11px',
    color: theme.palette.label.primary
  },
  action: {
    zIndex: 1,
    position: 'absolute',
    // top: 5,
    right: 2,
    color: 'red',
    cursor: 'pointer'
  },
  files: {
    padding: '10px 0px',
    backgroundColor: theme.palette.success.light,
    borderRadius: '10px'
  },
  placeholder: {
    width: '230px',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    color: theme.palette.label.primary
  }
}));
const FileUpload = (props) => {
  const classes = useStyles();
  const {
    name,
    fileInfo,
    onChange,
    label,
    multiple,
    accept,
    disable,
    placeholder,
    error,
    handleClearStateValidateSchedule,
    setCustomerFile
  } = props;
  const handleRemoveFile = (index) => {
    if (onChange) onChange(null, null);
    if (handleClearStateValidateSchedule) handleClearStateValidateSchedule();
  };
  const onDrop = async (acceptedFiles) => {
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      if (setCustomerFile) setCustomerFile(file);

      const fileBuffer = await readAsArrayBuffer(file);
      if (onChange) onChange(fileBuffer);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept,
    multiple: multiple
  });
  const render = () => {
    if (fileInfo.data) {
      return (
        <div className={classes.fileItem}>
          <img
            src={iconFile}
            style={{
              height: '20px',
              width: '20px'
            }}
          />
          <HighlightOffIcon
            className={classes.action}
            onClick={handleRemoveFile}
          />
          <div className={classes.infoFile}>
            <span className={classes.filePath}>{fileInfo.name}</span>
            <span className={classes.fileSize} style={{ fontSize: '11px' }}>
              {convertFileSize(fileInfo.size)}
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <li className={classes.fileItem}>
          <img
            src={iconFile}
            style={{
              height: '20px',
              width: '20px'
            }}
          />
          {disable ? null : (
            <HighlightOffIcon
              className={classes.action}
              disabled={disable}
              onClick={handleRemoveFile}
            />
          )}
          <div className={classes.infoFile}>
            <span className={classes.filePath}>{fileInfo.name}</span>
            <span className={classes.fileSize} style={{ fontSize: '11px' }}>
              {convertFileSize(fileInfo.size)}
            </span>
          </div>
        </li>
      );
    }
  };

  return (
    <React.Fragment>
      {fileInfo ? (
        <GroupInput
          label={label}
          disabled={disable}
          className={props.className}
        >
          <ul className={clsx(classes.files)}>{render()}</ul>
        </GroupInput>
      ) : (
        <div
          className={clsx(classes.dropContainer, props.className, {
            [classes.error]: error === true
          })}
          {...getRootProps()}
        >
          <input
            name={name}
            disabled={disable}
            className={classes.input}
            id="contained-button-file"
            {...getInputProps()}
          />
          <label
            onClick={(event) => event.preventDefault()}
            htmlFor="contained-button-file"
            className={classes.placeholder}
          >
            {placeholder}
          </label>
          {isDragActive ? <p>Drop the files here ...</p> : ''}
        </div>
      )}
    </React.Fragment>
  );
};
FileUpload.defaultProps = {
  label: '',
  filesInfo: [],
  onChange: null
};
FileUpload.propsType = {
  name: PropTypes.string.isRequired,
  filesInfo: PropTypes.array,
  onChange: PropTypes.func,
  label: PropTypes.string
};
export default FileUpload;
