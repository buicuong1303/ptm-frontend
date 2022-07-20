/* eslint-disable react/no-multi-comp */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Paper,
  Toolbar,
  colors,
  OutlinedInput,
  InputAdornment,
  TextField,
  Button,
  IconButton
} from '@material-ui/core';
import CropLandscapeIcon from '@material-ui/icons/CropLandscape';
import SearchIcon from '@material-ui/icons/Search';
import { Close } from '@material-ui/icons';
import { CustomButton, CustomReactSelect } from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from 'scenes/Message/Message.slice';
import { CompanyContext } from 'contexts/CompanyProvider';
import Select, { components } from 'react-select';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      // width: 125
    }
  },
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'left'
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left'
  },
  getContentAnchorEl: null
};

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.white,
    width: '100%',
    padding: theme.spacing(1, 1),
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    cursor: 'default'
  },
  backButton: {
    marginRight: theme.spacing(2),
    '@media (min-width: 1023px)': {
      display: 'none'
    }
  },
  user: {
    flexShrink: 0,
    flexGrow: 0,
    marginRight: '20px'
  },
  activity: {
    display: 'flex',
    alignItems: 'center'
  },
  statusBullet: {
    marginRight: theme.spacing(1)
  },
  search: {
    height: 42,
    padding: theme.spacing(0, 0, 0, 2),
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
    maxWidth: '500px',
    flex: 1
  },
  searchIcon: {
    color: colors.grey[700],
    transform: 'scale(1)'
  },
  searchInput: {
    flexGrow: 1,
    padding: '0px 8px',
    '& .MuiOutlinedInput-input': {
      paddingLeft: '0px'
    }
  },
  searchClear: {
    border: 'unset',
    outline: 'none',
    backgroundColor: 'unset !important',
    transform: 'scale(0.8)',
    color: '#000000 !important',
    transition: 'all 0.3s',
    '&:hover': {
      backgroundColor: 'unset !important',
      color: '#000000 !important',
      transform: 'scale(1)',
      transition: 'all 0.3s'
    }
  },
  formControl: {
    margin: theme.spacing(0.5),
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '5px'
    }
  },
  selectField: {
    width: '100%'
    // marginLeft: 2
    // minWidth: '125px'
  },
  fieldItem: {
    margin: '10px 0px'
  },
  wrapperFilter: {
    width: '100%'
  },
  expand: {
    cursor: 'pointer',
    transform: 'rotate(0deg)',
    marginRight: '-10px',
    // border: '1px solid black',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
}));

const options = [
  { value: 'new', label: 'New' },
  { value: 'existing', label: 'Existing' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'completed', label: 'Completed' },
  { value: 'unread', label: 'UnRead' },
  { value: 'not_reply_yet', label: 'Not reply yet' }
];

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <span style={{ width: 30, marginRight: 20 }}>
        {props.selectProps.label}
      </span>
    </components.DropdownIndicator>
  );
};

