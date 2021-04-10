const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');

// ? Set enviroment (comment the line below to develop)
// process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		// frame: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			// 	preload: path.join(__dirname, 'preload.js'),
		},
	});

	mainWindow.loadFile('mainWindow.html');
}

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});

	// Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// Insert de menu
	Menu.setApplicationMenu(mainMenu);
});

// Handle createAddWindow
const createAddWindow = function () {
	addWindow = new BrowserWindow({
		width: 400,
		height: 250,
		title: 'Add Shopping List Item',
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	addWindow.loadFile('addWindow.html');

	// Quit app when closed
	mainWindow.on('closed', () => {
		app.quit();
	});
	// Garbage collection
	addWindow.on('close', () => {
		addWindow = null;
	});
};

// Catch item:add (catches whats coming from addWindow and sends it to mainWindow)
ipcMain.on('item:add', (e, item) => {
	mainWindow.webContents.send('item:add', item);
	addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Add Item',
				click() {
					createAddWindow();
				},
			},
			{
				label: 'Clear Items',
				async click() {
					let clearItemDialog = await dialog.showMessageBox(mainWindow, {
						message: 'Are you sure?',
						type: 'question',
						buttons: ['Yes, clear them.', "No, please don't"],
						defaultId: 1,
						title: 'Clear all items?',
					});
					if (clearItemDialog.response == 0) {
						mainWindow.webContents.send('item:clear');
					}
				},
			},
			{ type: 'separator' },
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click() {
					app.quit();
				},
			},
		],
	},
];

//  If mac, add empty object to menu
if (process.platform == 'darwin') mainMenuTemplate.unshift({});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

//  Add developer tools if not in production
if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developers Tools',
		submenu: [
			{
				label: 'Toggle Developer Tools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				},
			},
			{
				role: 'reload',
			},
		],
	});
}
