import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import GetAppIcon from '@material-ui/icons/GetApp';
import CloseIcon from '@material-ui/icons/Close';
import * as PropTypes from 'prop-types';
import * as FileSaver from 'file-saver';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  modalContainer: {
    backgroundColor: '#333333'
  },
  modalHeader: {
    textAlign: 'right',
    backgroundColor: 'rgba(0,0,0,0.7)',
    position: 'absolute',
    top: 0,
    width: '100%'
  },
  icon: {
    color: '#fff',
    fontSize: 25,
    margin: '10px',
    cursor: 'pointer'
  },
  image: {},
  imageContent: {
    width: '100%',
    height: 'calc(100vh - 50px)',
    position: 'absolute',
    bottom: '0%',
    left: '50%',
    transform: 'translate(-50%, 0%)'
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    color: '#ffffff',
    fontWeight: 'bold'
  }
}));

function MyModalDocument({ open, onClose, name, url }) {
  const classes = useStyles();

  const [loaded, setLoaded] = useState(false);

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleDownload = async () => {
    url = url.slice(0, 25) + '-' + url.slice(26); //* to download file
    FileSaver.saveAs(url, name);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={classes.modalContainer}>
        <div className={classes.modalHeader}>
          <GetAppIcon className={classes.icon} onClick={handleDownload} />
          <CloseIcon
            className={classes.icon}
            onClick={() => {
              handleClose();
              setLoaded(false);
            }}
          />
        </div>
        <div className={classes.imageContent}>
          {open && !loaded && <CircularProgress className={classes.loading} />}

          <iframe
            src={'https://docs.google.com/viewer?url=' + url + '&embedded=true'}
            title="file"
            width="100%"
            height="100%"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>
    </Modal>
  );
}

MyModalDocument.defaultProps = {
  open: false
};

MyModalDocument.propTypes = {
  onDownload: PropTypes.func,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  name: PropTypes.string,
  url: PropTypes.string
};
export default MyModalDocument;
