import * as React from 'react'

import './../css/styles.scss'
import MainView from './MainView'

import { observer } from 'mobx-react'

export class App extends React.Component<any, any> {
	public render() {
		return (
			<div className="app">
				<MainView />
			</div>
		)
	}
}

export default observer(App)
