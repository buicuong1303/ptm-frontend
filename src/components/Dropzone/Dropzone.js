/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import { makeStyles } from '@material-ui/styles';
import React, { useCallback, useState, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import iconFileZip from 'images/zip.png';
import iconVideo from 'images/video-file.png';
import iconAudio from 'images/audio-file.png';
import iconFile from 'images/file.png';
import { readAsArrayBuffer } from 'utils/readFilePromise';
import { IconButton, Tooltip } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { convertFileSize } from 'utils/convertFileSize';
import { getTypeFile } from 'utils/getTypeFile';
import { useSnackbar } from 'notistack';
import apiStatus from 'constants/apiStatus';
import { convertBufferToBase64 } from 'utils/convertBufferToBase64';
import FILE from 'constants/file';
const useStyles = makeStyles((theme) => ({
  dropzoneGroup: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  dropzoneReview: {
    position: 'relative',
    display: 'flex',
    maxHeight: '200px',
    boxShadow: '0 0 0 1px rgb(63 63 68 / 5%), 0 1px 3px 0 rgb(63 63 68 / 15%)',
    borderRadius: '4px',
    marginBottom: theme.spacing(1)
  },
  clearAttach: {
    position: 'absolute',
    top: '50%',
    right: '0px',
    margin: '0px',
    transform: 'translate(calc(100% + 32px), -50%)',
    padding: '2px',
    border: 'solid #ff0000ad 2px',
    color: '#ff0000ad',
    transition: 'all .5s',
    '&:hover': {
      transition: 'all .3s',
      transform: 'translate(calc(100% + 30px), -50%) scale(1.3)'
    }
  },
  files: {
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'auto',
    padding: theme.spacing(1)
  },
  fileItem: {
    float: 'left',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(1),
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(1),
    '&:hover': {
      '& > svg': {
        display: 'block'
      }
    }
  },
  infoFile: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '10px',
    position: 'relative'
  },
  filePath: {
    fontSize: '15px',
    fontWeight: 'bold',
    lineHeight: '20px',
    // display: '-webkit-box',
    WebkitLineClamp: '1',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginRight: theme.spacing(4)
  },
  fileSize: {
    fontSize: '11px',
    color: 'grey'
  },
  action: {
    display: 'none',
    zIndex: 9999,
    position: 'absolute',
    top: 0,
    right: 0,
    color: '#ff00009c',
    cursor: 'pointer',
    borderRadius: '50%',
    transition: 'all .5s',
    '&:hover': {
      color: '#ff0000',
      transform: 'scale(1.5)',
      transition: 'all .3s'
    }
  },
  dropzoneForm: {
    border: 'none',
    position: 'relative',
    display: 'flex',
    '&:focus': {
      outline: 'none'
    }
  }
}));

const Dropzone = forwardRef((props, ref) => {
  const { children, limitFile, setFiles, files, ...rest } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  //* show notification
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  //* handle drop file
  const onDrop = async (acceptedFiles) => {
    let totalSize = 0;
    let totalFiles = [...acceptedFiles, ...files];

    if (totalFiles.length > FILE.NUMBER_OF_FILES) {
      showSnackbar(`Up to ${FILE.NUMBER_OF_FILES} files`, apiStatus.ERROR);
      return;
    }

    for (let i = 0; i < totalFiles.length; i++) {
      totalSize += totalFiles[i].size;
      if (totalSize > FILE.MAX_SIZE) {
        break;
      }
      let url = URL.createObjectURL(totalFiles[i]);
      totalFiles[i]['url'] = url;
    }
    if (totalSize > FILE.MAX_SIZE) {
      showSnackbar('Files must be less than 1.5 MB in size', 'error');
      return;
    }
    setFiles(totalFiles);
  };

  //* init dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      '.jpg, .jpeg, .png, .gif, .tif, .tiff, .bmp, .mp4, .mpeg, .mp3, .vcf, .vcard, .rtf, .zip',
    multiple: true
  });

  //* handle remove file
  const handleRemoveFile = (index) => {
    URL.revokeObjectURL(files[index].url);
    files.splice(index, 1);
    setFiles([...files]);
  };

  //* set content dropzone review
  const listFiles = files.map((file, index) => {
    let [category, format] = file.type.split('/');
    let fileReview = {};
    if (category === 'audio') {
      fileReview = { background: '#eeeeee', icon: iconAudio };
    } else if (category === 'video') {
      fileReview = { background: '#eeeeee', icon: iconVideo };
    } else if (category === 'application') {
      if (format === 'zip')
        fileReview = { background: '#eeeeee', icon: iconFileZip };
      else fileReview = { background: '#eeeeee', icon: iconFile };
    }

    return (
      <div
        className={classes.fileItem}
        key={index}
        style={{ backgroundColor: fileReview.background }}
      >
        {category !== 'image' && (
          <>
            <img
              src={fileReview.icon}
              style={{ height: '20px', width: '20px' }}
            />
            <div className={classes.infoFile}>
              <span className={classes.filePath}>{file.name}</span>
              <span className={classes.fileSize} style={{ fontSize: '11px' }}>
                {convertFileSize(file.size)}
              </span>
            </div>
          </>
        )}
        {category === 'image' && (
          <img
            src={file.url}
            style={{
              width: '100%',
              maxWidth: '150px',
              maxHeight: '150px'
            }}
          />
        )}
        <HighlightOffIcon
          className={classes.action}
          onClick={() => handleRemoveFile(index)}
        />
      </div>
    );
  });

  //* render UI
  return (
    <div className={classes.dropzoneGroup}>
      {files.length !== 0 && (
        <div className={classes.dropzoneReview}>
          <div className={classes.files}>{listFiles ? listFiles : null}</div>
          <Tooltip title="Clear attach file">
            <IconButton
              className={classes.clearAttach}
              onClick={() => {
                files.forEach((file) => URL.revokeObjectURL(file.url));
                setFiles([]);
              }}
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </div>
      )}

      <div className={classes.dropzoneForm} {...getRootProps()}>
        <input
          ref={ref}
          className={classes.input}
          id="attachment-button"
          {...getInputProps()}
        />
        {children}
        {isDragActive && (
          <p
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {files.length >= FILE.NUMBER_OF_FILES ? (
              <span style={{ color: 'red' }}>
                Up to {FILE.NUMBER_OF_FILES} files !!!
              </span>
            ) : (
              <span style={{ color: '#3f51b5' }}>Drop the files here ...</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
});

Dropzone.defaultProps = {
  children: null,
  files: [],
  setFiles: null
};

Dropzone.propsType = {
  children: PropTypes.any,
  setFiles: PropTypes.func,
  files: PropTypes.array
};

export default Dropzone;
