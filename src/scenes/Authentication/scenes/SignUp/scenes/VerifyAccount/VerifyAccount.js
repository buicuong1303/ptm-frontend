/* eslint-disable no-unused-vars */
import { Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { CustomButton, Page } from 'components';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { verifyAccountAction } from 'scenes/Authentication/Authen.asyncAction';
import { clearState } from 'scenes/Authentication/Authen.slice';
import apiStatus from 'utils/apiStatus';
import Error401 from 'scenes/Error401';
// import { Link as RouterLink } from 'react-router-dom';
// import { Link } from '@material-ui/core';
// import MailOutlineIcon from '@material-ui/icons/MailOutline';
const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.breakpoints.values.sm,
    maxWidth: '100%',
    margin: '0 auto',
    height: '100%',
    padding: theme.spacing(6, 2),
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      width: '100%'
    }
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'center'
  },
  card: {
    padding: theme.spacing(1, 3),
    boxShadow: '1px 5px 25px #ccc'
  },
  cardContent: {
    textAlign: 'center'
  },
  icon: {
    marginTop: '50px',
    width: '100px',
    height: '100px',
    background:
      'url(https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.209/static/media/check-your-email-open-letter.4191d109.svg)',
    backgroundRepeat: 'no-repeat'
  }
}));
function VerifyAccount() {
  const classes = useStyles();
  const { search } = useLocation();
  const { token } = qs.parse(search);
  const history = useHistory();
  const dispatch = useDispatch();
  const status = useSelector((state) => state.authen.status);
  useMemo(() => {
    const verify = () => {
      localStorage.setItem('accessToken', token);
      dispatch(verifyAccountAction());
    };
    verify();
  }, []);
  useEffect(() => {
    if (status === apiStatus.SUCCESS) history.push('/');
  }, [status]);
  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);
  return (
    <Page className={classes.root} title="Verify account">
      {status === apiStatus.ERROR && <Error401 />}
    </Page>
  );
}

export default VerifyAccount;
