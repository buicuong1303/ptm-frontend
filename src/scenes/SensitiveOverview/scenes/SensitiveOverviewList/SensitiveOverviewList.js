/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Waypoint } from 'react-waypoint';
import SensitiveOverviewItem from '../SensitiveOverviewItem';
import Loading from 'images/Rolling-1s-200px.gif';

const useStyles = makeStyles((theme) => ({
  sensitiveList: {
    flex: 1,
    padding: theme.spacing(1, 1),
    overflowY: 'auto'
  }
}));

function SensitiveOverviewList(props) {
  const { sensitiveOverviews, handleClick, onLoadMore, manage } = props;
  const classes = useStyles();

  return (
    <ul className={classes.sensitiveList}>
      {sensitiveOverviews.map((sensitiveOverview, index) => (
        <SensitiveOverviewItem
          handleClick={handleClick}
          key={index}
          sensitiveOverview={sensitiveOverview}
          index={index}
          no={index + 1}
        />
      ))}
      {manage.hasNext && (
        <Waypoint onEnter={onLoadMore}>
          <div
            style={{
              textAlign: 'center'
            }}
          >
            {manage._page > 1 && (
              <img src={Loading} style={{ width: 50, height: 50 }} />
            )}
          </div>
        </Waypoint>
      )}
    </ul>
  );
}

SensitiveOverviewList.propTypes = {
  sensitiveOverviews: PropTypes.array
};

SensitiveOverviewList.defaultProps = {
  sensitiveOverviews: []
};
export default SensitiveOverviewList;
