/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import SignatureItem from '../SignatureItem';

const useStyles = makeStyles((theme) => ({
  signatureList: {
    flex: 1,
    padding: theme.spacing(1, 1),
    overflowY: 'auto'
  }
}));

function SignatureList(props) {
  const { signatures, onEdit, onDelete, canDelete, canUpdate } = props;
  const classes = useStyles();

  return (
    <ul className={classes.signatureList}>
      {signatures.map((signature, index) => (
        <SignatureItem
          key={index}
          signature={signature}
          onEdit={onEdit}
          onDelete={onDelete}
          index={index}
          no={index + 1}
          canDelete={canDelete}
          canUpdate={canUpdate}
        />
      ))}
    </ul>
  );
}

SignatureList.propTypes = {
  signatures: PropTypes.array,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

SignatureList.defaultProps = {
  signatures: []
};
export default SignatureList;
