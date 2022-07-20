import React, { Suspense, useState, useContext, useEffect } from 'react';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { LinearProgress } from '@material-ui/core';

import { SocketChatContext } from 'services/socket/SocketChat';
import { SocketNotificationContext } from 'services/socket/SocketNotification';

import { NavBar, TopBar, UserBar } from './components';
import { getUserInfo } from 'store/asyncActions/session.asyncAction';
import { useDispatch, useSelector } from 'react-redux';
import { PermissionContext } from 'contexts/PermissionProvider';
import { getUsers } from 'store/asyncActions/userOnline.asyncAction';
import { getTopNotificationsOfUser } from 'store/asyncActions/notification.asyncAction';
import SkeletonComponent from 'components/Skeleton';
import clsx from 'clsx';
import { CompanyContext } from 'contexts/CompanyProvider';

const useStyles = makeStyles(() => ({
  mainContent: {
    position: 'relative'
  },
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  topBar: {
    zIndex: 2,
    position: 'relative'
  },
  container: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  navBar: {
    zIndex: 3,
    width: 256,
    minWidth: 256,
    flex: '0 0 auto'
  },
  content: {
    overflowY: 'auto',
    flex: '1 1 auto'
  },
  navBarSkeleton: {
    height: '100%',
    width: 256,
    backgroundColor: 'red'
  }
}));

const Dashboard = (props) => {
  const { route } = props;
  const page = 1;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { connect: chatConnect, disconnect: chatDisconnect } =
    useContext(SocketChatContext);
  const { connect: notificationConnect, disconnect: notificationDisconnect } =
    useContext(SocketNotificationContext);
  const { handleSetPermission } = useContext(PermissionContext);
  const { companies } = useContext(CompanyContext);

  const user = useSelector((state) => state.session.user);
  const permissionHold = useSelector(
    (state) => state.permission.permissionHold
  );
  const userOnlines = useSelector((state) => state.userOnline.users);

  const [openNavBarMobile, setOpenNavBarMobile] = useState(false);

  const handleNavBarMobileOpen = () => setOpenNavBarMobile(true);

  const handleNavBarMobileClose = () => setOpenNavBarMobile(false);

  useEffect(() => {
    //* chat socket connect
    chatConnect();

    //* notification socket connect
    notificationConnect();

    // //* get info user
    dispatch(getUserInfo());

    //* get users
    dispatch(getUsers());
    setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => {
      //* chat socket disconnect
      chatDisconnect();

      //* notification socket disconnect
      notificationDisconnect();
    };
  }, []);

  useEffect(() => {
    if (user.id) {
      handleSetPermission(user.id);
      dispatch(getTopNotificationsOfUser({ userId: user.id, page }));
    }
  }, [user.id]);

  //TODO: need handle for call widget
  //#region
  // useEffect(() => {
  //   var rcs = document.createElement('script');
  //   rcs.src =
  //     'http://localhost:8888/adapter.js?disableMessages=true&disableMeeting=true&clientId=rPbp5AMtSRGYP8oa2cF4ew&appServer=https://platform.devtest.ringcentral.com&clientSecret=JsBI8OCXQbWBh7e4DjdBQArkJprbN0RTiBVPDlPx5Lvw&disableLoginPopup=1';
  //   var rcs0 = document.getElementsByTagName('script')[0];
  //   rcs0.parentNode.insertBefore(rcs, rcs0);
  //   window.addEventListener('message', async (e) => {
  //     const data = e.data;
  //     if (data) {
  //       switch (data.type) {
  //         case 'rc-login-popup-notify': {
  //           const result = await dispatch(loginWidget());
  //           const token = unwrapResult(result);
  //           document
  //             .querySelector('#rc-widget-adapter-frame')
  //             .contentWindow.postMessage(
  //               {
  //                 type: 'rc-login',
  //                 token: token
  //               },
  //               '*'
  //             );
  //           break;
  //         }
  //         // get call when user gets a ringing call
  //       }
  //     }
  //   });
  //
  // }, []);
  //#endregion

  return (
    <>
      {loading ? (
        <SkeletonComponent />
      ) : (
        <div className={classes.root}>
          <NavBar
            className={classes.navBar}
            onMobileClose={handleNavBarMobileClose}
            openMobile={openNavBarMobile}
          />
          <div className={classes.container}>
            <TopBar
              className={classes.topBar}
              onOpenNavBarMobile={handleNavBarMobileOpen}
            />
            <main className={clsx(classes.content, classes.mainContent)}>
              {companies.length > 0 && (
                <Suspense fallback={<LinearProgress />}>
                  {permissionHold ? (
                    renderRoutes(route.routes)
                  ) : (
                    <LinearProgress />
                  )}
                </Suspense>
              )}
            </main>
          </div>
          <UserBar userOnlines={userOnlines} user={user} />
        </div>
      )}
    </>
  );
};

Dashboard.propTypes = {
  route: PropTypes.object
};

export default Dashboard;
