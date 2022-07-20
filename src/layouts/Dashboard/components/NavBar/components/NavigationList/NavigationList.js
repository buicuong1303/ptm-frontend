/* eslint-disable no-unused-vars */
import React from 'react';
import { matchPath } from 'react-router-dom';
import { List } from '@material-ui/core';
import PropTypes from 'prop-types';
import NavigationListItem from '../NavigationListItem';

const NavigationList = (props) => {
  const { pages, ...rest } = props;

  return (
    <List>
      {pages.reduce(
        (items, page) => reduceChildRoutes({ items, page, ...rest }),
        []
      )}
    </List>
  );
};

NavigationList.propTypes = {
  depth: PropTypes.number,
  pages: PropTypes.array,
  umn: PropTypes.number
};

export default NavigationList;

const reduceChildRoutes = (props) => {
  const { router, items, page, depth } = props;

  if (page.children) {
    const matchItems = (page?.children || []).map((item) => {
      return matchPath(router.location.pathname, {
        path: item.href,
        exact: false
      });
    });

    const open = matchItems.filter((item) => item).length > 0;

    items.push(
      <NavigationListItem
        depth={depth}
        icon={page.icon}
        key={page.title}
        label={page.label}
        open={Boolean(true)} // TODO need to pass ${open} parameter
        title={page.title}
        router={router}
        href={page.href}
      >
        <NavigationList
          depth={depth + 1}
          pages={page.children}
          router={router}
        />
      </NavigationListItem>
    );
  } else {
    items.push(
      <NavigationListItem
        depth={depth}
        href={page.href}
        icon={page.icon}
        key={page.title}
        label={page.label}
        title={page.title}
        onClick={page.onclick}
        manualRoute={page.manualRoute}
        router={router}
        umn={page.umn ? page.umn : 0}
      />
    );
  }

  return items;
};
