import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Link
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';

import { Page } from 'components';
import gradients from 'utils/gradients';
import { SignInForm } from './components';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(6, 2)
  },
  card: {
    width: theme.breakpoints.values.md,
    maxWidth: '100%',
    overflow: 'unset',
    display: 'flex',
    flexDirection: 'row',
    position: 'relative',
    '& > *': {
      flexGrow: 1,
      flexBasis: '50%',
      width: '50%'
    }
  },
  content: {
    padding: theme.spacing(8, 4, 3, 4)
  },
  media: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    padding: theme.spacing(2),
    color: theme.palette.primary.main,
    // textShadow: '0px 0px 10px #07d1ff',
    fontSize: 30,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
    fontWeight: 900
  },
  icon: {
    backgroundImage: gradients.indigo,
    color: theme.palette.white,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    position: 'absolute',
    top: -32,
    left: theme.spacing(3),
    height: 64,
    width: 64,
    fontSize: 32
  },
  loginForm: {
    marginTop: theme.spacing(3)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  person: {
    marginTop: theme.spacing(1),
    display: 'flex',
    color: theme.palette.primary.main,
    // textShadow: '0px 0px 10px #07d1ff',
    fontSize: 20
  }
}));

const SignIn = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Sign in">
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image="/images/login_banner.png"
          title="Cover"
        >
          <p>PHP Text Message</p>
          <div className={classes.person}>
            <div>
              <p>Online Customer Support System</p>
            </div>
          </div>
        </CardMedia>

        <CardContent className={classes.content}>
          <LockIcon className={classes.icon} />
          <Typography gutterBottom variant="h3">
            Sign in
          </Typography>
          <Typography variant="subtitle2">
            Sign in on the internal platform
          </Typography>
          <SignInForm className={classes.loginForm} />
          <Divider className={classes.divider} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link
              align="center"
              color="secondary"
              component={RouterLink}
              to="/auth/sign-up"
              underline="always"
              variant="subtitle2"
            >
              Don&apos;t have an account?
            </Link>
            <Link
              align="center"
              color="secondary"
              component={RouterLink}
              underline="always"
              variant="subtitle2"
              to="/auth/sign-in/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </Page>
  );
};

export default SignIn;
