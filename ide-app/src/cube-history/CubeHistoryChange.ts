import { CubeState, CubeMove, Exportable, CubeStateExport, CubeMoveExport, CubeSpecification } from "@cube-codes/cube-codes-model";

export class CubeHistoryChangeExport {

	constructor(readonly oldState: CubeStateExport,
		readonly newState: CubeStateExport,
		readonly move?: CubeMoveExport) { }

}

/**
 * Change of a {@link Cube}'s {@link CubeState} possibly through a {@link CubeMove} that is recorded by the {@link CubeHistory}
 */
export class CubeHistoryChange implements Exportable<CubeHistoryChangeExport> {

	constructor(readonly oldState: CubeState, readonly newState: CubeState, readonly move?: CubeMove) {}

	static import(spec: CubeSpecification, value: CubeHistoryChangeExport): CubeHistoryChange {
		return new CubeHistoryChange(CubeState.import(spec, value.oldState), CubeState.import(spec, value.newState), value.move === undefined ? undefined : CubeMove.import(spec, value.move));
	}

	export(): CubeHistoryChangeExport {
		return new CubeHistoryChangeExport(this.oldState.export(), this.newState.export(), this.move?.export());
	}
	
}