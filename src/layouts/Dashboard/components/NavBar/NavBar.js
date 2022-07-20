/* eslint-disable prettier/prettier */
import React, { Fragment, useEffect, useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Drawer, Paper, Avatar, Typography } from '@material-ui/core';
import { Hidden, Card } from '@material-ui/core';

import { useRouter } from 'hooks';
import { Navigation } from './components';
import navigationConfig from './navigationConfig';
import PerfectScrollbar from 'react-perfect-scrollbar';
import logoImg from 'images/logo_light.png';
import { useSelector } from 'react-redux';
import { CompanyContext } from 'contexts/CompanyProvider';
import { PermissionContext } from 'contexts/PermissionProvider';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    overflowY: 'hidden',
    backgroundColor: theme.palette.primary.dark,
    display: 'flex',
    flexDirection: 'column'
  },
  logoContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px'
  },
  cardLogo: {
    height: '50px',
    flex: '1',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing(2)
  },
  logoImg: {
    height: '35px',
    width: '40px',
    marginRight: theme.spacing(1)
  },
  logoText: {
    marginLeft: '5px',
    color: theme.palette.primary.main,
    fontSize: '15px',
    fontWeight: 'bold'
  },
  content: {
    padding: theme.spacing(2)
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 'fit-content',
    height: '60px',
    padding: '5px 10px',
    background: theme.palette.primary.main
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: '8px',
    '& > h5': {
      color: theme.palette.white
    },
    '& > p': {
      color: theme.palette.primary.light
    }
  },
  avatar: {
    width: 40,
    height: 40
  },
  name: {
    marginTop: theme.spacing(1)
  },
  divider: {
    marginTop: theme.spacing(2)
  },
  navigation: {
    marginTop: theme.spacing(1)
  },
  contentWrapper: {
    flex: '1 1 0',
    minHeight: '0px'
  }
}));

const NavBar = (props) => {
  const { openMobile, onMobileClose, className, ...rest } = props;
  const { setCompany, companies, handleResetLoadingConversation } = useContext(CompanyContext);
  const [totalMessageUnread, setTotalMessageUnread] = useState(0);

  const classes = useStyles();
  const router = useRouter();

  const user = useSelector((state) => state.session.user);

  const { authorizer } = useContext(PermissionContext);
  const [authorPermission, setAuthorPermission] = useState({
    readCustomer: false,
    readUsers: false,
    readSignature: false,
    readCompany: false,
    readGroup: false,
    readChat: false,
    readPermission: false,
    readRole: false,
    readComposeText: false,
    readSchedule: false,
    readLogActivity: false
  });
  const getAuthor = async () => {
    setAuthorPermission({
      ...authorPermission,
      readCustomer: await authorizer.current.can('read', '/customers'),
      // readUsers: await authorizer.current.canAll('read', ['/users','/customers']),
      readUsers: await authorizer.current.can('read', '/users'),
      readSignature: await authorizer.current.can('read', '/signatures'),
      readCompany: await authorizer.current.can('read', '/companies'),
      readGroup: await authorizer.current.can('read', '/groups'),
      readChat: await authorizer.current.can('read', '/chat'),
      readPermission: await authorizer.current.can('read', '/permissions'),
      readRole: await authorizer.current.can('read', '/roles'),
      readComposeText: await authorizer.current.can('read', '/compose-text'),
      readSchedule: await authorizer.current.can('read', '/schedules'),
      readManages: await authorizer.current.can('read', '/manages'),
      readLogActivity: await authorizer.current.can('read', '/log-activities'),
      readSensitives: await authorizer.current.can('read', '/sensitives'),
      readSuggestions: await authorizer.current.can('read', '/suggestions'),
      readCampaigns: await authorizer.current.can('read', '/campaigns'),
      readGroupMessages: await authorizer.current.can('read', '/group-messages'),
      readLabels: await authorizer.current.can('read', '/labels'),
      readReportMessages: await authorizer.current.can('read', '/report-messages'),
      readCompliance: await authorizer.current.can('read', '/compliance'),
      readDashboard: await authorizer.current.can('read', '/dashboard'),
      readCampaignManage: await authorizer.current.can('read', '/campaigns-manage'),
    });
  };
  useEffect(() => {
    if(authorizer.current){
      getAuthor();
    }
  }, [authorizer.current]);

  useEffect(() => {
    if (openMobile) {
      onMobileClose && onMobileClose();
    }
  }, [router.location.pathname]);

  useEffect(() => {
    let isFull = true;
    let total = 0;
    companies.forEach(company => {
      if(company.umn !== undefined){
        total = total + company.umn;
      }else{
        isFull = false;
      }
    });
    if(isFull){
      setTotalMessageUnread(total);
    }
  }, [companies]);

  const navigateCompany = (href) => {
    const companyCode = href.split('/').reverse()[0];

    const selectedCompany = companies.filter((company) => company.code === companyCode)[0];
    setCompany(selectedCompany);

    handleResetLoadingConversation();

    router.history.push(href);
  };

  const navbarContent = (
    <Paper
      {...rest}
      className={clsx(classes.root, className)}
      elevation={1}
      square
    >
      <div className={classes.logoContainer}>
        <Card className={classes.cardLogo}>
          <img alt="Logo" src={logoImg} className={classes.logoImg} />
          <Typography className={classes.logoText}>PHP Text Message</Typography>
        </Card>
      </div>

      <div className={classes.contentWrapper}>
        <PerfectScrollbar>
          <div className={classes.content}>
            <nav className={classes.navigation}>
              {navigationConfig(totalMessageUnread, companies, navigateCompany, authorPermission).map((list) => (
                <Navigation
                  component="div"
                  key={list.title}
                  pages={list.pages}
                  title={list.title}
                />
              ))}
            </nav>
          </div>
        </PerfectScrollbar>
      </div>

      <div className={classes.profile}>
        <Avatar
          alt="Person"
          className={classes.avatar}
          component={RouterLink}
          src={user.avatar}
          to="/profile"
        />

        <div className={classes.profileInfo}>
          <Typography className={classes.name} variant="h5">
            {user.firstName || ''} {user.lastName || ''}
          </Typography>
          <Typography variant="body2">{user.roles && user.roles.reduce((result, role, index) => {
            if (index < user.roles.length - 1 )
              result += role.split('_')[1] + '/';
            else 
              result += role.split('_')[1];
            return result;
          }, '')}</Typography>
        </div>
      </div>
    </Paper>
  );

  return (
    <Fragment>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {navbarContent}
        </Drawer>
      </Hidden>
      <Hidden mdDown>{navbarContent}</Hidden>
    </Fragment>
  );
};

NavBar.propTypes = {
  className: PropTypes.string,
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default NavBar;
