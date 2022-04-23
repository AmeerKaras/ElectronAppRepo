const electron = require('electron');
const url = require('url');
const path = require('path');
const search = document.getElementById('search');
const matchList = document.getElementById('match-list');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

// Listen for app to be ready
app.on('ready', function(){
    // Create new window
    mainWindow = new BrowserWindow({});

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    })); 

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu

    Menu.setApplicationMenu(mainMenu);

});



const searchStates = async searchText => {
    const res = await fetch('../data/bInfo.json');
    const states = await res.json();
    console.log(states);

    // Get matches to current text input
    let matches = states.filter(state => {
        const regex = new RegExp(`^${searchText}\+`, 'gi');
        return state.name.match(regex);
    });

    // If the search bar is empty, return an empty array
    if(searchText.length === 0){
        matches = [];
        matchList.innerHTML = '';
    }
    outputHtml(matches);

};

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [{        
            label: 'Quit',
            //hotkey to quit
            //'?' is an if-else operator. If darwin, then command+Q
            //else, use ctrl+Q
            accelerator: process.platform =='darwin' ? 'Command+Q' : 'Ctrl+Q',
            click(){
                app.quit();
            }
        }

    ]
    }
];

// If mac, add empty object to menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
    // 'unshift' is an array method that adds on to an empty array
}

// Add developer tools item if not in production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform =='darwin' ? 'Command+I' : 'Ctrl+I',
                // Want DevTools to show up on specifically focused window
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();

                }
            },
            {
                role: 'reload'
            }
        ]
    });
}