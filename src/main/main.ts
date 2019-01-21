import { app, BrowserWindow, Tray, Menu } from 'electron'
// import * as notify from 'node-notifier'

import * as path from 'path'
import * as child_process from 'child_process'

const windowStateKeeper = require('electron-window-state')
const isDev = process.env.ELECTRON_MODE == 'dev'

let mainWindow: Electron.BrowserWindow
let template: any[] = []
let menu: any
let tray: Tray | null = null
// let notifier = notify

function createWindow() {
	// Load the previous state with fallback to defaults
	let mainWindowState = windowStateKeeper({
		defaultWidth: 300,
		defaultHeight: 300,
	})

	// Create the browser window using state information
	mainWindow = new BrowserWindow({
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		resizable: true,
		movable: true,
		minimizable: true,
		maximizable: true,
		closable: true,
		focusable: true,
		title: 'TestApplication',
		backgroundColor: '#333333',
		minWidth: 480,
		minHeight: 360,
		show: false,
	})

	// Let us register listeners on the window, so we can update the state
	// automatically (the listeners will be removed when the window is closed)
	// and restore the maximized or full screen state
	mainWindowState.manage(mainWindow)

	const url = isDev ? `http://localhost:3000` : `file://${__dirname}/index.html`

	if (isDev) {
		// setTimeout(() => {
		// 	mainWindow.webContents.openDevTools()
		// }, 1200)

		// @ts-ignore: ignore unused 'e'
		mainWindow.webContents.on('context-menu', (e, props) => {
			const { x, y } = props
			Menu.buildFromTemplate([
				{
					label: 'Inspect element',
					click() {
						mainWindow.webContents.inspectElement(x, y)
					},
				},
			]).popup({ window: mainWindow })
		})
	}

	mainWindow.loadURL(url)

	// Emitted when the window is closed.
	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.

		// TS "strictNullChecks" complains but Electron documentation insists
		// @ts-ignore: TS2322: Type 'null' is not assignable to type 'BrowserWindow'.
		mainWindow = null
		console.log('windows closed')
	})

	mainWindow.on('ready-to-show', () => {
		mainWindow.show()
		mainWindow.focus()
	})
} // createWindow on ready message

app.setAppUserModelId(process.execPath)

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On OS X it"s common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// https://github.com/fyears/electron-python-example python call reference
let pyProc: child_process.ChildProcess | null = null
let pyPort: number | null = null
const selectPort = () => {
	pyPort = 4242
	return pyPort
}

const createPyProc = () => {
	console.log('createPyProc')
	let port = '' + selectPort()
	let script = path.join(__dirname, 'py', 'api.py')
	pyProc = child_process.spawn('python', [script, port])
	if (pyProc != null) {
		console.log('child process success')
	}
}

const exitPyProc = () => {
	if (pyProc != null) {
		pyProc.kill()
	}
	pyProc = null
	pyPort = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)

app.on('ready', () => {
	console.log('---------------Create Tray Menu')
	// Menu
	template = [
		{
			label: 'Help',
			submenu: [
				{
					label: 'Notify',
					click() {
						// eNotify.setConfig({ displayTime: 6000 })
						// notifier.notify({ title: 'fdsafdsafds', text: 'fdsafsdafsda' })
						console.log('Notify - ')
					},
				},
				{
					label: 'OpenLogger',
					click() {
						console.log('OpenLogger')
					},
				},
				{
					label: 'OpenDebugger',
					click() {
						mainWindow.webContents.openDevTools()
					},
				},
				{
					label: '&Exit',
					click() {},
				},
			],
		},
	]
	menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)

	// build try Icon
	const tryTemplate = [
		{
			label: 'Empty Application',
			checked: true,
			enabled: false,
		},
		{
			label: 'Settings',
			click: function() {
				funcSetting()
			},
		},
		{
			label: 'Log',
			click: function() {
				console.log('Cliked on Log')
			},
		},
		{
			label: 'Exit',
			click() {
				console.log('exit')
			},
		},
	]
	let trayMenu = Menu.buildFromTemplate(tryTemplate)
	tray = new Tray(path.join(__dirname, 'icon/images.png'))
	tray.setToolTip('This is my application')

	// set message on tray
	tray.on('click', () => {
		mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
	})

	// trayMenu.on('menu-will-close', (event) => {
	// 	console.log('menu-will-close event')
	// })
	tray.setContextMenu(trayMenu)

	let idx: number = 0
	function funcSetting() {
		console.log('funcSetting Called')
		if (tray != null) {
			console.log(idx)
			trayMenu.items[1].label = 'Settings' + idx
			tray.setContextMenu(trayMenu)
			idx = idx + 1
		}
	}
})
