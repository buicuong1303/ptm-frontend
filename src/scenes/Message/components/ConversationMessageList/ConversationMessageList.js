/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useContext, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { ConversationMessageItem } from './components';
import { CompanyContext } from 'contexts/CompanyProvider';
import { createSelector } from 'reselect';
import { Waypoint } from 'react-waypoint';
import { getInfoPaginationMessages } from 'scenes/Message/Message.asyncAction';
import { MyModalImage } from './components';
import apiStatus from 'utils/apiStatus';
import { clearJump, clearJumpingLatest } from 'scenes/Message/Message.slice';
import { scrollTo } from 'utils/scrollTo';
import Loading from 'images/Rolling-1s-200px.gif';
import { useSnackbar } from 'notistack';
import MyModalDocument from './components/MyModalDocument';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    justifyContent: 'flex-end',
    cursor: 'default'
  },

  inner: {
    overflowY: 'auto',
    padding: theme.spacing(3, 2),
    paddingBottom: '0px'
  },
  footer: {
    marginTop: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

//* memoizing selector
const selectCurrentMessages = createSelector(
  (state) => state.message.currentMessages,
  (_, company) => company,
  (messages, company) => {
    if (messages[company.code]) {
      return messages[company.code].data;
    } else {
      return [];
    }
  }
);

const selectSelectedConversation = createSelector(
  (state) => state.message.selectedConversation,
  (_, company) => company,
  (selectedConversation, company) => {
    if (selectedConversation[company.code]) {
      return selectedConversation[company.code];
    } else {
      return {};
    }
  }
);
const selectHasPrevious = createSelector(
  (state) => state.message.currentMessages,
  (_, company) => company,
  (currentMessages, company) => {
    if (currentMessages[company.code]) {
      return currentMessages[company.code].manager.hasPrevious;
    } else {
      return false;
    }
  }
);

const ConversationMessageList = (props) => {
  //* redux
  const {
    className,
    loadMoreMessages,
    loadPreviousMessages,
    loadNextMessages,
    onScrollBot,
    onOpenMakeOptSuggestionOrSensitiveWord,
    ...rest
  } = props;
  const scrollBar = useRef(null);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [infoAttachmentViewing, setInfoAttachmentViewing] = useState({
    name: '',
    url: '',
    width: 100,
  });
  const handleOpen = ({ name, url, width }) => {
    setInfoAttachmentViewing({ name, url, width });
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };


  const [openDocument, setOpenDocument] = useState(false);
  const [documentViewing, setDocumentViewing] = useState({
    name: '',
    url: '',
  });
  const handleOpenDocumentViewing = ({ name, url }) => {
    setDocumentViewing({ name, url });
    setOpenDocument(true);
  };
  const handleCloseDocumentViewing = () => setOpenDocument(false);

  const { company } = useContext(CompanyContext);
  const isLoadingPreviousMessages = useSelector(
    (state) => state.message.isLoadingPreviousMessages
  );
  const currentMessages = useSelector((state) =>
    selectCurrentMessages(state, company)
  );
  const jumpMessages = useSelector((state) => state.message.jumpMessages);
  const status = useSelector((state) => state.message.status);
  const selectedConversation = useSelector((state) =>
    selectSelectedConversation(state, company)
  );
  const hasPrevious = useSelector((state) => selectHasPrevious(state, company));
  const user = useSelector((state) => state.session.user);
  const { enqueueSnackbar } = useSnackbar();

  //* show notification
  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });
  useEffect(() => {
    if (status === apiStatus.ERROR) showSnackbar('Something wrong', 'error');
  }, [status]);
  useEffect(async () => {
    dispatch(
      getInfoPaginationMessages({
        conversationId: selectedConversation.id,
        company: company
      })
    );
  }, [selectedConversation.id]);
  useEffect(() => {
    if (selectedConversation['isJumping'] === false) dispatch(clearJump());
    //* auto scroll bot
    scrollBar.current.scrollTop = scrollBar.current.scrollHeight;
  }, [selectedConversation.id]);
  React.useLayoutEffect(() => {
    if (!jumpMessages.manager.jumpStatus) {
      scrollBar.current.scrollTop = scrollBar.current.scrollHeight;
    }
    //* auto scroll bot in case of jumping bot
    if (
      jumpMessages.manager.jumpStatus === apiStatus.SUCCESS &&
      jumpMessages.manager.hasNext === false &&
      !jumpMessages.manager.isJumpingLatest
    ) {
      scrollBar.current.scrollTop = scrollBar.current.scrollHeight;
    }
  }, [selectedConversation.lastMessage.id]);
  React.useLayoutEffect(() => {
    //* scroll to jump message
    if (jumpMessages.manager.jumpStatus === apiStatus.SUCCESS) {
      const element = document.getElementById('messages');
      const infoJumpMessage = jumpMessages.data.find(
        (item) => item.id === jumpMessages.manager.jumpMessageId
      );
      if (!infoJumpMessage) return;
      let totalHeight = 0;
      if (jumpMessages.manager.hasNext === false) {
        totalHeight = currentMessages.reduce((total, item, index) => {
          if (item.index < infoJumpMessage.index) {
            const eleHeight = document.getElementById(item.id);
            return total + eleHeight.clientHeight + 32; //*margin between messages;
          }
          return total;
        }, 0);
      } else {
        totalHeight = jumpMessages.data.reduce((total, item) => {
          if (item.index < infoJumpMessage.index) {
            const eleHeight = document.getElementById(item.id);
            return total + eleHeight.clientHeight + 32; //*margin between messages;
          }
          return total;
        }, 0);
      }
      scrollTo(element, totalHeight, 550);
      if (jumpMessages.manager.isJumpingLatest) dispatch(clearJumpingLatest());
    }
  }, [jumpMessages.manager.jumpStatus]);

  const renderLoadingTop = () => {
    if (jumpMessages.manager.jumpStatus === apiStatus.SUCCESS) {
      if (jumpMessages.manager.hasPrevious && isLoadingPreviousMessages)
        return (
          <div
            style={{
              textAlign: 'center'
            }}
          >
            <img src={Loading} style={{ width: 50, height: 50 }} />
          </div>
        );
    } else if (!jumpMessages.manager.jumpStatus) {
      if (hasPrevious && isLoadingPreviousMessages)
        return (
          <div
            style={{
              textAlign: 'center'
            }}
          >
            <img src={Loading} style={{ width: 50, height: 50 }} />
          </div>
        );
    }
    return null;
  };
  const renderLoadingBot = () => {
    return jumpMessages.manager.jumpStatus === apiStatus.SUCCESS ? (
      <Waypoint
        onEnter={() => {
          onScrollBot(false);
          if (loadNextMessages) {
            loadNextMessages({
              botBoundary: jumpMessages.data[jumpMessages.data.length - 1].index
            });
          }
        }}
      >
        <div
          style={{
            textAlign: 'center'
          }}
        >
          {jumpMessages.manager.hasNext && (
            <img src={Loading} style={{ width: 50, height: 50 }} />
          )}
        </div>
      </Waypoint>
    ) : null;
  };
  const renderMessages = () => {
    if (jumpMessages.manager.jumpStatus === apiStatus.PENDING)
      return (
        <img
          src={Loading}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 50,
            height: 50
          }}
        />
      );
    if (jumpMessages.manager.jumpStatus === apiStatus.SUCCESS) {
      if (jumpMessages.manager.hasNext === true)
        return jumpMessages.data.map((message) => {
          return (
            <ConversationMessageItem
              key={message.id}
              message={message}
              user={user}
              onOpen={handleOpen}
              handleOpenDocumentViewing={handleOpenDocumentViewing}
            />
          );
        });
      return currentMessages.map((message) => {
        return (
          <ConversationMessageItem
            key={message.id}
            message={message}
            user={user}
            onOpen={handleOpen}
            handleOpenDocumentViewing={handleOpenDocumentViewing}
          />
        );
      });
    }
    if (jumpMessages.manager.jumpStatus === null) {
      return currentMessages.map((message) => {
        return (
          <ConversationMessageItem
            key={message.id}
            message={message}
            user={user}
            onOpen={handleOpen}
            handleOpenDocumentViewing={handleOpenDocumentViewing}
            onOpenMakeOptSuggestionOrSensitiveWord={onOpenMakeOptSuggestionOrSensitiveWord}

          />
        );
      });
    }
  };
  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <div
        id="messages"
        className={classes.inner}
        ref={scrollBar}
        onScroll={(e) => {
          e.preventDefault();

          if (scrollBar.current.scrollTop <= 0) {
            if (!jumpMessages.manager.jumpStatus) {
              loadMoreMessages({ topBoundary: currentMessages[0]?.index });
              if (hasPrevious) scrollBar.current.scrollTop = 1;
            } else {
              if (jumpMessages.manager.jumpStatus === apiStatus.SUCCESS) {
                if (jumpMessages.manager.hasNext) {
                  //* jump to middle
                  loadPreviousMessages({
                    topBoundary: jumpMessages.data[0]?.index
                  });
                  if (jumpMessages.manager.hasPrevious)
                    scrollBar.current.scrollTop = 1;
                } else {
                  //* jump to bot
                  loadMoreMessages({ topBoundary: currentMessages[0]?.index });
                  if (hasPrevious) scrollBar.current.scrollTop = 1;
                }
              }
            }
          }
        }}
      >
        {renderLoadingTop()}

        {renderMessages()}

        {renderLoadingBot()}
      </div>
      
      <MyModalImage
        onClose={handleClose}
        url={infoAttachmentViewing.url}
        name={infoAttachmentViewing.name}
        open={open}
        width={infoAttachmentViewing.width}
      />

      <MyModalDocument
        onClose={handleCloseDocumentViewing}
        url={documentViewing.url}
        name={documentViewing.name}
        open={openDocument}
      />
    </div>
  );
};

ConversationMessageList.propTypes = {
  className: PropTypes.string,
  handleDownloadFile: PropTypes.func,
  loadMoreMessages: PropTypes.func,
  onScrollBot: PropTypes.func.isRequired,
  loadPreviousMessages: PropTypes.func,
  loadNextMessages: PropTypes.func
};
const MemoizedConversationMessageList = React.memo(ConversationMessageList);
export default MemoizedConversationMessageList;
