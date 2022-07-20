import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import * as PropTypes from 'prop-types';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    padding: theme.spacing(2)
  },
  toolBar: {
    display: 'flex',
    padding: theme.spacing(2)
  },
  search: {
    height: 40,
    margin: theme.spacing(0, 1),
    padding: theme.spacing(0, 2),
    display: 'flex',
    alignItems: 'center',
    maxWidth: '250px',
    flex: 1,
    border: '1px solid #dddddd',
    borderRadius: '5px'
  },
  searchIcon: {
    marginRight: theme.spacing(2)
    // color: colors.grey[700]
  },
  active: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff !important',
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },
  filterButton: {
    margin: theme.spacing(0, 1),
    textTransform: 'capitalize',
    color: '#888',
    border: '1px solid #dddddd',
    height: '40px'
  }
}));
function ToolBar({ onFilter, onReadAll }) {
  const classes = useStyles();
  const unread = useSelector((state) => state.notification.unread);
  const [typeFilter, setTypeFilter] = useState('');
  const [unReadFilter, setUnreadFilter] = useState(false);
  const handleTypeFilter = (value) => {
    if (!onFilter) return;

    if (value === typeFilter) {
      onFilter({ type: '', unread: unReadFilter });
      setTypeFilter('');
    } else {
      onFilter({ type: value, unread: unReadFilter });
      setTypeFilter(value);
    }
  };
  const handleReadAll = () => {
    if (!onReadAll) return;
    onReadAll();
  };

  return (
    <div className={classes.toolBar}>
      <Button
        className={clsx(classes.filterButton, {
          [classes.active]: typeFilter === 'client'
        })}
        style={{ marginLeft: 0 }}
        variant="outlined"
        onClick={() => handleTypeFilter('client')}
      >
        Client
      </Button>

      <Button
        className={clsx(classes.filterButton, {
          [classes.active]: typeFilter === 'message'
        })}
        variant="outlined"
        onClick={() => handleTypeFilter('message')}
      >
        Message
      </Button>
      <div style={{ marginLeft: 'auto' }}>
        <Button
          className={clsx(classes.filterButton, {
            [classes.active]: unReadFilter === true
          })}
          variant="outlined"
          onClick={() => {
            setUnreadFilter(!unReadFilter);
            onFilter({ type: typeFilter, unread: !unReadFilter });
          }}
        >
          Unread
        </Button>
        <Button
          style={{ textTransform: 'none' }}
          variant="outlined"
          onClick={handleReadAll}
          disabled={unread > 0 ? false : true}
        >
          Read all &nbsp;
          <DoneAllIcon />
        </Button>
      </div>
    </div>
  );
}

ToolBar.propType = {
  onFilter: PropTypes.func
};

ToolBar.defaultProps = {
  onFilter: null
};

export default ToolBar;
