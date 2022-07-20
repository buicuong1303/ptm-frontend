import { Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { CustomButton, Page } from 'components';
import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'query-string';
import { useDispatch } from 'react-redux';
import { verifyAccountAction } from 'scenes/Authentication/Authen.asyncAction';
import { unwrapResult } from '@reduxjs/toolkit';

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
  useEffect(() => {
    const verify = async () => {
      localStorage.setItem('accessToken', token);
      const actionResult = await dispatch(verifyAccountAction());
      const { error } = unwrapResult(actionResult);
      !error && history.push('/');
    };
    verify();
  }, []);
  return (
    <Page className={classes.root} title="Verify account">
      <Card className={classes.card}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px'
          }}
        >
          <Typography variant="h3" color="primary">
            PHP TEXT MESSAGE
          </Typography>
          <div className={classes.icon} />
        </div>
        <CardContent className={classes.cardContent}>
          <Typography>Thank you</Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <CustomButton theme="blue-full">Resend email</CustomButton>
        </CardActions>
      </Card>
    </Page>
  );
}

export default VerifyAccount;
