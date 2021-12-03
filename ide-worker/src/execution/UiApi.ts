import { Level, MessageIdGenerator, UiSyncType } from "@cube-codes/cube-codes-ide-common";
import { ProgramWorkerMessageBus } from "../worker/ProgramWorkerMessageBus";

export class UiApi {

	constructor(private readonly messageBus: ProgramWorkerMessageBus) {}

	async log(message: string, level: Level = Level.INFO, withDate: boolean = false): Promise<void> {
		await this.messageBus.sendMessage({
			type: UiSyncType,
			id: MessageIdGenerator.generate(),
			log: {
				message: String(message),
				level: Number(level),
				withDate: Boolean(withDate)
			}
		});
	}

	async logInfo(message: string, withDate: boolean = false): Promise<void> {
		await this.log(message, Level.INFO, withDate);
	}

	async logSuccess(message: string, withDate: boolean = false): Promise<void> {
		await this.log(message, Level.SUCCESS, withDate);
	}

	async logWarning(message: string, withDate: boolean = false): Promise<void> {
		await this.log(message, Level.WARNING, withDate);
	}

	async logError(message: string, withDate: boolean = false): Promise<void> {
		await this.log(message, Level.ERROR, withDate);
	}

	async overlay(title: string, message: string = '', level: Level = Level.INFO, duration: number = 3000): Promise<void> {
		await this.messageBus.sendMessage({
			type: UiSyncType,
			id: MessageIdGenerator.generate(),
			overlay: {
				title: String(title),
				message: String(message),
				level: Number(level),
				duration: Number(duration)
			}
		});
	}

	async overlayInfo(title: string, message: string = '', duration: number = 3000): Promise<void> {
		await this.overlay(title, message, Level.INFO, duration);
	}

	async overlaySuccess(title: string, message: string = '', duration: number = 3000): Promise<void> {
		await this.overlay(title, message, Level.SUCCESS, duration);
	}

	async overlayWarning(title: string, message: string = '', duration: number = 3000): Promise<void> {
		await this.overlay(title, message, Level.WARNING, duration);
	}

	async overlayError(title: string, message: string = '', duration: number = 3000): Promise<void> {
		await this.overlay(title, message, Level.ERROR, duration);
	}

	async prompt(title: string, message: string = '', prefilled: string = '', level: Level = Level.INFO): Promise<string | null> {
		return await this.messageBus.sendMessage({
			type: UiSyncType,
			id: MessageIdGenerator.generate(),
			prompt: {
				title: String(title),
				message: String(message),
				prefilled: String(prefilled),
				level: Number(level)
			}
		});
	}

}