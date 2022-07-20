/* eslint-disable no-unused-vars */
import React, {
  useLayoutEffect,
  useRef,
  useMemo,
  createRef,
  useState,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import chroma from 'chroma-js';
import { colors, Tooltip } from '@material-ui/core';
import { cloneDeep, isEqual } from 'lodash';

const useStyles = makeStyles(() => ({
  root: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  },
  list: {
    display: 'flex',
    flexDirection: 'row',
    minWidth: 'min-content'
  },
  label: {
    margin: '1px 1px',
    borderRadius: '4px',
    padding: '2px 5px',
    fontSize: '12px',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    height: '100%',
    maxWidth: '150px'
  },
  more: {
    height: '100%',
    backgroundColor: colors.indigo[800],
    color: '#ffffff',
    margin: '1px 1px',
    padding: '2px 5px',
    fontSize: '12px',
    borderRadius: '4px',
    maxWidth: '150px'
  },
  moreContainer: {
    background: '#ffffff'
  },
  tooltip: {
    padding: '4px',
    backgroundColor: '#ffffff',
    color: '#263238',
    maxWidth: '700px',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
  }
}));

const Labels = (props) => {
  const classes = useStyles();
  const { labels, className, ...rest } = props;

  const [labelsInternal, setLabelsInternal] = useState([]);

  const [more, setMore] = useState(0);
  const moreRef = useRef(null);

  const scrollContainerRef = useRef(null);
  const listRef = useRef(null);
  const labelItemRefs = useMemo(
    () =>
      Array(labels.length)
        .fill()
        .map(() => createRef()),

    //* tranh khoi tao useMemo nhieu lan khi labels prop khong doi
    [cloneDeep(labels)]
  );

  useLayoutEffect(() => {
    const itemIndexRemove = getIndexItemOverFlow();

    const labelsCurrent = cloneDeep(labels);

    if (itemIndexRemove > 0) {
      labelsCurrent.splice(
        itemIndexRemove,
        labels.length - (itemIndexRemove - 1)
      );

      //* so sanh nhung labels se hien thi (labelsCurrent) va nhung label dang hien thi (labelsInternal)
      if (!isEqual(labelsCurrent, labelsInternal))
        setLabelsInternal(labelsCurrent);
    }

    //* tat ca labels ban dau - tat ca labels dang hien thi
    setMore(labels.length - labelsInternal.length);

    //* tranh goi useLayoutEffect nhieu lan khi labels prop khong doi
  }, [cloneDeep(labels)]);

  //* tim vi tri bat dau OverFlow
  const getIndexItemOverFlow = () => {
    let totalWidthItem = 0;
    let position = 0;

    for (let index = 0; index < labelItemRefs.length; index++) {
      totalWidthItem += (labelItemRefs[index].current?.offsetWidth ?? 0) + 2; //* 2 is marginLeft + marginRight;
      if (
        totalWidthItem >
        scrollContainerRef?.current?.clientWidth -
          (moreRef?.current?.clientWidth + 2) //* 2 is marginLeft + marginRight
      ) {
        position = index;
        break;
      }
    }

    return position;
  };

  const renderMoreLabels = () => {
    return (
      <div className={classes.moreContainer}>
        {labels.map((label, index) => (
          <div
            ref={labelItemRefs[index]}
            style={{
              backgroundColor: chroma(label.color).alpha(0.1).css(),
              color: label.color
            }}
            className={classes.label}
            key={index}
          >
            {label.label}
          </div>
        ))}
      </div>
    );
  };

  //* dong bo labels prop with local labels state
  useEffect(() => {
    setLabelsInternal(labels);
  }, [labels]);

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
      ref={scrollContainerRef}
    >
      <div className={classes.list} ref={listRef}>
        {labelsInternal.map((label, index) => (
          <div
            ref={labelItemRefs[index]}
            style={{
              backgroundColor: chroma(label.color).alpha(0.1).css(),
              color: label.color
            }}
            className={classes.label}
            key={index}
          >
            {label.label}
          </div>
        ))}

        {more !== 0 && (
          <Tooltip
            classes={{
              tooltip: classes.tooltip
            }}
            title={renderMoreLabels()}
            placement="top-end"
          >
            <div ref={moreRef} className={classes.more}>
              {more}+
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

Labels.propTypes = {
  labels: PropTypes.array,
  className: PropTypes.string
};

export default React.memo(Labels);
