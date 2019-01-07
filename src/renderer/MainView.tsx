import * as React from 'react'
import { observer } from 'mobx-react'
import UIStore from './../store/UIStore'

export class MainView extends React.Component<any, any> {
	private handleButtonClick = () => {
		UIStore.toggleMessage()
	}

	render(): JSX.Element {
		return (
			<div>
				<h2>Welcome to Electron, Typescript, React and Mobx</h2>

				<button type="button" onClick={() => this.handleButtonClick()}>
					Toggle message
				</button>

				{UIStore.isMessageShown && <h4>{UIStore.getMessage}</h4>}
			</div>
		)
	}
}

export default observer(MainView)
