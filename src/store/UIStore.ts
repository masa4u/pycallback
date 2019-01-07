import { observable, action, computed } from 'mobx'

export class UI {
	private messagePart1: string = 'Hello'
	private messagePart2: string = 'world!'

	@observable
	public isMessageShown: boolean = true

	@action
	public toggleMessage = (): void => {
		this.isMessageShown = !this.isMessageShown
	}

	@computed
	public get getMessage(): string {
		return this.messagePart1 + ' ' + this.messagePart2
	}
}

const UIStore = new UI()

export default UIStore
