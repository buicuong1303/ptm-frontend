/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import { Divider, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ListResult, ToolBar } from './components';
import * as PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { CompanyContext } from 'contexts/CompanyProvider';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import {
  selectConversation,
  clearJump,
  addConversation,
  setFilters
} from 'scenes/Message/Message.slice';
import { SocketChatContext } from 'services/socket/SocketChat';
import {
  jumpToMessageInConversation,
  getNewConversationOfUser,
  getInfoPaginationMessages
} from 'scenes/Message/Message.asyncAction';
import {
  clearScroll,
  loadMoreResult,
  searchAll
} from 'store/asyncActions/search.asyncAction';
import { unwrapResult } from '@reduxjs/toolkit';
import { clearStateSearch } from 'store/slices/search.slice';
import { useSnackbar } from 'notistack';
const useStyles = makeStyles((theme) => ({}));

function PanelSearch({ onClose }) {
  const [result, setResult] = useState([]);
  const scrollId = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const [filters, setFiltersSearchAll] = useState({
    types: 'All',
    time: 'Any time'
  });
  const { setCompany, companies, handleResetLoadingConversation } =
    useContext(CompanyContext);
  const conversations = useSelector((state) => state.message.conversations);
  const selectedConversation = useSelector(
    (state) => state.message.selectedConversation
  );
  const [searchValue, setSearchValue] = useState('');
  const [hasNext, setHasNext] = useState(true);
  const { leaveRoom, joinRoom, handelReadMessage } =
    useContext(SocketChatContext);
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (message, status) =>
    enqueueSnackbar(message, { variant: status });
  const handleChangeFilters = async (filters) => {
    setFiltersSearchAll(filters);
    setHasNext(true);

    if (!searchValue) return;
    try {
      const actionResult = await dispatch(
        searchAll({
          size: 13,
          searchValue,
          scroll: { scroll_id: scrollId.current, scroll: '5m' },
          filters: filters
        })
      );
      const data = unwrapResult(actionResult);
      setResult(data?.hist);
      scrollId.current = data?._scroll_id;
      const ele = document.getElementById('results');
      ele.scrollTop = 0;
    } catch (error) {
      // showSnackbar('Something wrong', 'error');
      showSnackbar('Search fail', 'error');
    }
  };
  const handleClick = async (data) => {
    try {
      if (!onClose) return;
      onClose();
      const selectCompany = companies.find(
        (company) =>
          company.code ===
          data._source.conversations.company_customers.companies.code
      );
      setCompany(selectCompany);
      history.push(`/messages/${selectCompany.code}`);
      const toggleButton = document.getElementById('/messages');
      if (toggleButton && toggleButton.getAttribute('data-toggle') === 'false')
        toggleButton.click();

      const indexConversation = conversations[selectCompany.code]
        .map((item) => item.id)
        .indexOf(data._source.conversations.id);
      if (indexConversation < 0) {
        const actionResultPromise = dispatch(
          getNewConversationOfUser({
            conversationId: data._source.conversations.id,
            companyCode:
              data._source.conversations.company_customers.companies.code,
            isJumping: true
          })
        );
        const actionResult = await actionResultPromise;

        const result = unwrapResult(actionResult);
        dispatch(addConversation(result));
      }

      const participantId =
        conversations[selectCompany.code][indexConversation]?.participantId;
      //* leave old room
      for (const key in selectedConversation) {
        if (Object.hasOwnProperty.call(selectedConversation, key)) {
          if (key === selectCompany.code) {
            leaveRoom(selectedConversation[selectCompany.code].id);
          }
        }
      }
      // * set conversation
      dispatch(
        selectConversation({
          conversationId: data._source.conversations.id,
          company: selectCompany,
          isJumping: true
        })
      );
      dispatch(
        getInfoPaginationMessages({
          conversationId: data._source.conversations.id,
          company: selectCompany
        })
      );
      dispatch(clearJump());
      dispatch(
        setFilters({
          companyCode: selectCompany.code,
          search: '',
          types: [],
          labels: [],
          users: []
        })
      );
      console.log(data.highlights);
      dispatch(
        jumpToMessageInConversation({
          messageId: data._source.id,
          company: selectCompany,
          conversationId: data._source.conversations.id,
          highlights: data.highlights
        })
      );

      //* join new room
      joinRoom({
        selectedNewConversationId: data._source.conversations.id,
        participantId,
        selectCompany
      });

      //* read message in this connection
      // dispatch(
      //   readMessage({
      //     conversationId: data._source.conversations.id,
      //     company: selectCompany,
      //     umn: conversations[selectCompany.code][indexConversation]?.umn
      //   })
      // );

      //* read message in other connection
      // handelReadMessage({
      //   participantId: participantId,
      //   company: {
      //     code: selectCompany.code
      //   },
      //   conversationId: data._source.conversations.id,
      //   umn: conversations[selectCompany.code][indexConversation]?.umn
      // });
    } catch (error) {
      // showSnackbar('Something wrong', 'error');
      showSnackbar('Join room fail', 'error');
    }
  };

  const handleSearch = async () => {
    if (!searchValue) return;
    setHasNext(true);
    setResult([]);
    setFiltersSearchAll({
      types: 'All',
      time: 'Any time'
    });
    try {
      const actionResult = await dispatch(
        searchAll({
          size: 13,
          searchValue,
          scroll: { scroll_id: scrollId.current, scroll: '5m' },
          filters: {
            types: 'All',
            time: 'Any time'
          }
        })
      );
      const data = unwrapResult(actionResult);
      setResult(data?.hist);
      scrollId.current = data?._scroll_id;
      const ele = document.getElementById('results');
      ele.scrollTop = 0;
    } catch (error) {
      // showSnackbar('Something wrong', 'error');
      showSnackbar('Search fail', 'error');
    }
  };
  const handleChangeSearchValue = (value) => {
    setSearchValue(value.toString());
  };

  const handleLoadMoreResult = async () => {
    if (!hasNext) return;
    if (searchValue) {
      try {
        const actionResult = await dispatch(
          loadMoreResult({
            scroll: {
              scroll_id: scrollId.current,
              scroll: '5m'
            }
          })
        );
        const data = unwrapResult(actionResult);
        if (data?.hist.length === 0) setHasNext(false);
        setResult([...result, ...data?.hist]);
      } catch (error) {
        setHasNext(false);
        // showSnackbar('Something wrong', 'error');
        showSnackbar('load more fail', 'error');
      }

      // setResult([...result, ...data]);
    }
  };
  useEffect(() => {
    return () => {
      if (scrollId.current)
        dispatch(
          clearScroll({
            scroll_ids: [scrollId.current]
          })
        );

      dispatch(clearStateSearch());
    };
  }, []);
  return (
    <>
      <ToolBar
        onSearch={handleSearch}
        onChangeSearchValue={handleChangeSearchValue}
        filters={filters}
        onChangeFilters={handleChangeFilters}
      />
      <Typography variant="h5">Result</Typography>
      <Divider />
      <ListResult
        listResult={result}
        onClick={handleClick}
        onLoadMore={handleLoadMoreResult}
      />
    </>
  );
}
PanelSearch.propType = {
  onClose: PropTypes.func.isRequired
};
export default PanelSearch;
