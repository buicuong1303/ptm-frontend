/* eslint-disable no-unused-vars */
import React, { createContext, useRef } from 'react';
import { Authorizer } from 'casbin.js';
import { useDispatch } from 'react-redux';
import { getPermissionOfClient } from 'scenes/Permission/Permission.asyncActions';

const PermissionContext = createContext();
const { Provider } = PermissionContext;
const PermissionProvider = ({ children }) => {
  const dispatch = useDispatch();
  let authorizer = useRef(null);
  const handleSetPermission = async (userId) => {
    const permissionObj = await dispatch(getPermissionOfClient(userId));
    authorizer.current = new Authorizer('manual');
    authorizer.current.setPermission(permissionObj.payload);
  };
  return (
    <Provider value={{ authorizer, handleSetPermission }}>{children}</Provider>
  );
};

export { PermissionContext, PermissionProvider };
