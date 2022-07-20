/* eslint-disable no-unused-vars */
/* eslint-disable react/no-multi-comp */
import GroupInput from 'components/GroupInput';
import ListCustomFields from 'components/ListCustomFields';
import React, { useState } from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Tooltip } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
const HighOrderCustomFields = (props) => {
  const { onChange, onRemove, listCustomFields, disable, onAdd, showError } =
    props;
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '5px'
        }}
      >
        <label style={{ fontSize: '11px' }}>Custom fields</label>
        {/* <AddBoxIcon
          color="primary"
          onClick={() => onAdd()}
          style={{ cursor: 'pointer' }}
        /> */}
        <Tooltip title="Invalid fields [companyPhone, customerPhone, time, status, content]">
          <IconButton
            color="inherit"
            id="export"
            aria-controls="export-menu"
            aria-haspopup="true"
          >
            <HelpOutlineIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div style={{ display: 'flex' }}>
        {listCustomFields.length > 0 && (
          <GroupInput>
            <ListCustomFields
              listCustomFields={listCustomFields}
              onRemove={onRemove}
              onChange={onChange}
              showError={showError}
              disable={disable}
            />
          </GroupInput>
        )}
      </div>
    </div>
  );
};

const GroupInputField = (props) => {
  const { field, form, disable } = props;
  const { name, value } = field;
  const { errors, isSubmitting, touched } = form;

  const handleRemoveField = (index) => {
    if (value[index]['status'] === 'active')
      value[index]['status'] = 'inactive';
    else value[index]['status'] = 'active';
    form.setFieldValue(name, [...value]);
  };

  const handleChangeField = (newData) => {
    form.setFieldValue(name, [...newData]);
  };

  const handleAddField = () => {
    form.setFieldValue(name, [
      ...value,
      { field: '', column: '', status: 'active' }
    ]);
  };

  let showError = false;
  if ((errors[name] && touched[name]) || (errors[name] && isSubmitting))
    showError = true;

  return (
    <HighOrderCustomFields
      name={name}
      onChange={handleChangeField}
      onRemove={handleRemoveField}
      onAdd={handleAddField}
      disable={disable}
      listCustomFields={value}
      showError
    />
  );
};

export default GroupInputField;
