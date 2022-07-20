import React from 'react';
import Switch from '@material-ui/core/Switch';
import { FormControlLabel } from '@material-ui/core';
const SwitchField = (props) => {
  const { field, form, label } = props;
  const { value, name } = field;
  const handleSwitch = () => {
    form.setFieldValue(name, false);
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={value}
          onChange={handleSwitch}
          name="cron"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      }
      label={label}
    />
  );
};
SwitchField.defaultProps = {
  label: ''
};
export default SwitchField;
