import {
  Checkbox,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import PropTypes from 'prop-types';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    overflow: 'auto'
    // width: '1200px'
  },
  dialogContent: {
    display: 'flex'
  },
  textTableContent: {
    width: '300px'
  },
  permissionTable: {
    marginLeft: '30px',
    border: '1.5px solid',
    height: '100%',
    padding: '10px 10px'
  },
  textFieldResource: {
    marginBottom: theme.spacing(2),
    marginTop: 0,
    marginLeft: '5px'
  },
  textField: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: '5px'
  },
  button: {
    justifyContent: 'flex-end'
  },
  listItem: {
    marginBottom: 5
    // boxShadow: '1px 1px 3px #ccc'
  },
  list: {
    // marginTop: theme.spacing(1),
    maxWidth: 360,
    maxHeight: '380px',
    backgroundColor: theme.palette.background.paper,
    marginLeft: '5%',
    overflow: 'auto',
    position: 'relative',
    '&::-webkit-scrollbar': {
      width: '5px'
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 5px grey'
    },
    '&:-webkit-scrollbar-thumb': {
      background: theme.palette.primary.main
    }
  }
}));

function MultiCheckBox(props) {
  const { options, onChange, selectedItems } = props;
  const classes = useStyles();
  return (
    <div>
      <List dense className={classes.list} style={{ flex: '1' }}>
        {options.map((item, index) => {
          const labelId = `checkbox-list-secondary-label-${item.code}`;
          return (
            <ListItem
              className={classes.listItem}
              key={index}
              onClick={() => onChange(item.value)}
              button
            >
              <ListItemText id={labelId} primary={item.label} />
              <ListItemSecondaryAction>
                <Checkbox
                  edge="end"
                  onChange={() => onChange(item.value)}
                  checked={selectedItems.includes(item.value)}
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}
MultiCheckBox.propType = {
  onChange: PropTypes.func.isRequired
};
export default MultiCheckBox;
