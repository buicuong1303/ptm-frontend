/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { makeStyles, withStyles } from '@material-ui/styles';
import React from 'react';
import PropTypes from 'prop-types';
import AttachmentsUpload from 'components/AttachmentsUpload';
import { FormHelperText } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  textField: {
    margin: '4px 0px',
    width: '100%'
  }
}));

const AttachmentsUploadField = (props) => {
  const classes = useStyles();
  const {
    form,
    field,
    className,
    label,
    disable,
    placeholder,
    accept,
    multiple,
    styles
  } = props;
  const { name, value } = field;
  const { errors, isSubmitting, touched } = form;

  const handleImageUrlChange = (images) => {
    form.setFieldValue(name, images);
  };

  let showError = false;
  if ((errors[name] && touched[name]) || errors[name]) showError = true;

  return (
    <div className={className} style={styles}>
      <AttachmentsUpload
        error={showError}
        attachmentUrls={value}
        onChange={handleImageUrlChange}
        label={label}
        disable={disable}
        placeholder={placeholder}
        accept={accept}
        multiple={multiple}
      />
      {showError && <FormHelperText error>{errors[name]}</FormHelperText>}
    </div>
  );
};
AttachmentsUploadField.propTypes = {
  // props của formik
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,

  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  accept: PropTypes.array,
  multiple: PropTypes.bool
};
AttachmentsUploadField.defaultProps = {
  type: 'text',
  label: '',
  placeholder: '',
  multiple: false
};

export default AttachmentsUploadField;
