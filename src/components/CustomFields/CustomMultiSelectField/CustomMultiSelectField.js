import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import {
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select
} from '@material-ui/core';
import React, { useState } from 'react';
// eslint-disable-next-line
const useStyles = makeStyles(theme => ({
  formControl: {},
  label: {
    backgroundColor: '#ffffff',
    padding: '0 5px'
  }
}));
// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       height: ITEM_HEIGHT * 8.5 + ITEM_PADDING_TOP,
//       width: 250,
//     }
//   }
// };
const CustomMultiSelectField = (props) => {
  const classes = useStyles();
  const { field, label, className, listAgent, form } = props;
  const { name } = field;
  // eslint-disable-next-line
  const [items,setItems] = useState([]);
  const { errors, touched } = form;

  const hasError = errors[name] && touched[name];

  const handleSelectChange = () => {
    const changeEvent = {
      target: {
        name: name,
        value: items
      }
    };
    field.onChange(changeEvent);
  };

  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      items.push(event.target.name);
    }
    if (event.target.checked === false) {
      const index = items.indexOf(event.target.name);
      items.splice(index, 1);
    }
  };

  return (
    <FormControl
      className={clsx(className, classes.formControl)}
      variant="outlined"
      error={hasError}
    >
      <InputLabel
        className={classes.label}
        id="demo-mutiple-checkbox-label"
        shrink
        variant="outlined"
      >
        {label}
      </InputLabel>
      <Select
        id="demo-mutiple-checkbox"
        labelId="demo-mutiple-checkbox-label"
        multiple
        {...field}
        // MenuProps={MenuProps}
        // defaultValue={[]}
        displayEmpty
        label={label}
        margin="dense"
        onChange={handleSelectChange}
        renderValue={(selected) => {
          if (selected.length > 0) {
            if (selected.length === 1) {
              return `${selected[0]}`;
            }
            selected.sort();
            return `${selected[0]} + ${selected.length - 1}`;
          } else {
            return '';
          }
        }}
        value={items}
      >
        {listAgent.map((item) => (
          <MenuItem key={item}>
            <Checkbox
              checked={items.indexOf(item) > -1}
              name={item}
              onChange={handleCheckboxChange}
            />
            <ListItemText primary={item} />
          </MenuItem>
        ))}
        ;
      </Select>
      {hasError ? <FormHelperText>{errors[name]}</FormHelperText> : null}
    </FormControl>
  );
};

export default CustomMultiSelectField;
