import { MessageData } from "../message/MessageData";
import { Level } from "../Level";

export const UiSyncType: 'UiSync' = 'UiSync'
export interface UiSync extends MessageData<typeof UiSyncType> {
	readonly log?: LogSync
	readonly overlay?: OverlaySync
	readonly prompt?: PromptSync
}

export interface LogSync {
	readonly message: string
	readonly level: Level
	readonly withDate: boolean
}

export interface OverlaySync {
	readonly title: string
	readonly message: string
	readonly level: Level
	readonly duration: number
}

export interface PromptSync {
	readonly title: string
	readonly message: string
	readonly prefilled: string
	readonly level: Level
}