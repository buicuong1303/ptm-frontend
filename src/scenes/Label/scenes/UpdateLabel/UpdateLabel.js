/* eslint-disable no-unused-vars */
/* eslint-disable react/self-closing-comp */
import {
  Button,
  Divider,
  FormControl,
  FormHelperText,
  InputAdornment,
  Paper,
  TextField
} from '@material-ui/core';
import { ExitToApp, Save } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { unwrapResult } from '@reduxjs/toolkit';
import { CustomButton, DialogConfirm, Header, Page } from 'components';
import { useSnackbar } from 'notistack';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { getCompanies } from 'scenes/Company/Company.asyncAction';
import { getLabel, updateLabel } from '../../Label.asyncAction';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    margin: '0 auto',
    height: '100%',
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  divider: {
    backgroundColor: theme.palette.primary.main,
    border: 'none',
    height: '2px',
    margin: '10px 0px'
  },
  paper: {
    flex: '1'
  },
  form: {
    maxWidth: '1248px',
    margin: '0 auto'
  },
  formControl: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '6px 0px',
    justifyContent: 'center',
    margin: '16px 0px'
  },
  label: {
    width: 130,
    textAlign: 'end',
    marginRight: '20px',
    fontWeight: 600,
    fontSize: 14
  },
  textField: {
    flex: 1,
    '& .MuiFormHelperText-root': {
      position: 'absolute',
      top: '100%',
      marginTop: 0
    }
  },
  colorItem: {
    width: 30,
    height: 30,
    borderRadius: '5px',
    marginRight: '10px',
    cursor: 'pointer'
  },
  suggestColors: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flex: 1
  },
  formText: {
    margin: '-8px 0px 8px 0px'
  },
  colorPreview: {
    height: 30,
    width: 30,
    borderRadius: 5
  }
}));

const animatedComponents = makeAnimated();

