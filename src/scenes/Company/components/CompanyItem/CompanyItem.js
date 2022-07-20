import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { CustomButton } from 'components';
import clsx from 'clsx';
import { Visibility } from '@material-ui/icons';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';

const useStyles = makeStyles((theme) => ({
  companyItem: {
    backgroundColor: '#fff',
    padding: '8px',
    borderRadius: '3px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '1px 1px 5px #ccc',
    listStyle: 'none',
    marginBottom: '8px',
    '&:hover': {
      transition: 'all 0s',
      backgroundColor: '#e7e7e7'
    }
  },

  description: {
    flex: 10,
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    display: '-webkit-box',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word'
  },
  actions: {
    margin: '0px 3px'
  },
  controlActions: {
    padding: theme.spacing(2),
    minWidth: '150px',
    backgroundColor: '#fff'
  },
  inactive: {
    color: 'rgb(193, 193, 193)'
  }
}));
function CompanyItem(props) {
  const classes = useStyles();
  const {
    company,
    onEdit,
    onRemove,
    stt,
    canUpdate,
    canDelete,
    setAppDetails,
    handleOpenAppDetails,
    setErrorDetails,
    handleOpenErrorDetails
  } = props;

  const handleEdit = (data) => {
    onEdit(data.id);
  };
  const handleRemove = (data) => {
    onRemove(data.id);
  };

  const showAppDetails = (data) => {
    handleOpenAppDetails();
    setAppDetails(data);
  };

  const showErrorDetails = (data) => {
    handleOpenErrorDetails();
    setErrorDetails(data);
  };

  return (
    <li
      className={clsx(classes.companyItem, {
        [classes.inactive]: company.status === 'inactive'
      })}
    >
      <span style={{ flex: 1 }}>{stt}</span>
      <span style={{ flex: 5 }}>{company.name}</span>
      <span style={{ flex: 3 }}>{company.code}</span>
      <span style={{ flex: 3 }}>{formatPhoneNumber(company.phone)}</span>
      <span style={{ flex: 7 }} className={classes.description}>
        {company.description}
      </span>
      <span style={{ flex: 3 }}>{company.signature.name}</span>
      <span style={{ flex: 2, textAlign: 'center' }}>
        <CustomButton
          onClick={() =>
            showAppDetails({
              name: company.name,
              server: company.server,
              clientId: company.clientId,
              clientSecret: company.clientSecret,
              username: company.username,
              password: company.password,
              extension: company.extension,
              dlrAddress: company.dlrAddress,
              dlrMTT: company.dlrMTT
            })
          }
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          theme="blue"
        >
          <Visibility />
        </CustomButton>
      </span>
      <span style={{ flex: 2 }}>{company.appStatus}</span>
      <span style={{ flex: 2, textAlign: 'center' }}>
        {company.appStatus === 'error' ? (
          <CustomButton
            onClick={() =>
              showErrorDetails({
                name: company.name,
                appError: company.appError ? JSON.parse(company.appError) : {}
              })
            }
            style={{
              minWidth: '40px',
              padding: '0px'
            }}
            theme="blue"
          >
            <Visibility />
          </CustomButton>
        ) : (
          'null'
        )}
      </span>
      {company.status === 'active' ? (
        <span style={{ flex: 2, color: 'rgb(43, 132, 50)' }}>
          {company.status}
        </span>
      ) : (
        <span style={{ flex: 2 }}>{company.status}</span>
      )}

      <div style={{ flex: 3, textAlign: 'center' }}>
        <CustomButton
          onClick={() => handleEdit(company)}
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          theme="blue"
          disabled={!canUpdate}
        >
          <EditIcon />
        </CustomButton>
        <CustomButton
          onClick={() => handleRemove(company)}
          style={{
            minWidth: '40px',
            padding: '0px'
          }}
          disabled={!canDelete}
          theme="red"
        >
          <DeleteIcon />
        </CustomButton>
      </div>
    </li>
  );
}
CompanyItem.propTypes = {
  company: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

CompanyItem.defaultProps = {};
export default CompanyItem;
