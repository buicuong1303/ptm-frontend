/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import ScheduleItem from '../ScheduleItem';
import { useSelector } from 'react-redux';
import { Waypoint } from 'react-waypoint';
import Loading from 'images/Rolling-1s-200px.gif';
const useStyles = makeStyles((theme) => ({
  scheduleList: {
    padding: '10px 10px',
    overflowY: 'auto',
    flex: '1'
  }
}));

const ScheduleList = (props) => {
  const {
    dataSchedule,
    onStop,
    onPause,
    onResume,
    onDelete,
    processingSchedules,
    canUpdate,
    onLoadMore,
    page
  } = props;
  const classes = useStyles();
  const manage = useSelector((state) => state.schedule.manage);
  return (
    <>
      <ul className={classes.scheduleList}>
        {dataSchedule.map((schedule, index) => (
          <ScheduleItem
            index={index}
            key={schedule.id}
            schedule={schedule}
            onStop={onStop}
            onPause={onPause}
            onResume={onResume}
            onDelete={onDelete}
            canUpdate={canUpdate}
            isProcessing={processingSchedules.includes(schedule.id)}
          />
        ))}
        {manage.hasNext && (
          <Waypoint onEnter={onLoadMore}>
            <div
              style={{
                textAlign: 'center'
              }}
            >
              {page > 1 && (
                <img src={Loading} style={{ width: 50, height: 50 }} />
              )}
            </div>
          </Waypoint>
        )}
      </ul>
    </>
  );
};

ScheduleList.propTypes = {
  dataSchedule: PropTypes.array,
  onStop: PropTypes.func,
  onResume: PropTypes.func,
  onPause: PropTypes.func,
  onDelete: PropTypes.func,
  isProcessing: PropTypes.bool
};

ScheduleList.defaultProps = {
  dataSchedule: [],
  processingSchedules: []
};
export default ScheduleList;