const Control = (props) => {
  const { className, editingClient, labels, users, ...rest } = props;
  const currentUser = useSelector((state) => state.session.user);

  const [expandedAgents, setExpandedAgents] = useState(false);
  const handleExpandAgentsClick = () => setExpandedAgents(!expandedAgents);
  const [expandedFilters, setExpandedFilters] = useState(false);
  const handleExpandClick = () => setExpandedFilters(!expandedFilters);

  const classes = useStyles();
  //* init form value
  const dispatch = useDispatch();
  const { company } = useContext(CompanyContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filters = useSelector(
    (state) => state.message.conversations.manager[company.code].filters
  );

  let debounced = useRef();

  //* set form state when change form value
  const handleChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^+0-9]/g, '');

    setSearchTerm(value);
    if (debounced.current) clearTimeout(debounced.current);
    debounced.current = setTimeout(() => {
      //TODO update search value state
      dispatch(setFilters({ companyCode: company.code, search: value }));
    }, 750);
  };

  //* change select option
  const handleChangeOption = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ companyCode: company.code, [name]: e.target.value }));
  };

  //* handle reset form
  const handleReset = () => {
    setSearchTerm('');
    dispatch(setFilters({ companyCode: company.code, search: '' }));
  };

  //! don't remove
  // useEffect(() => {
  //   filters.search && setSearchTerm(filters.search);
  // }, [company]);

  return (
    <Toolbar {...rest} className={clsx(classes.root, className)}>
      <FormControl className={classes.formControl}>
        <CustomReactSelect
          isDisabled={!!editingClient}
          closeMenuOnSelect={false}
          placeholder="Departments..."
          name="labels"
          className={classes.selectField}
          components={{ DropdownIndicator }}
          label="OR"
          onChange={(value) =>
            handleChangeOption({
              target: {
                name: 'labels',
                value: value
              }
            })
          }
          isMulti
          value={filters.labels}
          options={labels}
        />

        <InputAdornment position="start">
          <ExpandMoreIcon
            className={clsx(classes.expand, {
              [classes.expandOpen]: expandedAgents
            })}
            onClick={handleExpandAgentsClick}
            aria-expanded={expandedAgents}
            aria-label="show more"
            style={{
              position: 'absolute',
              top: 0,
              right: 15,
              height: '100%'
            }}
          />
        </InputAdornment>
      </FormControl>

      <Collapse
        className={classes.wrapperFilter}
        in={expandedAgents}
        timeout="auto"
        unmountOnExit
      >
        <FormControl
          style={{
            margin: '1px 0px 5px 0px'
          }}
        >
          <Select
            // isDisabled={!!editingClient}
            placeholder="Agents..."
            closeMenuOnSelect={false}
            components={{ DropdownIndicator }}
            label="OR"
            styles={{
              indicatorsContainer: (styles) => ({
                ...styles
              }),
              placeholder: (styles) => ({
                ...styles,
                fontSize: '14px',
                color: '#58717d'
              })
            }}
            name="users"
            isMulti
            className={classes.selectField}
            onChange={(value) =>
              handleChangeOption({
                target: {
                  name: 'users',
                  value: value
                }
              })
            }
            value={filters.users}
            disabled={editingClient ? true : false}
            options={users.map((user) => {
              if (user.id === currentUser.id) {
                return {
                  label: 'Me',
                  value: user.id
                };
              } else {
                return {
                  label: `${user.firstName}  ${user.lastName}`,
                  value: user.id
                };
              }
            })}
          />
        </FormControl>
      </Collapse>

      <FormControl className={classes.formControl}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <OutlinedInput
            disabled={!!editingClient}
            margin="dense"
            className={classes.searchInput}
            placeholder={'Search clients phone number...'}
            name="searchValue"
            onChange={handleChange}
            value={searchTerm}
            startAdornment={null}
            endAdornment={
              <InputAdornment position="start">
                {searchTerm ? (
                  <CustomButton
                    className={classes.searchClear}
                    style={{
                      border: 'unset',
                      outline: 'none',
                      marginLeft: '0',
                      marginRight: '0',
                      padding: '0px 0px',
                      minWidth: '40px',
                      height: '38px'
                    }}
                    theme="close"
                    onClick={handleReset}
                  >
                    <Close />
                  </CustomButton>
                ) : (
                  <InputAdornment position="start">
                    <SearchIcon className={classes.searchIcon} />
                  </InputAdornment>
                )}
                <ExpandMoreIcon
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expandedFilters
                  })}
                  onClick={handleExpandClick}
                  aria-expanded={expandedFilters}
                  aria-label="show more"
                />
              </InputAdornment>
            }
          />
        </div>
      </FormControl>

      <Collapse
        className={classes.wrapperFilter}
        in={expandedFilters}
        timeout="auto"
        unmountOnExit
      >
        <FormControl
          style={{
            margin: '1px 0px 5px 0px'
          }}
        >
          <Select
            isDisabled={!!editingClient}
            closeMenuOnSelect={false}
            styles={{
              indicatorsContainer: (styles) => ({
                ...styles
              }),
              placeholder: (styles) => ({
                ...styles,
                fontSize: '14px',
                color: '#58717d'
              })
            }}
            components={{
              DropdownIndicator: DropdownIndicator
            }}
            label="AND"
            placeholder="Filters..."
            className={classes.selectField}
            name="types"
            onChange={(value) =>
              handleChangeOption({
                target: {
                  name: 'types',
                  value: value
                }
              })
            }
            value={filters.types}
            isMulti
            disabled={editingClient ? true : false}
            options={options}
            end
          />
        </FormControl>
      </Collapse>
    </Toolbar>
  );
};

Control.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string
};

export default Control;
