import { Card, CardActions, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { CustomButton, Page } from 'components';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resendEmailAction } from 'scenes/Authentication/Authen.asyncAction';
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
function SendVerifyEmail() {
  const classes = useStyles();
  const email = useSelector((state) => state.authen.verifyEmail);
  const dispatch = useDispatch();
  const handleResend = () => {
    dispatch(resendEmailAction({ email }));
  };
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
          <Typography>
            To start using PHP Text Message, you need to verify your email at{' '}
            <span style={{ fontWeight: 'bold' }}>{email}</span>
          </Typography>
        </CardContent>
        <CardActions className={classes.cardActions}>
          <CustomButton theme="blue-full" onClick={handleResend}>
            Resend email
          </CustomButton>
        </CardActions>
      </Card>
    </Page>
  );
}

export default SendVerifyEmail;
