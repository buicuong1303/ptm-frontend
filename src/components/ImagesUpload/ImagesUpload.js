/* eslint-disable no-unused-vars */
import { CardContent, Fab, Grid, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import CancelIcon from '@material-ui/icons/Cancel';
import PropTypes from 'prop-types';
import './style.scss';
import { readAsArrayBuffer } from 'utils/readFilePromise';

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
    margin: '0 2px',
    boxShadow: 'none',
    height: '40px',
    width: '40px',
    backgroundColor: 'transparent'
  },
  input: {
    display: 'none'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  iconDelete: {},
  showIcon: {
    display: 'block'
  },
  listImages: {
    padding: '10px 0px',
    display: 'flex',
    flexWrap: 'wrap'
  }
}));

const ImageUpload = (props) => {
  const classes = useStyles();
  const { name, imagesInfo, onChange } = props;
  const [images, setImages] = useState([...imagesInfo]);
  const handleRemoveImage = (index) => {
    images.splice(index, 1);
    setImages([...images]);
    if (onChange) onChange(images);
  };
  const handleUploadClick = async (event) => {
    const listImages = event.target.files;

    for (let i = 0; i < listImages.length; i++) {
      const dataObject = await readAsArrayBuffer(listImages[i]);
      images.push({
        id: null,
        detail: dataObject
      });
    }
    setImages([...images]);
    if (onChange) onChange(images);
  };
  return (
    <React.Fragment>
      <input
        name={name}
        accept="image/*"
        className={classes.input}
        id="contained-button-image"
        type="file"
        multiple
        onChange={handleUploadClick}
        //* fix lỗi không thể chọn lại hình đã upload trước đó
        onClick={(event) => {
          event.target.value = null;
        }}
      />
      {images.length != 0 && (
        <ul className={classes.listImages}>
          {images.map((image, index) => (
            <li className="imageItem" key={index}>
              <CancelIcon
                onClick={() => handleRemoveImage(index)}
                className="iconDelete"
              />
              <img src={image.detail.data} className={classes.image} />
            </li>
          ))}
        </ul>
      )}
      <label htmlFor="contained-button-image">
        <Fab component="span" className={classes.button}>
          <AddPhotoAlternateIcon />
        </Fab>
      </label>
    </React.Fragment>
  );
};
ImageUpload.defaultProps = {
  imagesInfo: [],
  onChange: null
};
ImageUpload.propsType = {
  name: PropTypes.string.isRequired,
  imagesInfo: PropTypes.array
};
export default ImageUpload;
