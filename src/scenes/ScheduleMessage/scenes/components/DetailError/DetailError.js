/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Dialog, DialogContent } from '@material-ui/core';
import PropTypes from 'prop-types';
import Error from './Components';

const useStyles = makeStyles((theme) => ({
  root: {},

  dialogErrorTitle: {
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    color: '#d10000',
    fontSize: '16px',
    fontWeight: 'bold'
  },

  dialogWarningTitle: {
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    color: '#eb9902',
    fontSize: '16px',
    fontWeight: 'bold'
  },

  dialogContent: {
    display: 'flex',
    minWidth: '1000px',
    minHeight: '400px',
    flexDirection: 'column',
    fontSize: '15px',
    overflow: 'unset !important',
    padding: '0px !important'
  },

  tableFile: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    height: '0px',
    flex: '1'
  },

  headerTable: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#c1c1c1',
    padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`
  },

  headerTableItem: {
    textAlign: 'left',
    paddingLeft: theme.spacing(2),
    margin: 'auto'
  },

  list: {
    height: '0px',
    overflow: 'auto',
    margin: '0px',
    flex: '100%',
    '&::-webkit-scrollbar': {
      width: '5px'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 5px grey'
    },
    '&:-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main
    }
  },

  nullItem: {
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const DetailError = (props) => {
  // eslint-disable-next-line
  const { dataError, handleCloseDetailError, ...rest } = props;

  const classes = useStyles();

  const initDetailError = {
    fileName: '',
    errors: []
  };
  const [detailError, setDetailError] = useState(initDetailError);

  useEffect(() => {
    const errors = [];
    if (dataError?.invalidPhoneNumber?.length > 0) {
      dataError?.invalidPhoneNumber.map((item) => {
        errors.push(item);
        return item;
      });
    }
    if (dataError?.optOutPhoneNumber?.length > 0) {
      dataError?.optOutPhoneNumber.map((item) => {
        errors.push(item);
        return item;
      });
    }
    setDetailError({
      fileName: dataError.fileName,
      errors: errors
    });
  }, [dataError]);

  return (
    <div style={{ margin: '0px' }}>
      <Grid item lg={10} sm={12} xs={12}>
        <Dialog
          aria-labelledby="form-dialog-title"
          maxWidth="lg"
          onClose={handleCloseDetailError}
          open={dataError.open}
          style={{ overflow: 'unset' }}
        >
          <div className={classes.dialogErrorTitle}>
            Detail Error - {detailError.fileName}
          </div>

          <DialogContent className={classes.dialogContent}>
            <div className={classes.tableFile}>
              <div className={classes.headerTable}>
                <div className={classes.headerTableItem} style={{ flex: '1' }}>
                  No
                </div>
                <div className={classes.headerTableItem} style={{ flex: '4' }}>
                  Column Name
                </div>
                <div className={classes.headerTableItem} style={{ flex: '2' }}>
                  Row
                </div>
                <div className={classes.headerTableItem} style={{ flex: '2' }}>
                  Location
                </div>
                <div className={classes.headerTableItem} style={{ flex: '6' }}>
                  Value
                </div>
                <div className={classes.headerTableItem} style={{ flex: '6' }}>
                  Message
                </div>
              </div>
              <ul className={classes.list}>
                {detailError?.errors?.length > 0 ? (
                  detailError?.errors?.map((error, index) => (
                    <Error error={error} key={index} no={index + 1} />
                  ))
                ) : (
                  <div className={classes.nullItem}>
                    No files have been selected
                  </div>
                )}
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </Grid>
    </div>
  );
};

export default DetailError;

DetailError.propTypes = {
  detailError: PropTypes.object,
  handleCloseDetailError: PropTypes.func
};
