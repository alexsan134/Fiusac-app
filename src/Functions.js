export default function showNotification(msg) {
    navigator.serviceWorker.ready.then(function (registration) {
        registration.periodicSync.register({
            tag: 'show-notification',         // default: ''
            minPeriod: 12 * 60 * 60 * 1000,
            minInterval: 24 * 60 * 60 * 1000, // default: 0
            powerState: 'avoid-draining',   // default: 'auto'
            networkState: 'avoid-cellular'  // default: 'online'
        }).then(function (periodicSyncReg) {
            Notification.requestPermission(function (result) {
                if (result === 'granted') {
                    periodicSyncReg.showNotification('Proximo curso', {
                        body: msg,
                        vibrate: [200, 100, 200, 100, 200, 100, 200],
                        tag: 'event',
                        icon: './img/icon.png'
                    });
                }
            });
        }, function (err) {
            console.log(err);
        })
    });
}
