const { remote, ipcRenderer } = require('electron');

const closeBtn = document.getElementById('closeBtn')

closeBtn.addEventListener('click', function (event) {
    let window = remote.getCurrentWindow();
    window.close();
})

const updateBtn = document.getElementById('updateBtn')

updateBtn.addEventListener('click', function () {
    ipcRenderer.send('update-notify-value', document.getElementById('notifyVal').value);

    // Close this window
    var window = remote.getCurrentWindow();
    window.close();
})