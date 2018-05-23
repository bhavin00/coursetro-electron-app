const { remote, ipcRenderer } = require('electron');
const path = require('path');
const { BrowserWindow } = remote;

const axios = require('axios');

const notifyBtn = document.getElementById('notifyBtn')

let win;
let price = document.querySelector('h1')
let targetPrice = document.getElementById('targetPrice')
let targetPriceVal;

function getBTC() {
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
        .then(res => {
            const cryptos = res.data.BTC.USD;
            price.innerHTML = '$' + cryptos.toLocaleString('en');
            // console.log(targetPrice.innerHTML);
            if (targetPrice.innerHTML != '' && typeof targetPriceVal !== "undefined" && targetPriceVal < res.data.BTC.USD) {
                const myNotification = new window.Notification(notification.title, notification);
                myNotification.onclick = () => {
                    // console.log('clicked');
                }
                targetPrice.innerHTML = 'Choose a Target Price';
                targetPriceVal = undefined;
            }
        })

}

const notification = {
    title: 'BTC Alert',
    body: 'BTC just beat your target price!',
    icon: path.join(__dirname, '../assets/images/btc.png')
}

getBTC();
setInterval(getBTC, 3000);

notifyBtn.addEventListener('click', function (event) {
    const modalPath = path.join('file://', __dirname, 'add.html')

    if (!win) {
        win = new BrowserWindow({
            frame: false,
            transparent: true,
            alwaysOnTop: true,    // Add this line
            width: 400,
            height: 200,
            minWidth: 400,
            minHeight: 200
        });
        win.on('close', function () { win = null; })
        win.loadURL(modalPath);
        win.show();
    }

});

ipcRenderer.on('targetPriceVal', function (event, arg) {
    targetPriceVal = Number(arg);
    targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en')
})
