/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FileUpload } from 'components';
import { FormHelperText } from '@material-ui/core';
import * as xlsx from 'xlsx';

const FileUploadField = (props) => {
  const {
    form,
    field,
    label,
    className,
    disable,
    multiple,
    accept,
    placeholder,
    handleClearStateValidateSchedule,
    setCustomerFile
  } = props;
  const { name, value } = field;
  const { errors, isSubmitting, touched } = form;

  const handleFileChange = (fileBuffer) => {
    form.setFieldValue(name, fileBuffer);

    if (fileBuffer && fileBuffer.data) {
      const workbook = xlsx.read(fileBuffer.data, { type: 'buffer' });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(ws, { raw: false });
      if (data.length > 0) {
        const headers = xlsx.utils.sheet_to_json(ws, { header: 1 })[0] || [];
        form.setFieldValue(
          'customFields',
          headers.map((header) => ({
            field: '',
            column: header,
            status: 'active'
          }))
        );
      }
    } else {
      form.setFieldValue('customFields', []);
    }
  };
  let showError = false;
  if ((errors[name] && touched[name]) || errors[name]) showError = true;

  return (
    <>
      <FileUpload
        handleClearStateValidateSchedule={handleClearStateValidateSchedule}
        setCustomerFile={setCustomerFile}
        className={className}
        name={name}
        fileInfo={value}
        disable={disable}
        label={label}
        onChange={handleFileChange}
        multiple={multiple}
        accept={accept}
        error={showError}
        placeholder={placeholder}
      />
      {showError && <FormHelperText error>{errors[name]}</FormHelperText>}
    </>
  );
};
FileUploadField.propsType = {
  field: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired,
  multiple: PropTypes.bool,
  accept: PropTypes.array,
  label: PropTypes.string,
  placeholder: PropTypes.string
};
FileUploadField.defaultProps = {
  label: '',
  multiple: false,
  placeholder: ''
};
export default FileUploadField;
