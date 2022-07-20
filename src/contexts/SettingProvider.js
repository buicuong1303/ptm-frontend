import React, { createContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateSetting } from 'store/asyncActions/session.asyncAction';

const SettingContext = createContext();
const { Provider } = SettingContext;
const SettingProvider = ({ children }) => {
  const dispatch = useDispatch();

  if (Notification.permission === 'default') {
    Notification.requestPermission().then((result) => {
      if (result === 'granted') {
        dispatch(
          updateSetting({
            allowDesktopNotification: true
          })
        );
      } else if (result === 'denied') {
        dispatch(
          updateSetting({
            allowDesktopNotification: false
          })
        );
      }
    });
  } else
    try {
      Notification.requestPermission();
    } catch (e) {
      // console.log(e);
    }
  // eslint-disable-next-line no-unused-vars
  const [selectedAudio, setSelectedAudio] = useState([
    '/audio/notification/01.wav',
    '/audio/notification/02.wav'
  ]);

  const showNotification = (message, callback, user, type = 'outbound') => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return;
    } else if (
      Notification.permission === 'granted' &&
      user?.allowDesktopNotification
    ) {
      if (document.hidden) {
        if (user?.allowSoundNotification) {
          let audio = null;
          if (type === 'outbound') {
            audio = new Audio(selectedAudio[0]);
          } else {
            audio = new Audio(selectedAudio[1]);
          }
          audio.play();
        }
        const notification = new Notification('New message', {
          body: message,
          timestamp: 2 * 1000
        });
        notification.onclick = function (event) {
          event.preventDefault();
          callback();
        };
      }
    }
  };

  return (
    <>
      <Provider
        value={{
          showNotification
        }}
      >
        {children}
      </Provider>
    </>
  );
};

export { SettingContext, SettingProvider };
