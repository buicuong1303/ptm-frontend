import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  Avatar,
  IconButton,
  Toolbar,
  Tooltip,
  colors,
  Switch
} from '@material-ui/core';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { SelectInput, StringFormat } from 'components';
import PhoneOutlinedIcon from '@material-ui/icons/PhoneOutlined';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.white,
    width: '100%',
    display: 'flex'
  },
  backButton: {
    marginRight: theme.spacing(2),
    '@media (min-width: 1023px)': {
      display: 'none'
    }
  },
  headerContent: {
    display: 'flex',
    flex: 1
  },
  user: {
    flex: 1,
    marginRight: '20px',
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    cursor: 'default'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  iconColor: {
    color: colors.grey[700]
  },
  selectSignature: {
    width: 200
  },
  selectPersonal: {
    marginTop: 10,
    marginRight: 20
  },
  icon: {
    fontSize: 20,
    marginLeft: theme.spacing(2),
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
      transform: 'scale(1.3)'
    }
  }
}));

const ConversationToolbar = (props) => {
  const classes = useStyles();
  const {
    onBack,
    setChecked,
    company,
    setSignature,
    listSignature,
    className,
    selectedConversation,
    ...rest
  } = props;
  const [checkedValue, setCheckedValue] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState('');
  const [currentCompany, setCurrentCompany] = useState('');
  const [signatures, setsignatures] = useState([{ id: '', name: 'None' }]);
  const [open, setOpen] = useState(false);
  const handleChangeSignature = (e) => {
    setSelectedSignature(e.target.value);
  };
  const handleCheckbox = () => {
    if (checkedValue) {
      setCheckedValue(false);
    } else {
      setCheckedValue(true);
    }
  };
  useEffect(() => {
    setChecked(checkedValue);
  }, [checkedValue]);

  useEffect(() => {
    const noneSignature = [{ id: '', name: 'None' }];
    const newSignature = noneSignature.concat(listSignature);
    setsignatures(newSignature);
  }, [listSignature]);

  useEffect(() => {
    if (company.signature.status === 'active') {
      if (currentCompany !== company.name) {
        setCurrentCompany(company.name);
        // setSelectedSignature(company.signature.id); //* disable default signature
      }
    }
  }, [company]);
  useEffect(() => {
    setSignature(selectedSignature);
  }, [selectedSignature]);

  //* init form value
  return (
    <Toolbar {...rest} className={clsx(classes.root, className)}>
      <Tooltip title="Back">
        <IconButton
          onClick={onBack}
          className={clsx(classes.backButton, classes.iconColor)}
          component="div"
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
      <div className={classes.headerContent}>
        <div className={classes.user}>
          <Avatar
            className={classes.avatar}
            component={RouterLink}
            src={
              selectedConversation &&
              selectedConversation.customer &&
              selectedConversation.customer.avatar
            }
            to=""
          />
          <StringFormat
            isPhoneNumber
            value={
              selectedConversation &&
              selectedConversation.customer &&
              selectedConversation.customer.phone
            }
            style={{
              fontWeight: '700',
              fontSize: '14px'
            }}
          />
          <Tooltip
            title="Copied"
            aria-label="copied"
            disableHoverListener
            open={open}
            leaveTouchDelay={1500}
          >
            <FileCopyOutlinedIcon
              className={classes.icon}
              onClick={() => {
                navigator.clipboard.writeText(
                  selectedConversation.customer.phone
                );
                setOpen(true);
                setTimeout(() => {
                  setOpen(false);
                }, 3000);
              }}
            />
          </Tooltip>
          <a
            href={`tel:${selectedConversation.customer.phone}`}
            style={{ display: 'block', width: 20, height: 20, color: 'black' }}
          >
            <PhoneOutlinedIcon className={classes.icon} />
          </a>
        </div>
        <div className={classes.selectPersonal}>
          <FormControlLabel
            control={
              <Switch
                checked={checkedValue}
                onChange={handleCheckbox}
                color="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />
            }
            label="Pesonal Signature"
            labelPlacement="start"
          />
        </div>
        <div className={classes.selectSignature}>
          <SelectInput
            label="Signature"
            options={signatures.map((item) => ({
              value: item.id,
              label: item.name
            }))}
            name="signature"
            value={selectedSignature}
            onChange={handleChangeSignature}
          />
        </div>
      </div>
    </Toolbar>
  );
};

ConversationToolbar.propTypes = {
  className: PropTypes.string,
  onBack: PropTypes.func,
  selectedConversation: PropTypes.object
};

export default ConversationToolbar;
