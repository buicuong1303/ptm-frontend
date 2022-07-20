/* eslint-disable no-unused-vars */
import MultiCheckBox from 'components/MultiCheckBox';
import React from 'react';

function CustomMultiCheckBoxField(props) {
  const { form, field, options } = props;
  const { name, value: selectedItems } = field;
  const handleCheckBoxChange = (value) => {
    const index = selectedItems.indexOf(value);
    if (index < 0) {
      selectedItems.push(value);
    } else {
      selectedItems.splice(index, 1);
    }
    form.setFieldValue(name, [...selectedItems]);
  };

  return (
    <MultiCheckBox
      name={name}
      selectedItems={selectedItems}
      onChange={handleCheckBoxChange}
      options={options}
    />
  );
}

export default CustomMultiCheckBoxField;
