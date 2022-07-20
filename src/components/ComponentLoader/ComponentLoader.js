/* eslint-disable no-unused-vars */

import React from 'react';
import { lazy } from 'react';
export default function componentLoader(fn, retriesLeft = 5, interval = 1000) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            const chunkFailedMessage = /Loading chunk [\d]+ failed/;
            if (error?.message && chunkFailedMessage.test(error.message)) {
              window.location.reload();
            }
            return;
          }

          // Passing on "reject" is the important part
          componentLoader(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}
