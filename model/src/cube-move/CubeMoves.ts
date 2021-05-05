import { CubeSpecification } from "../cube-geometry/CubeSpecification";
import { CubeMove } from "./CubeMove";

export class CubeMoves {

	static repeat(spec: CubeSpecification, moves: ReadonlyArray<CubeMove>, factor: number): ReadonlyArray<CubeMove> {
		if (!Number.isInteger(factor)) throw 'Invalid factor';
		let result: Array<CubeMove> = [];
		for(let index = 0; index < Math.abs(factor); index++) {
			result = [...result, ...moves];
		}
		if(factor < 0) {
			result = result.map(m => m.getInverse(spec)).reverse();
		}
		return result;
	}

	static invert(spec: CubeSpecification, moves: ReadonlyArray<CubeMove>): ReadonlyArray<CubeMove> {
		return CubeMoves.repeat(spec, moves, -1);
	}

	static opconjugate(spec: CubeSpecification, moves1: ReadonlyArray<CubeMove>, moves2: ReadonlyArray<CubeMove>): ReadonlyArray<CubeMove> {
		return [...moves1, ...moves2, ...CubeMoves.invert(spec, moves1)];
	}

	static opcommutator(spec: CubeSpecification, moves1: ReadonlyArray<CubeMove>, moves2: ReadonlyArray<CubeMove>): ReadonlyArray<CubeMove> {
		return [...moves1, ...moves2, ...CubeMoves.invert(spec, moves1), ...CubeMoves.invert(spec, moves2)];
	}

}