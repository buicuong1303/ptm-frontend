/* eslint-disable no-unused-vars */
import { Chip } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { CustomButton } from 'components';
import chroma from 'chroma-js';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  root: {},
  labelItem: {
    marginBottom: '8px',
    display: 'flex',
    padding: '8px 8px',
    boxShadow: '1px 1px 5px #ccc',
    listStyle: 'none',
    alignItems: 'center',
    borderRadius: '3px',
    backgroundColor: '#fff',
    transition: 'all .5s',
    '&:hover': {
      transition: 'all 0s',
      backgroundColor: '#e7e7e7'
    }
  },
  chip: {
    color: '#fff'
  },
  listCpn: {
    listStyle: 'none',
    padding: '0px',
    display: 'flex'
  },
  cpnItem: {
    padding: '4px 8px',
    borderRadius: '3px',
    backgroundColor: '#f0f0f0',
    marginRight: '10px',
    fontSize: 12,
    fontWeight: 400
  }
}));
function LabelItem({ data, onEdit, onDelete, authorPermission }) {
  const classes = useStyles();
  const handleEdit = () => {
    if (!onEdit) return;
    onEdit();
  };
  const handleDelete = () => {
    if (!onDelete) return;
    onDelete();
  };
  return (
    <li className={classes.labelItem}>
      <div style={{ flex: '3' }}>
        <Chip
          className={classes.chip}
          style={{
            backgroundColor: chroma(data.bgColor).alpha(0.1).css(),
            color: data.bgColor
          }}
          label={data.title}
        />
      </div>
      <div style={{ flex: '5' }}> {data.description}</div>

      <ul style={{ flex: '7' }} className={classes.listCpn}>
        {data.companiesOfLabel.map((item, index) => (
          <li key={index} className={classes.cpnItem}>
            {item.company.name}
          </li>
        ))}
      </ul>
      <div style={{ flex: '5', textAlign: 'center' }}>
        <CustomButton
          style={{ padding: '0px', minWidth: '50px' }}
          disabled={!authorPermission.canUpdate}
          theme="blue"
          onClick={handleEdit}
        >
          <Edit className={classes.iconEdit} />
        </CustomButton>
        <CustomButton
          style={{ padding: '0px', minWidth: '50px' }}
          disabled={!authorPermission.canDelete}
          theme="red"
          onClick={handleDelete}
        >
          <Delete className={classes.iconDelete} />
        </CustomButton>
      </div>
    </li>
  );
}

export default LabelItem;
