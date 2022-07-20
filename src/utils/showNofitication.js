export function showNotification(message, callback) {
  if (!('Notification' in window)) {
    alert('This browser does not support desktop notification');
    return;
  } else if (Notification.permission === 'granted') {
    if (document.hidden) {
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
}
