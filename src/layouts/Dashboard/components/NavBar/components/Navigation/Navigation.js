import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import NavigationList from '../NavigationList';
import { useRouter } from 'hooks';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(3)
  },
  pageTitleColor: {
    color: theme.palette.white,
    fontWeight: 900
  },
  titleStyle: {
    cursor: 'pointer'
    // '&:hover': {
    //   backgroundColor: '#0069d9',
    //   borderColor: '#0062cc',
    //   boxShadow: 'none'
    // }
  }
}));

const Navigation = (props) => {
  const {
    title,
    pages,
    totalMessageUnread,
    className,
    component: Component,
    ...rest
  } = props;

  const classes = useStyles();
  const router = useRouter();
  const [openNav, setOpenNav] = useState(true);
  const handleClick = () => {
    setOpenNav(!openNav);
  };

  return (
    <Component {...rest} className={clsx(classes.root, className)}>
      {title && (
        <div className={classes.titleStyle} onClick={() => handleClick()}>
          <Typography className={classes.pageTitleColor} variant="overline">
            {title}
          </Typography>
          {openNav ? (
            <ExpandLessIcon
              style={{ color: 'white', alignItems: 'center', float: 'right' }}
            />
          ) : (
            <ExpandMoreIcon
              style={{ color: 'white', alignItems: 'center', float: 'right' }}
            />
          )}
        </div>
      )}
      {openNav ? (
        <NavigationList
          depth={0}
          totalMessageUnread={totalMessageUnread}
          pages={pages}
          router={router}
        />
      ) : (
        ''
      )}
    </Component>
  );
};

Navigation.propTypes = {
  className: PropTypes.string,
  component: PropTypes.any,
  pages: PropTypes.array.isRequired,
  title: PropTypes.string
};

Navigation.defaultProps = {
  component: 'nav'
};

export default Navigation;
