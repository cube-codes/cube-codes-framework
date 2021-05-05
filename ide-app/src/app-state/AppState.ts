import { CubeMove, CubeMoveStringifier, CubeSolutionCondition, CubeSpecification, CubeState, CubeStateStringifier, Exportable } from "@cube-codes/cube-codes-model"

export class CubeSpecificationExport {

	constructor(readonly edgeLength: number) { }

}

export class CubeSolutionConditionExport {

	constructor(readonly type: number) { }

}

export class CubeHistoryExport {

	constructor(readonly initialState: string, readonly entries: ReadonlyArray<string>, readonly currentPosition: number) { }

}

export class EditorExport {

	constructor(readonly code: string) { }

}

export class AutomaticActionExport {

	constructor(readonly type: AutomaticActionType) { }

}

export class AppStateExport {

	constructor(readonly title: string,
		readonly description: string,
		readonly cubeSpec: CubeSpecificationExport,
		readonly cubeSolutionCondition: CubeSolutionConditionExport,
		readonly cubeHistory: CubeHistoryExport,
		readonly editor: EditorExport,
		readonly automaticAction: AutomaticActionExport) { }

}

export type AutomaticActionType = 'none' | 'editorRun' | 'editorRunFast' | 'historyStepAhead' | 'historyStepBack' | 'historyPlayAhead' | 'historyPlayBack'

export class AppState implements Exportable<AppStateExport> {

	constructor(readonly title: string,
		readonly description: string,
		readonly cubeSpec: CubeSpecification,
		readonly cubeSolutionCondition: CubeSolutionCondition,
		readonly cubeHistoryInitialState: CubeState,
		readonly cubeHistoryEntries: ReadonlyArray<CubeState | CubeMove>,
		readonly cubeHistoryCurrentPosition: number,
		readonly editorCode: string,
		readonly automaticActionType: AutomaticActionType
	) { }

	static import(value: AppStateExport): AppState {
		const cubeSpec = new CubeSpecification(value.cubeSpec.edgeLength);
		const cubeSolutionCondition = new CubeSolutionCondition(value.cubeSolutionCondition.type);
		const cubeStateStringifier = new CubeStateStringifier(cubeSpec);
		const cubeMoveStringifier = new CubeMoveStringifier(cubeSpec);
		return new AppState(value.title, value.description, cubeSpec, cubeSolutionCondition, cubeStateStringifier.parse(value.cubeHistory.initialState), value.cubeHistory.entries.map(e => e.substr(0, 3) === '===' ? cubeStateStringifier.parse(e.substr(3)) : cubeMoveStringifier.parse(e)[0]), value.cubeHistory.currentPosition, value.editor.code, value.automaticAction.type);
	}

	export(): AppStateExport {
		const cubeStateStringifier = new CubeStateStringifier(this.cubeSpec);
		const cubeMoveStringifier = new CubeMoveStringifier(this.cubeSpec);
		return new AppStateExport(
			this.title,
			this.description,
			new CubeSpecificationExport(this.cubeSpec.edgeLength),
			new CubeSolutionConditionExport(this.cubeSolutionCondition.type),
			new CubeHistoryExport(cubeStateStringifier.stringify(this.cubeHistoryInitialState), this.cubeHistoryEntries.map(e => e instanceof CubeState ? '===' + cubeStateStringifier.stringify(e) : cubeMoveStringifier.stringify([e])), this.cubeHistoryCurrentPosition),
			new EditorExport(this.editorCode),
			new AutomaticActionExport(this.automaticActionType));
	}

}