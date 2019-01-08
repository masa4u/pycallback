import { app, BrowserWindow, shell, Menu } from 'electron'

const isDev = process.env.ELECTRON_MODE == 'dev'

let mainWindow: Electron.BrowserWindow
let template: any[] = []
let menu: any

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		resizable: true,
		title: 'Electron',
		backgroundColor: '#ffffff',
		minWidth: 480,
		minHeight: 360,
	})

	const url = isDev ? `http://localhost:3000` : `file://${__dirname}/index.html`

	if (isDev) {
		mainWindow.webContents.openDevTools()

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
	})

	// Menu
	if (process.platform === 'darwin') {
		template = [
			{
				label: 'Electron',
				submenu: [
					{
						label: 'About',
						selector: 'orderFrontStandardAboutPanel:',
					},
					{
						type: 'separator',
					},
					{
						label: 'Services',
						submenu: [],
					},
					{
						type: 'separator',
					},
					{
						label: 'Hide',
						accelerator: 'Command+H',
						selector: 'hide:',
					},
					{
						label: 'Hide Others',
						accelerator: 'Command+Shift+H',
						selector: 'hideOtherApplications:',
					},
					{
						label: 'Show All',
						selector: 'unhideAllApplications:',
					},
					{
						type: 'separator',
					},
					{
						label: 'Quit',
						accelerator: 'Command+Q',
						click() {
							app.quit()
						},
					},
				],
			},
			{
				label: 'Edit',
				submenu: [
					{
						label: 'Undo',
						accelerator: 'Command+Z',
						selector: 'undo:',
					},
					{
						label: 'Redo',
						accelerator: 'Shift+Command+Z',
						selector: 'redo:',
					},
					{
						type: 'separator',
					},
					{
						label: 'Cut',
						accelerator: 'Command+X',
						selector: 'cut:',
					},
					{
						label: 'Copy',
						accelerator: 'Command+C',
						selector: 'copy:',
					},
					{
						label: 'Paste',
						accelerator: 'Command+V',
						selector: 'paste:',
					},
					{
						label: 'Select All',
						accelerator: 'Command+A',
						selector: 'selectAll:',
					},
				],
			},
			{
				label: 'View',
				submenu: isDev
					? [
							{
								label: 'Reload',
								accelerator: 'Command+R',
								click() {
									mainWindow.webContents.reload()
								},
							},
							{
								label: 'Toggle Full Screen',
								accelerator: 'Ctrl+Command+F',
								click() {
									mainWindow.setFullScreen(!mainWindow.isFullScreen())
								},
							},
							{
								label: 'Toggle Developer Tools',
								accelerator: 'Alt+Command+I',
								click() {
									mainWindow.webContents.toggleDevTools()
								},
							},
					  ]
					: [
							{
								label: 'Toggle Full Screen',
								accelerator: 'Ctrl+Command+F',
								click() {
									mainWindow.setFullScreen(!mainWindow.isFullScreen())
								},
							},
					  ],
			},
			{
				label: 'Window',
				submenu: [
					{
						label: 'Minimize',
						accelerator: 'Command+M',
						selector: 'performMiniaturize:',
					},
					{
						label: 'Close',
						accelerator: 'Command+W',
						selector: 'performClose:',
					},
					{
						type: 'separator',
					},
					{
						label: 'Bring All to Front',
						selector: 'arrangeInFront:',
					},
				],
			},
			{
				label: 'Help',
				submenu: [
					{
						label: 'Learn More',
						click() {
							shell.openExternal('http://electron.atom.io')
						},
					},
					{
						label: 'Documentation',
						click() {
							shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme')
						},
					},
					{
						label: 'Community Discussions',
						click() {
							shell.openExternal('https://discuss.atom.io/c/electron')
						},
					},
					{
						label: 'Search Issues',
						click() {
							shell.openExternal('https://github.com/atom/electron/issues')
						},
					},
				],
			},
		]

		menu = Menu.buildFromTemplate(template)
		Menu.setApplicationMenu(menu)
	} else {
		template = [
			{
				label: '&File',
				submenu: [
					{
						label: '&Open',
						accelerator: 'Ctrl+O',
					},
					{
						label: '&Close',
						accelerator: 'Ctrl+W',
						click() {
							mainWindow.close()
						},
					},
				],
			},
			{
				label: '&View',
				submenu:
					process.env.NODE_ENV === 'development'
						? [
								{
									label: '&Reload',
									accelerator: 'Ctrl+R',
									click() {
										mainWindow.webContents.reload()
									},
								},
								{
									label: 'Toggle &Full Screen',
									accelerator: 'F11',
									click() {
										mainWindow.setFullScreen(!mainWindow.isFullScreen())
									},
								},
								{
									label: 'Toggle &Developer Tools',
									accelerator: 'Alt+Ctrl+I',
									click() {
										mainWindow.webContents.toggleDevTools()
									},
								},
						  ]
						: [
								{
									label: 'Toggle &Full Screen',
									accelerator: 'F11',
									click() {
										mainWindow.setFullScreen(!mainWindow.isFullScreen())
									},
								},
						  ],
			},
			{
				label: 'Help',
				submenu: [
					{
						label: 'Learn More',
						click() {
							shell.openExternal('http://electron.atom.io')
						},
					},
					{
						label: 'Documentation',
						click() {
							shell.openExternal('https://github.com/atom/electron/tree/master/docs#readme')
						},
					},
					{
						label: 'Community Discussions',
						click() {
							shell.openExternal('https://discuss.atom.io/c/electron')
						},
					},
					{
						label: 'Search Issues',
						click() {
							shell.openExternal('https://github.com/atom/electron/issues')
						},
					},
				],
			},
		]
		menu = Menu.buildFromTemplate(template)
	}
}

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
