import React from 'react';
import { SnackbarProvider } from 'notistack';
import { Button } from '@material-ui/core';

const SnackbarWrapper = (props) => {
  const { children } = props;

  const notistackRef = React.createRef();
  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      action={(key) => (
        <Button
          onClick={onClickDismiss(key)}
          style={{
            position: 'absolute',
            left: '0px',
            width: '100%',
            height: '100%',
            color: 'unset',
            background: '#ffffff00',
            padding: '0px',
            margin: '0px',
            minWidth: '25px'
          }}
        />
      )}
      preventDuplicate
      autoHideDuration={4000}
      ref={notistackRef}
    >
      {children}
    </SnackbarProvider>
  );
};

export default SnackbarWrapper;
