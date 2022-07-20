import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import GetAppIcon from '@material-ui/icons/GetApp';
import CloseIcon from '@material-ui/icons/Close';
import * as PropTypes from 'prop-types';
import * as FileSaver from 'file-saver';
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
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
}));
function MyModalImage({ open, onClose, name, url, width }) {
  const classes = useStyles();

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleDownload = async () => {
    url = url.slice(0, 25) + '-' + url.slice(26); //* to download file
    FileSaver.saveAs(url, name);
  };
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className={classes.modalContainer}>
          <div className={classes.modalHeader}>
            <GetAppIcon className={classes.icon} onClick={handleDownload} />
            <CloseIcon className={classes.icon} onClick={handleClose} />
          </div>
          <div className={classes.imageContent}>
            <img
              src={url}
              style={{
                borderRadius: '5px',
                maxWidth: 800,
                minWidth: width <= 800 ? `${width}px` : 800
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}

MyModalImage.defaultProps = {
  open: false,
  width: 100
};

MyModalImage.propTypes = {
  onDownload: PropTypes.func,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  name: PropTypes.string,
  url: PropTypes.string,
  onOpen: PropTypes.func,
  width: PropTypes.number
};
export default MyModalImage;
