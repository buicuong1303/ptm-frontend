/* eslint-disable no-unused-vars */
import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import { Page } from 'components';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {},

  title: {},

  paper: {
    padding: '6px',
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  tooltipContent: {
    minWidth: '100px',
    minHeight: '50px',
    backgroundColor: '#ffffff'
  }
}));

const TutorialTooltip = withStyles((theme) => ({
  tooltip: {
    padding: theme.spacing(2),
    backgroundColor: '#ffffff',
    color: '#263238',
    maxWidth: '700px',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
  }
}))(Tooltip);

const TooltipCustom = (props) => {
  // eslint-disable-next-line
  const { className, title, children, icon, style,...rest } = props;

  const classes = useStyles();

  //* UI
  return (
    <TutorialTooltip
      placement="right-end"
      title={
        <React.Fragment>
          <div className={classes.tooltipContent} style={style}>
            {children}
          </div>
        </React.Fragment>
      }
    >
      {icon}
    </TutorialTooltip>
  );
};

TooltipCustom.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.any,
  icon: PropTypes.any,
  style: PropTypes.any
};

export default TooltipCustom;
