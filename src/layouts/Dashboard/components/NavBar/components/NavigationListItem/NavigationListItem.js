/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { useState, forwardRef, useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { ListItem, Button, Collapse } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { matchPath } from 'react-router-dom';

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref} style={{ flexGrow: 1 }}>
    <RouterLink {...props} />
  </div>
));

const useStyles = makeStyles((theme) => ({
  item: {
    display: 'block',
    paddingTop: 0,
    paddingBottom: 0
  },
  itemLeaf: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0
  },
  button: {
    color: theme.palette.white,
    padding: '8px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%'
  },
  buttonLeaf: {
    color: theme.palette.white,
    margin: '2px 0',
    padding: '8px 8px',
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
    fontWeight: theme.typography.fontWeightRegular,
    '&.depth-0': {
      fontWeight: theme.typography.fontWeightMedium
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.darkLight
    }
  },
  icon: {
    color: theme.palette.icon,
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  expandIcon: {
    marginLeft: 'auto',
    height: 16,
    width: 16
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto'
  },
  active: {
    backgroundColor: theme.palette.primary.darkLight,
    fontWeight: theme.typography.fontWeightMedium,
    '& $icon': {
      color: theme.palette.white
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.darkLight
    }
  },
  padge: {
    position: 'absolute',
    height: '20px',
    display: 'flex',
    padding: '0 6px',
    zIndex: '1',
    flexWrap: 'wrap',
    fontSize: '0.75rem',
    minWidth: '20px',
    boxSizing: 'border-box',
    alignItems: 'center',
    fontWeight: '500',
    lineHeight: '1',
    alignContent: 'center',
    borderRadius: '10px',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#e53935',
    transform: 'translate(-110%, -50%)'
  }
}));

const NavigationListItem = (props) => {
  const {
    title,
    href,
    depth,
    children,
    icon: Icon,
    className,
    open: openProp,
    label: Label,
    manualRoute,
    onClick,
    router,
    umn,
    ...rest
  } = props;

  const classes = useStyles();
  const [open, setOpen] = useState(openProp);
  const isActive = matchPath(router.location.pathname, {
    path: href,
    exact: false
  });

  const handleToggle = () => {
    setOpen((open) => !open);
  };

  const handleNavigate = (href) => {
    onClick(href);
  };

  let paddingLeft = 8;

  useEffect(() => {
    if (openProp) setOpen(openProp);
  }, [openProp]);

  if (depth > 0) {
    paddingLeft = 32 + 8 * depth;
  }

  const style = {
    paddingLeft
  };

  if (children) {
    return (
      <ListItem
        {...rest}
        className={clsx(classes.item, className)}
        disableGutters
      >
        <Button
          id={href}
          className={classes.button}
          onClick={handleToggle}
          style={style}
          data-toggle={open}
        >
          {Icon && <Icon className={classes.icon} />}
          {title}
          {open ? (
            <ExpandLessIcon className={classes.expandIcon} color="inherit" />
          ) : (
            <ExpandMoreIcon className={classes.expandIcon} color="inherit" />
          )}
        </Button>
        <Collapse in={open}>{children}</Collapse>
      </ListItem>
    );
  } else {
    return (
      <ListItem
        {...rest}
        className={clsx(classes.itemLeaf, className)}
        disableGutters
      >
        {manualRoute ? (
          <Button
            className={clsx(classes.buttonLeaf, `depth-${depth}`, {
              [classes.active]: isActive
            })}
            style={style}
            onClick={() => handleNavigate(href)}
          >
            {Icon && <Icon className={classes.icon} />}
            {title}
            {umn > 0 && <span className={classes.padge}>{umn}</span>}
            {Label && (
              <span className={classes.label}>
                <Label />
              </span>
            )}
          </Button>
        ) : (
          <Button
            activeClassName={classes.active}
            className={clsx(classes.buttonLeaf, `depth-${depth}`)}
            component={CustomRouterLink}
            exact
            style={style}
            to={href}
          >
            {Icon && <Icon className={classes.icon} />}
            {title}
            {Label && (
              <span className={classes.label}>
                <Label />
              </span>
            )}
          </Button>
        )}
      </ListItem>
    );
  }
};

NavigationListItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  depth: PropTypes.number.isRequired,
  href: PropTypes.string,
  icon: PropTypes.any,
  label: PropTypes.any,
  open: PropTypes.bool,
  title: PropTypes.string.isRequired,
  manualRoute: PropTypes.bool,
  onClick: PropTypes.func,
  router: PropTypes.object,
  umn: PropTypes.number
};

NavigationListItem.defaultProps = {
  depth: 0,
  open: false,
  manualRoute: false,
  onClick: null
};

export default NavigationListItem;
