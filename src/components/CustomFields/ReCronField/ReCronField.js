import React from 'react';
import { ReUnixCron } from '@sbzen/re-cron';
function ReCronField(props) {
  const { field } = props;
  const { name, value } = field;
  const handleChange = (value) => {
    const changeEvent = {
      target: {
        name: name,
        value: value
      }
    };
    field.onChange(changeEvent);
  };

  return <ReUnixCron {...field} onChange={handleChange} value={value} />;
}

export default ReCronField;
