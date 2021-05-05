import { HeaderWidget } from "./HeaderWidget";
import { Level } from "@cube-codes/cube-codes-ide-common";
import { Cube, Event } from "@cube-codes/cube-codes-model";
import { CubeHistory } from "../cube-history/CubeHistory";
import { EditorWidget } from "./EditorWidget";
import { ProgramManager } from "../manager/ProgramManager";
import { HistoryWidget } from "./HistoryWidget";
import { AppState, AutomaticActionType } from "../app-state/AppState";
import { CubeWidget } from "./CubeWidget";
import { Toast } from "bootstrap";
import { html } from "./Html";
import { BootstrapInfo } from "./BootstrapInfo";
import $ from "jquery";
import "flex-splitter-directive";
import { UiState } from "./UiState";
import { UiStateChanged } from "./UiStateChanged";
import { CubeHistoryState } from "../cube-history/CubeHistoryState";
import { ProgramManagerState } from "../manager/ProgramManagerState";
import { UiSettings } from "./UiSettings";

export class Ui {

	readonly stateChanged = new Event<UiStateChanged>()

	private state: UiState

	readonly cube: Cube

	readonly cubeHistory: CubeHistory

	readonly programManager: ProgramManager

	#editorWidget?: EditorWidget

	constructor(readonly settings: UiSettings, readonly initialAppState: AppState, afterSetupActions: Array<(ui: Ui) => void>) {

		this.state = UiState.IDLE;
		
		// Cube Model
		this.cube = new Cube(this.initialAppState.cubeSpec, this.initialAppState.cubeSolutionCondition, this.initialAppState.cubeHistoryInitialState);
		
		// Services
		this.cubeHistory = new CubeHistory(this.cube);
		this.cubeHistory.stateChanged.on(e => this.setState(e.newState === CubeHistoryState.IDLE ? UiState.IDLE : UiState.EXECUTING));
		this.programManager = new ProgramManager(this);
		this.programManager.stateChanged.on(e => this.setState(e.newState === ProgramManagerState.IDLE ? UiState.IDLE : UiState.EXECUTING));

		this.cubeHistory.restoreChanges(this.initialAppState.cubeHistoryEntries, this.initialAppState.cubeHistoryCurrentPosition).then(async () => {

			// Widgets
			new HeaderWidget(this);
			new CubeWidget(this);
			this.#editorWidget = new EditorWidget(this);
			new HistoryWidget(this);

			await new Promise(r => setTimeout(r, 1000));
			$('#loader').empty();
			$('#loader').fadeOut(300);

			await new Promise(r => setTimeout(r, 400));
			afterSetupActions.forEach(a => a.call(null, this));
			
			await new Promise(r => setTimeout(r, 400));
			this.runAutomaticAction()

		});

	}

	getState(): UiState {
		return this.state;
	}

	get editorWidget(): EditorWidget {
		if(this.#editorWidget === undefined) throw new Error('Editor Widget not ready yet');
		return this.#editorWidget;
	}

	setState(newState: UiState): void {
		const oldState = this.state;
		this.state = newState;
		this.stateChanged.trigger({
			oldState: oldState,
			newState: newState
		});
	}

	runAutomaticAction() {
		const automaticActionsByType = new Map<AutomaticActionType, (ui: Ui) => void>([
			['none', u => {}],
			['editorRun', u => this.editorWidget.run()],
			['editorRunFast', u => this.editorWidget.runFast()],
			['historyStepAhead', u => this.cubeHistory.stepAhead()],
			['historyStepBack', u => this.cubeHistory.stepBack()],
			['historyPlayAhead', u => this.cubeHistory.playAhead()],
			['historyPlayBack', u => this.cubeHistory.playBack()]
		]);
		const automaticAction = automaticActionsByType.get(this.initialAppState.automaticActionType);
		if(automaticAction === undefined) throw new Error(`Invalid automatic action type: ${this.initialAppState.automaticActionType}`);
		automaticAction.call(this, this);
	}

	overlay(title: string, message: string = '', level: Level = Level.INFO, duration: number = 3000): void {
		
		const color = BootstrapInfo.COLOR_CLASSES_BY_LEVEL.get(level)!;
		const icon = BootstrapInfo.ICONS_BY_LEVEL.get(level)!(this);

		const toastElement = $(html`<div class="toast bg-${color} text-light" data-delay="${duration.toString()}"><div class="toast-header"><img src="${icon}" /><strong>${title}</strong><button type="button" class="ml-auto close" data-dismiss="toast" title="Close message">×</button></div><div class="toast-body">${message}</div></div>`).appendTo('#toast-zone');
		toastElement.on('hidden.bs.toast', () => {
			toastElement.remove();
		});

		const toast = new Toast(toastElement.get(0));
		toast.show();

	}

}