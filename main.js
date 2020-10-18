const electron = require('electron');
const url = require('url');

const path = require('path');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

//Listen for app ready

app.on('ready', function(){
    mainWindow = new BrowserWindow({
        
    });

    //load html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //Build a little menu
    const mainMenu = Menu.buildFromTemplate(MainMenuTemplate);
    

    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function(){
        mainWindow = null;
    });

    Menu.setApplicationMenu(mainMenu);


});


const MainMenuTemplate = [
    {
        label: 'Settings'
    }
];