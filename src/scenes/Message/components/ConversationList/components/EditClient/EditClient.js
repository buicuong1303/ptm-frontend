/* eslint-disable no-unused-vars */
import { colors, FormControl, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import Select from 'react-select';
import DoneIconCheck from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '80px',
    padding: 0,
    display: 'flex',
    flexDirection: 'row',
    '&:hover': {
      backgroundColor: `${colors.grey[300]}`
    }
  },
  formControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    fontSize: 18,
    '&:hover': {
      transform: 'scale(1.25)',
      transition: 'transform 0.2s'
    }
  },
  label: {
    marginRight: 10
  },
  textField: {
    width: 100,
    marginRight: '10px',
    height: 40
  },
  selectField: {
    width: 200
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 10
  },
  updateClientWrapper: {
    height: '80px',
    padding: 15,
    display: 'flex',
    flexDirection: 'row',
    fontSize: '13px',
    borderBottom: '1px solid #eeee'
  }
}));
function EditClient({
  conversation,
  onSubmitEditClient,
  company,
  onEditClient
}) {
  const classes = useStyles();
  const [isChanged, setIsChanged] = useState(false);

  const [updateClientInfo, setUpdateClientInfo] = useState({
    conversationId: conversation.id,
    name: conversation.customer.fullName,
    campaigns: []
  });
  const campaigns = useSelector((state) => state.campaign.campaigns);

  const handleSubmit = async () => {
    if (!onSubmitEditClient) return;
    onSubmitEditClient({
      ...updateClientInfo,
      customerId: conversation.customer.id,
      company: company
    });
    setIsChanged(false);
  };
  const handleChangeName = (e) => {
    const value = e.target.value;
    setIsChanged(true);
    setUpdateClientInfo({ ...updateClientInfo, name: value });
  };
  const handleChangeOption = (e) => {
    setIsChanged(true);
    setUpdateClientInfo({
      ...updateClientInfo,
      [e.target.name]: e.target.value
    });
  };
  return (
    <div className={classes.updateClientWrapper}>
      <FormControl className={classes.formControl}>
        <label htmlFor="my-input" className={classes.label}>
          Name
        </label>
        <TextField
          className={classes.textField}
          id="outlined-basic"
          variant="outlined"
          size="small"
          margin="none"
          value={updateClientInfo.name}
          name="name"
          onChange={handleChangeName}
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <Select
          closeMenuOnSelect={false}
          styles={{
            control: (styles, state) => ({
              ...styles,
              backgroundColor: '#ffffff',
              borderWidth: '0.1px',
              padding: '0px 2px',
              boxShadow: state.isFocused ? '0 0 0 0.1px #2684ff' : null,
              flex: '1 !important',
              display: 'flex !important',
              overflowX: 'auto !important',
              overflowY: 'hidden !important',
              '::-webkit-scrollbar': {
                height: '4px'
              },
              borderRadius: '3px',
              position: 'relative'
            }),
            indicatorsContainer: (styles) => ({
              ...styles,
              display: 'none'
            }),
            placeholder: (styles) => ({
              ...styles,
              fontSize: '14px',
              color: '#58717d'
            }),
            valueContainer: (styles) => ({
              ...styles,
              flexWrap: 'nowrap !important',
              display: 'flex !important',
              flexDirection: 'row !important',
              position: 'absolute',
              minWidth: 100
            })
          }}
          placeholder="Campaigns..."
          className={classes.selectField}
          name="campaigns"
          onChange={(value) =>
            handleChangeOption({
              target: {
                name: 'campaigns',
                value: value
              }
            })
          }
          defaultValue={conversation.customer.campaigns}
          isMulti
          options={campaigns.map((campaign) => {
            return {
              label: campaign.name,
              value: campaign.id
            };
          })}
          end
        />
      </FormControl>

      <div className={classes.actions}>
        <CancelIcon
          className={classes.icon}
          onClick={() => {
            if (!onEditClient) return;
            setIsChanged(false);
            onEditClient(null);
          }}
        />
        {isChanged && (
          <DoneIconCheck onClick={handleSubmit} className={classes.icon} />
        )}
      </div>
    </div>
  );
}

export default EditClient;
