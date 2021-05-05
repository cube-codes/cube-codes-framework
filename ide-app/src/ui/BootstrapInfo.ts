import { Level } from "@cube-codes/cube-codes-ide-common";
import { Ui } from "./Ui";

export class BootstrapInfo {
	
	static readonly COLOR_CLASSES_BY_LEVEL: ReadonlyMap<Level, string> = new Map([
		[Level.INFO, 'info'],
		[Level.SUCCESS, 'success'],
		[Level.WARNING, 'warning'],
		[Level.ERROR, 'danger']
	]);

	static readonly ICONS_BY_LEVEL: ReadonlyMap<Level, (ui: Ui) => string> = new Map([
		[Level.INFO, ui => `${ui.settings.appDirectory}/images/bootstrap-icons/info-circle-fill.svg`],
		[Level.SUCCESS, ui => `${ui.settings.appDirectory}/images/bootstrap-icons/check-circle-fill.svg`],
		[Level.WARNING, ui => `${ui.settings.appDirectory}/images/bootstrap-icons/exclamation-circle-fill.svg`],
		[Level.ERROR, ui => `${ui.settings.appDirectory}/images/bootstrap-icons/x-circle-fill.svg`]
	]);

}