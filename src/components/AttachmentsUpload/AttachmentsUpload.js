/* eslint-disable no-unused-vars */
import { CardContent, Fab, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import CancelIcon from '@material-ui/icons/Cancel';
import PropTypes from 'prop-types';
import './style.scss';
import { readAsArrayBuffer } from 'utils/readFilePromise';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import excelIcon from 'images/excel.png';
import docIcon from 'images/doc.png';
import pdfIcon from 'images/pdf.png';
import zipIcon from 'images/zip.png';
import videoIcon from 'images/video-file.png';
import audioIcon from 'images/audio-file.png';
import unknownIcon from 'images/file.png';
import GroupInput from 'components/GroupInput';
import { useDropzone } from 'react-dropzone';
import clsx from 'clsx';
import { convertBufferToBase64 } from 'utils/convertBufferToBase64';
const useStyles = makeStyles((theme) => ({
  bulkItem: {
    backgroundColor: '#fff',
    padding: '10px 10px',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '1px 1px 5px #ccc',
    listStyle: 'none',
    margin: '4px'
  },
  button: {
    boxShadow: 'none',
    height: '20px',
    width: '35px',
    backgroundColor: 'transparent'
  },
  input: {
    display: 'none'
  },
  image: {
    width: '60px',
    height: '60px',
    borderRadius: '10px'
  },
  fileInfo: {
    textAlign: 'center',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  iconDelete: {},
  showIcon: {
    display: 'block'
  },
  listImages: {
    paddingTop: '5px',
    display: 'flex',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      height: '5px'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 5px gray'
    },
    '&:-webkit-scrollbar-thumb': {
      background: 'red'
    }
  },
  fileName: {
    fontSize: '10px',
    overflow: 'hidden',
    height: '23px',
    maxWidth: '60px',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all'
  },
  attachments: {
    width: '95%'
  },
  dropContainer: {
    height: '100px',
    width: '100%',
    border: '1px dashed #ccc',
    position: 'relative',
    //* xóa outline khi focus
    '&:focus': {
      outline: 'none'
    }
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

const AttachmentsUpload = (props) => {
  const classes = useStyles();
  const {
    name,
    attachmentUrls,
    disable,
    onChange,
    label,
    placeholder,
    accept,
    multiple,
    error
  } = props;
  const [attachments, setAttachments] = useState(
    attachmentUrls ? [...attachmentUrls] : []
  );

  const onDrop = async (acceptedFiles) => {
    for (let i = 0; i < acceptedFiles.length; i++) {
      const dataObject = await readAsArrayBuffer(acceptedFiles[i]);
      attachments.push({
        id: null,
        detail: dataObject
      });
    }
    setAttachments([...attachments]);
    if (onChange) onChange(attachments);
  };
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({ onDrop, accept: accept, multiple: multiple });
  const handleRemoveImage = (index) => {
    attachments.splice(index, 1);
    setAttachments([...attachments]);
    if (onChange) onChange(attachments);
  };
  const handleUploadClick = async (event) => {
    const listImages = event.target.files;

    for (let i = 0; i < listImages.length; i++) {
      const dataObject = await readAsArrayBuffer(listImages[i]);
      attachments.push({
        id: null,
        detail: dataObject
      });
    }
    setAttachments([...attachments]);
    if (onChange) onChange(attachments);
  };
  const renderThumbnail = (file) => {
    if (file.detail) {
      const validExts = {
        image: convertBufferToBase64(file.detail.data),
        video: videoIcon,
        audio: audioIcon
      };
      const [category, type] = file.detail.type.split('/');
      let icon = validExts[category] || unknownIcon;
      if (type === 'zip') icon = zipIcon;
      const fileName =
        file.detail.name || file.url.substring(file.url.lastIndexOf('/') + 1);
      return (
        <div className={classes.fileInfo}>
          <img src={icon} className={classes.image} />
          <div className={classes.fileName}>{fileName}</div>
        </div>
      );
    } else {
      const ext = file.name.slice(file.name.lastIndexOf('.') + 1);
      const validExts = {
        jpg: file.url,
        png: file.url,
        jpeg: file.url,
        gif: file.url,
        svg: file.url,
        bmp: file.url,
        zip: zipIcon,
        mp4: videoIcon,
        mp3: audioIcon,
        mpeg: audioIcon
      };
      return (
        <div className={classes.fileInfo}>
          <img
            src={validExts[ext] ? validExts[ext] : unknownIcon}
            className={classes.image}
          />
          <div className={classes.fileName}>{file.name}</div>
        </div>
      );
    }
  };
  return (
    <div style={{ display: 'flex', position: 'relative' }}>
      {attachments.length != 0 ? (
        <>
          <GroupInput
            label={label}
            className={props.className}
            style={{ maxWidth: '100%' }}
          >
            <ul className={classes.listImages}>
              {attachments.map((file, index) => (
                <li className="imageItem" key={index}>
                  {!disable ? (
                    <CancelIcon
                      onClick={() => handleRemoveImage(index)}
                      className="iconDelete"
                    />
                  ) : null}
                  {renderThumbnail(file)}
                </li>
              ))}
            </ul>
          </GroupInput>
          <input
            name={name}
            className={classes.input}
            disabled={disable}
            id="contained-button-image"
            type="file"
            multiple
            accept={accept.join(',')}
            onChange={handleUploadClick}
            //* fix lỗi không thể chọn lại hình đã upload trước đó
            onClick={(event) => {
              event.target.value = null;
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'start',
              position: 'absolute',
              top: 0,
              right: 0
            }}
          >
            <label
              htmlFor="contained-button-image"
              style={{ marginLeft: 'auto' }}
            >
              <Fab component="span" className={classes.button}>
                <AttachFileIcon />
              </Fab>
            </label>
          </div>
        </>
      ) : (
        <div
          className={clsx(classes.dropContainer, props.className)}
          {...getRootProps()}
        >
          <input
            name={name}
            className={classes.input}
            id="contained-button-image"
            type="file"
            disabled={disable}
            multiple
            onChange={handleUploadClick}
            //* fix error cannot re-pick previous image which was uploaded
            onClick={(event) => {
              event.target.value = null;
            }}
            {...getInputProps()}
          />
          {attachments.length == 0 && (
            <label
              htmlFor="contained-button-image"
              className={classes.placeholder}
              onClick={(event) => event.preventDefault()}
            >
              {placeholder}
            </label>
          )}
          {isDragActive ? <p>Drop the files here ...</p> : ''}
        </div>
      )}
    </div>
  );
};
AttachmentsUpload.defaultProps = {
  attachmentsInfo: [],
  onChange: null
};
AttachmentsUpload.propsType = {
  name: PropTypes.string.isRequired,
  attachmentsInfo: PropTypes.array
};
export default AttachmentsUpload;