function UpdateLabel() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { id: labelId } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const timeRef = useRef();

  const [companyOptions, setCompanyOptions] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [titleOnblur, setTitleOnblur] = useState(false);
  const [formValue, setFormValue] = useState({
    title: '',
    description: '',
    bgColor: '',
    companies: []
  });
  const regex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  const [dialogConfirm, setDialogConfirm] = useState(false);

  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value
    });
  };

  const handleSelectCompanies = (value) => {
    setFormValue({ ...formValue, companies: value });
  };

  const handlePickColor = (e) => {
    const color = e.target.getAttribute('data-color');
    setFormValue({ ...formValue, bgColor: color });
  };

  const handleSubmit = () => setDialogConfirm(true);
  const handleCancelDialog = () => setDialogConfirm(false);
  const handleConfirmDialog = async () => {
    try {
      const result = await dispatch(updateLabel({ id: labelId, ...formValue }));
      const data = unwrapResult(result);

      showSnackbar('Update label success', 'success');

      if (timeRef.current) clearTimeout(timeRef.current);
      timeRef.current = setTimeout(() => {
        history.push('/labels');
      }, 1000);
    } catch (error) {
      showSnackbar('Update label failed', 'error');
    }
    setDialogConfirm(false);
  };

  useEffect(() => {
    async function handleGetCompanies() {
      try {
        const result = await dispatch(getCompanies());
        const data = unwrapResult(result);
        setCompanyOptions(
          data.map((cpn) => ({ label: cpn.name, value: cpn.id }))
        );
      } catch (error) {
        showSnackbar('Can not load companies', 'error');
      }
    }
    handleGetCompanies();
  }, []);

  useEffect(() => {
    async function handleGetLabel(id) {
      try {
        const result = await dispatch(getLabel(id));
        const data = unwrapResult(result);
        setFormValue({
          bgColor: data.bgColor,
          title: data.title,
          description: data.description,
          companies: data.companiesOfLabel.map((item) => ({
            label: item.company.name,
            value: item.company.id,
            id: item.id
          }))
        });
      } catch (error) {
        // console.log(error);
      }
    }
    handleGetLabel(labelId);

    return () => clearTimeout(timeRef.current);
  }, []);

  useEffect(() => {
    if (
      formValue.bgColor === '' ||
      formValue.title === '' ||
      !regex.test(formValue.bgColor)
    )
      setIsValid(false);
    else setIsValid(true);
  }, [formValue]);

  return (
    <Page className={classes.root} title="Update label">
      <Header childTitle="Update Label" urlChild="#" />
      <Divider className={classes.divider} />

      <Paper className={classes.paper} elevation={1} variant="outlined">
        <form className={classes.form} noValidate autoComplete="off">
          <FormControl className={classes.formControl}>
            <label htmlFor="my-input" className={classes.label}>
              * Title
            </label>
            <TextField
              className={classes.textField}
              id="outlined-basic"
              variant="outlined"
              size="small"
              value={formValue.title}
              name="title"
              onChange={handleChangeValue}
              error={!formValue.title && titleOnblur}
              helperText={
                !formValue.title && titleOnblur && 'Title is required.'
              }
              onBlur={() => setTitleOnblur(true)}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <label htmlFor="my-input" className={classes.label}>
              Description
            </label>
            <TextField
              className={classes.textField}
              id="outlined-basic"
              variant="outlined"
              size="small"
              value={formValue.description}
              name="description"
              onChange={handleChangeValue}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <label htmlFor="my-input" className={classes.label}>
              Companies
            </label>
            <Select
              className={classes.textField}
              options={companyOptions}
              isMulti
              value={formValue.companies}
              name="companies"
              classNamePrefix="select"
              onChange={handleSelectCompanies}
              closeMenuOnSelect={false}
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <label htmlFor="my-input" className={classes.label}>
              * Background color
            </label>
            <TextField
              className={classes.textField}
              id="outlined-basic"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    className={classes.colorPreview}
                    style={{ backgroundColor: formValue.bgColor }}
                  >
                    {''}
                  </InputAdornment>
                )
              }}
              name="bgColor"
              value={formValue.bgColor}
              onChange={handleChangeValue}
              error={!regex.test(formValue.bgColor)}
              helperText={
                !regex.test(formValue.bgColor) && 'Color code Invalid.'
              }
            />
          </FormControl>
          <FormControl className={classes.formControl}>
            <label htmlFor="my-input" className={classes.label}></label>
            <div style={{ flex: 1 }}>
              <FormHelperText className={classes.formText}>
                Choose any color.
                <br />
                Or you can choose one of the suggested colors below
              </FormHelperText>
              <ul className={classes.suggestColors}>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#009966' }}
                  data-color="#009966"
                  title="Green-cyan"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#8fbc8f' }}
                  data-color="#8fbc8f"
                  title="Dark sea green"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#3cb371' }}
                  data-color="#3cb371"
                  title="Medium sea green"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#00b140' }}
                  data-color="#00b140"
                  title="Green screen"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#013220' }}
                  data-color="#013220"
                  title="Dark green"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#6699cc' }}
                  data-color="#6699cc"
                  title="Blue-gray"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#0000ff' }}
                  data-color="#0000ff"
                  title="Blue"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#e6e6fa' }}
                  data-color="#e6e6fa"
                  title="Lavendar"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#9400d3' }}
                  data-color="#9400d3"
                  title="Dark violet"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#330066' }}
                  data-color="#330066"
                  title="Deep violet"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#808080' }}
                  data-color="#808080"
                  title="Gray"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#36454f' }}
                  data-color="#36454f"
                  title="Charcoal grey"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#f7e7ce' }}
                  data-color="#f7e7ce"
                  title="Champagne"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#c21e56' }}
                  data-color="#c21e56"
                  title="Rose red"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#cc338b' }}
                  data-color="#cc338b"
                  title="Magenta-pink"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#dc143c' }}
                  data-color="#dc143c"
                  title="Crimson"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#ff0000' }}
                  data-color="#ff0000"
                  title="Red"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#cd5b45' }}
                  data-color="#cd5b45"
                  title="Dark coral"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#eee600' }}
                  data-color="#eee600"
                  title="Titanium yellow"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#ed9121' }}
                  data-color="#ed9121"
                  title="Carrot orange"
                  href="#"
                  onClick={handlePickColor}
                ></li>
                <li
                  className={classes.colorItem}
                  style={{ backgroundColor: '#c39953' }}
                  data-color="#c39953"
                  title="Aztec Gold"
                  href="#"
                  onClick={handlePickColor}
                ></li>
              </ul>
            </div>
          </FormControl>
          <FormControl className={classes.formControl}>
            <label htmlFor="my-input" className={classes.label}></label>
            <div style={{ flex: 1, textAlign: 'end' }}>
              <Link to={'/labels'}>
                <CustomButton content="" theme="gray-full" variant="contained">
                  <ExitToApp className={classes.icon} />
                  Back
                </CustomButton>
              </Link>
              <Button
                variant="contained"
                color="primary"
                style={{ textTransform: 'capitalize' }}
                onClick={handleSubmit}
                disabled={!isValid}
              >
                <Save className={classes.icon} />
                Save change
              </Button>
            </div>
          </FormControl>
        </form>
      </Paper>
      <DialogConfirm
        handleClose={handleCancelDialog}
        handleConfirm={handleConfirmDialog}
        message={'Update label in system'}
        open={dialogConfirm}
      />
    </Page>
  );
}

export default UpdateLabel;
