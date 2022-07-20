/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import CompanyItem from '../CompanyItem';
import AppDetails from '../AppDetails';
import ErrorDetails from '../ErrorDetails';

const useStyles = makeStyles((theme) => ({
  companyList: {
    padding: '8px',
    overflowY: 'auto'
  }
}));

function CompanyList(props) {
  const { dataCompany, onEdit, onRemove, canDelete, canUpdate } = props;
  const classes = useStyles();

  const [appDetails, setAppDetails] = useState({});
  const [openAppDetails, setOpenAppDetails] = useState(false);
  const handleOpenAppDetails = () => setOpenAppDetails(true);
  const handleCloseAppDetails = () => setOpenAppDetails(false);

  const [errorDetails, setErrorDetails] = useState({});
  const [openErrorDetails, setOpenErrorDetails] = useState(false);
  const handleOpenErrorDetails = () => setOpenErrorDetails(true);
  const handleCloseErrorDetails = () => setOpenErrorDetails(false);

  return (
    <>
      <ul className={classes.companyList}>
        {dataCompany.map((company, index) => (
          <CompanyItem
            key={index}
            stt={index + 1}
            company={company}
            onEdit={onEdit}
            onRemove={onRemove}
            canDelete={canDelete}
            canUpdate={canUpdate}
            setAppDetails={setAppDetails}
            handleOpenAppDetails={handleOpenAppDetails}
            setErrorDetails={setErrorDetails}
            handleOpenErrorDetails={handleOpenErrorDetails}
          />
        ))}
      </ul>

      <AppDetails
        open={openAppDetails}
        onClose={handleCloseAppDetails}
        data={appDetails}
      />

      <ErrorDetails
        open={openErrorDetails}
        onClose={handleCloseErrorDetails}
        data={errorDetails}
      />
    </>
  );
}

CompanyList.propTypes = {
  dataCompany: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

CompanyList.defaultProps = {
  dataCompany: []
};
export default CompanyList;
