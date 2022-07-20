/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import { Avatar, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import ProfileIcon from '@material-ui/icons/PermIdentityOutlined';
import iconFileZip from 'images/zip.png';
import CallMadeIcon from '@material-ui/icons/CallMade';
import CallReceivedIcon from '@material-ui/icons/CallReceived';
import iconVideo from 'images/video-file.png';
import iconAudio from 'images/audio-file.png';
import iconFile from 'images/file.png';
import * as PropTypes from 'prop-types';
import clsx from 'clsx';
import React from 'react';
import { formatPhoneNumber } from 'utils/formatPhoneNumber';
import * as moment from 'moment';
import Highlighter from 'react-highlight-words';
import { isEmpty } from 'lodash';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.primary.main,
    width: 40,
    height: 40
  },
  messageBody: {
    padding: '0px 10px',
    fontSize: 15,
    width: '100%'
  },
  conversation: {
    color: '#0684bd',
    fontWeight: 'bold'
  },
  messageText: {
    paddingTop: 6,
    // WebkitLineClamp: 4,
    // WebkitBoxOrient: 'vertical',
    // overflow: 'hidden',
    // display: '-webkit-box',
    // textOverflow: 'ellipsis',
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap'
  },
  timestamp: {
    float: 'right',
    color: '#888'
  },
  chip: {
    marginLeft: 'auto',
    color: '#888'
  },
  attachments: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '300px'
  },
  attachmentItem: {
    margin: '10px 0px'
  },
  activity: {
    display: 'flex',
    alignItems: 'center'
  },
  fileItem: {
    float: 'left',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(1, 0),
    '&:hover': {
      '& > svg': {
        display: 'block'
      }
    }
  },
  infoFile: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '10px',
    position: 'relative'
  },
  fileName: {
    fontSize: '15px',
    lineHeight: '15px',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    overflow: 'hidden'
  }
}));
function MessageItem({ data }) {
  const classes = useStyles();
  return (
    <>
      <Avatar className={classes.avatar} src={data._source.users?.avatar} />
      <div className={classes.messageBody}>
        <div className={classes.activity}>
          {data._source.direction === 'outbound' && (
            <>
              <span style={{ fontWeight: 'bold' }}>
                {isEmpty(data._source.users)
                  ? 'Unknown'
                  : data._source.users?.firstName +
                    ' ' +
                    data._source.users?.lastName}
              </span>
              <span>&nbsp; in &nbsp;</span>
            </>
          )}
          <span className={classes.conversation}>
            {formatPhoneNumber(
              data._source.conversations.company_customers.customers.phoneNumber
            )}
          </span>
          <span style={{ alignContent: 'baseline' }}>
            &nbsp;
            {data._source.direction === 'outbound' ? (
              <CallMadeIcon color="primary" fontSize="small" />
            ) : (
              <CallReceivedIcon style={{ color: '#e53935' }} fontSize="small" />
            )}
          </span>
          <span className={classes.chip}>
            <Chip
              label={
                data._source.conversations.company_customers.companies.name
              }
              size="small"
              color="primary"
            />
          </span>
        </div>
        <Highlighter
          className={classes.messageText}
          searchWords={data.highlights.text}
          autoEscape
          textToHighlight={data._source.text.replace(/\\n/g, '\n')}
        />
        {/* <div className={classes.messageText}>{data._source.text}</div> */}
        {data._source.attachments && (
          <div className={classes.attachments}>
            {data._source.attachments.map((attachment, index) => {
              return attachment.category === 'image' ? (
                <div
                  key={`${index}_${data._source.id}`}
                  className={classes.attachmentItem}
                  style={{ height: attachment.height, maxHeight: 200 }}
                >
                  {['jpg', 'jpeg', 'gif', 'png', 'bmp', 'svg+xml'].includes(
                    attachment.format
                  ) ? (
                    <img
                      key={`${index}_${data._source.id}`}
                      src={attachment.url}
                      alt={'Grapefruit slice atop a pile of other slices'}
                      style={{
                        maxWidth: '100%',
                        borderRadius: 5,
                        maxHeight: 200
                      }}
                    />
                  ) : (
                    <img alt="img" />
                  )}
                  <span className={classes.fileName}>
                    <Highlighter
                      searchWords={data.highlights['attachments.name']}
                      autoEscape
                      textToHighlight={
                        attachment.name ||
                        attachment.url.slice(
                          attachment.url.lastIndexOf('/') + 1
                        )
                      }
                    />
                  </span>
                </div>
              ) : attachment.category === 'application' ? (
                // message file
                <div
                  className={classes.fileItem}
                  style={{ color: '#000000' }}
                  key={`${index}_${data._source.id}`}
                >
                  <img
                    src={attachment.format === 'zip' ? iconFileZip : iconFile}
                    className={classes.icon}
                  />
                  <div className={classes.infoFile}>
                    <span className={classes.fileName}>
                      <Highlighter
                        highlightClassName={classes.messageText}
                        searchWords={data.highlights.text}
                        autoEscape
                        textToHighlight={
                          attachment.name ||
                          attachment.url.slice(
                            attachment.url.lastIndexOf('/') + 1
                          )
                        }
                      />
                    </span>
                  </div>
                </div>
              ) : attachment.category === 'audio' ? (
                <div
                  className={classes.fileItem}
                  style={{ color: '#000000' }}
                  key={`${index}_${data._source.id}`}
                >
                  <img src={iconAudio} className={classes.icon} />
                  <div className={classes.infoFile}>
                    <span className={classes.fileName}>
                      {attachment.name ||
                        attachment.url.slice(
                          attachment.url.lastIndexOf('/') + 1
                        )}
                    </span>
                    <span
                      className={classes.fileSize}
                      style={{ fontSize: '11px' }}
                    >
                      {attachment.size} KB
                    </span>
                  </div>
                </div>
              ) : attachment.category === 'video' ? (
                <div
                  className={classes.fileItem}
                  style={{ color: '#000000' }}
                  key={`${index}_${data._source.id}`}
                >
                  <img src={iconVideo} className={classes.icon} />
                  <div className={classes.infoFile}>
                    <span className={classes.fileName}>
                      {attachment.name ||
                        attachment.url.slice(
                          attachment.url.lastIndexOf('/') + 1
                        )}
                    </span>
                  </div>
                </div>
              ) : (
                ''
              );
            })}
          </div>
        )}
        <span className={classes.timestamp}>
          {new Date(data._source.lastModifiedTime)
            .toISOString()
            .slice(0, 10) === new Date().toISOString().slice(0, 10)
            ? moment(data._source.lastModifiedTime).fromNow()
            : moment(data._source.lastModifiedTime).format(
                'MM-DD-YYYY hh:mm A'
              )}
        </span>
      </div>
    </>
  );
}
MessageItem.propTypes = {
  data: PropTypes.object.isRequired,
  searchValue: PropTypes.string
};
MessageItem.defaultProps = {
  searchValue: ''
};
export default MessageItem;
