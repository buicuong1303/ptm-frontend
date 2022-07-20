import { Grid, InputAdornment, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/styles';
import { SelectInput } from 'components';
import * as PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {},
  icon: {
    color: theme.palette.primary.main
  },
  searchInput: {
    flex: 1,
    marginRight: '10px'
  },
  selectWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    width: 50
  },
  tableInput: {
    width: '100%'
  },
  textFiled: {
    padding: '5px 0px'
  }
}));

function ToolBar({ onSearch, onChangeSearchValue, onChangeFilters, filters }) {
  const classes = useStyles();
  const inputRef = useRef();

  const handleChangeSearchValue = (e) => {
    const value = e.target.value;

    if (!onChangeSearchValue) return;
    onChangeSearchValue(value);
  };

  const handleChangeFilters = (e) => {
    if (!onChangeFilters) return;

    const value = e.target.value;
    const name = e.target.name;
    onChangeFilters({
      ...filters,
      [name]: value
    });
  };

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <TextField
        id="filled-size-small"
        variant="outlined"
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <SearchIcon className={classes.icon} />
            </InputAdornment>
          )
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSearch) onSearch();
          return;
        }}
        onChange={handleChangeSearchValue}
        className={classes.textFiled}
        inputProps={{
          ref: inputRef
        }}
      />
      <Grid container spacing={3} style={{ marginBottom: '50px' }}>
        <Grid item lg={6} xs={12}>
          <table className={classes.tableInput}>
            <tbody>
              <tr>
                <td className={classes.label}>Types</td>
                <td>
                  <div>
                    <SelectInput
                      options={['All', 'Messages'].map((item) => ({
                        value: item,
                        label: item
                      }))}
                      name="types"
                      onChange={handleChangeFilters}
                      defaultValue={'All'}
                      value={filters.types}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Grid>
        <Grid item lg={6} xs={12}>
          <table className={classes.tableInput}>
            <tbody>
              <tr>
                <td className={classes.label}>Time</td>
                <td>
                  <div>
                    <SelectInput
                      options={[
                        'Any time',
                        'Past hour',
                        'Past 24 hours',
                        'Last week',
                        'Last month',
                        'Last year'
                      ].map((item) => ({
                        value: item,
                        label: item
                      }))}
                      defaultValue={'Any time'}
                      onChange={handleChangeFilters}
                      name="time"
                      value={filters.time}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Grid>
      </Grid>
    </>
  );
}
ToolBar.propType = {
  onChangeSearchValue: PropTypes.func,
  onSearch: PropTypes.func,
  filters: PropTypes.object,
  onChangeFilters: PropTypes.func
};
export default ToolBar;
