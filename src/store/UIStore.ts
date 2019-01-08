import { observable, action, computed } from 'mobx'

export class UI {
	private _message1: string = 'Hello'
	private _message2: string = 'world!'

	@observable
	public isMessageShown: boolean = true

	@action
	public toggleMessage = (): void => {
		this.isMessageShown = !this.isMessageShown
	}

	@computed
	public get getMessage(): string {
		return this._message1 + ' ' + this._message2
	}
}

// @ts-ignore: TS7009: 'new' expression, whose target lacks a construct signature, implicitly has an 'any' type.
const UIStore: UI = new UI()

export default UIStore
