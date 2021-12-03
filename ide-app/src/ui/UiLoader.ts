import { Ui } from "./Ui";
import $ from "jquery";
import { CubeSolutionCondition, CubeSpecification, CubeState } from "@cube-codes/cube-codes-model";
import { Level } from "@cube-codes/cube-codes-ide-common";
import { AppState } from "../app-state/AppState";
import { UiSettings } from "./UiSettings";
import { UiViewMode } from "./UiViewMode";

export class UiLoader {

	#ui?: Ui

	constructor(readonly settings: UiSettings) {

		window.addEventListener('beforeunload', e => e.returnValue = 'Are you sure you want to leave?');

		$(async doc => {

			const afterSetupActions = new Array<(ui: Ui) => void>();
			const initialAppState = await this.constructInitialAppState(afterSetupActions);
			const viewMode = await this.constructViewMode(afterSetupActions);

			this.#ui = new Ui(settings, initialAppState, viewMode, afterSetupActions);

		});

	}
	
	async constructInitialAppState(afterSetupActions: Array<(ui: Ui) => void>): Promise<AppState> {

		const parameters = new URLSearchParams(location.search);

		if (parameters.get('init') === 'new' || parameters.get('init') === null) {
			return this.constructDefaultAppState(parameters);
		} else if (parameters.get('init') === 'loadFromStorage') {
			const appStateValue = localStorage.getItem('header-load-file');
			if (appStateValue === null) {
				afterSetupActions.push(ui => ui.overlay('No scenario found', 'You tried to load a scenario from the local storage, but there was nothing saved into it!', Level.ERROR, 10000));
				return this.constructDefaultAppState(parameters);
			} else {
				const appState = AppState.import(JSON.parse(appStateValue));
				afterSetupActions.push(ui => ui.overlay(`Loaded scenario: ${appState.title}`, undefined, Level.INFO, 10000));
				return appState;
			}
		} else if (parameters.get('init') === 'loadFromUrl') {
			const url = parameters.get('url');
			if (url === null) {
				afterSetupActions.push(ui => ui.overlay('No url found', 'You tried to load a scenario from an url, but you did not supply an url!', Level.ERROR, 10000));
				return this.constructDefaultAppState(parameters);
			} else {
				const appState = AppState.import(await $.getJSON(url));
				afterSetupActions.push(ui => ui.overlay(`Loaded scenario: ${appState.title}`, undefined, Level.INFO, 10000));
				return appState;
			}
		} else {
			afterSetupActions.push(ui => ui.overlay(`Unknown init parameter: ${parameters.get('init')}`, undefined, Level.ERROR, 10000));
			return this.constructDefaultAppState(parameters);
		}

	}

	constructDefaultAppState(parameters: URLSearchParams): AppState {
		const cubeSpec = new CubeSpecification(Number.parseInt(parameters.get('cubeSpec') ?? '3'));
		const cubeSolutionCondition = new CubeSolutionCondition(Number.parseInt(parameters.get('cubeSolutionCondition') ?? '1'));
		return new AppState('', '', cubeSpec, cubeSolutionCondition, CubeState.fromSolved(cubeSpec), [], -1, '', 'none');
	}
	
	async constructViewMode(afterSetupActions: Array<(ui: Ui) => void>): Promise<UiViewMode> {

		const parameters = new URLSearchParams(location.search);

		if (parameters.get('view') === null) {
			return UiViewMode.NORMAL;
		}
		
		let viewMode;
		try {
			viewMode = UiViewMode.getByName(parameters.get('view')!);
		} catch(e) {
			afterSetupActions.push(ui => ui.overlay(`Unknown view parameter: ${parameters.get('view')}`, undefined, Level.ERROR, 10000));
			return UiViewMode.NORMAL;
		}

		return viewMode;

	}

	get ui(): Ui {
		if (this.#ui === undefined) throw new Error('Ui not ready yet');
		return this.#ui;
	}

}