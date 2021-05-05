import { CubeFace } from '../cube-geometry/CubeFace';
import { CubeSpecification } from '../cube-geometry/CubeSpecification';
import { CubeMove } from './CubeMove';
import { CubeMoves } from './CubeMoves';

export class CubeMoveGrammarHelper {

	repetition_sequence(data: Array<any>): (spec: CubeSpecification) => ReadonlyArray<CubeMove> {
		return spec => {
			if(data[1] === null) {
				return [];
			}
			let moves = data[1][0](spec);
			data[1][1].forEach((item: any) => { moves = [...moves, ...item[1](spec)]; });
			return (moves as Array<CubeMove | null>).filter(m => m !== null).map(m => m!);
		};
	}

	repetition(data: Array<any>): (spec: CubeSpecification) => ReadonlyArray<CubeMove> {
		return spec => {
			const factor = (data[1] ?? 1) * (data[2] === null ? 1 : -1);
			const data0Result = data[0](spec);
			if(data0Result === null) {
				return [];
			} else if(data0Result instanceof CubeMove) {
				const move = data0Result;
				return [move.getAngleMultiple(spec, factor)];
			} else {
				const moves = (data0Result as Array<CubeMove | null>).filter(m => m !== null).map(m => m!);
				return CubeMoves.repeat(spec, moves, factor);
			}
		};
	}

	group(data: Array<any>): (spec: CubeSpecification) => ReadonlyArray<CubeMove> {
		return spec => {
			return data[1](spec);
		};
	}

	opconjugate(data: Array<any>): (spec: CubeSpecification) => ReadonlyArray<CubeMove> {
		return spec => {
			return CubeMoves.opconjugate(spec, data[1](spec), data[3](spec));
		};
	}

	opcommutator(data: Array<any>): (spec: CubeSpecification) => ReadonlyArray<CubeMove> {
		return spec => {
			return CubeMoves.opcommutator(spec, data[1](spec), data[3](spec));
		};
	}

	range(data: Array<any>): (spec: CubeSpecification) => CubeMove {
		return spec => {
			const face = this.parseFace(data[1]);
			const sliceStart = data[0]?.[0]?.[0] ?? 1;
			const sliceEnd = data[0]?.[1] ?? 2;
			return new CubeMove(spec, face, sliceStart, sliceEnd, 1);
		};
	}

	slice(data: Array<any>): (spec: CubeSpecification) => CubeMove {
		return spec => {
			const face = this.parseFace(data[1]);
			const sliceStart = data[0] ?? 1;
			const sliceEnd = sliceStart;
			return new CubeMove(spec, face, sliceStart, sliceEnd, 1);
		};
	}

	middle(data: Array<any>): (spec: CubeSpecification) => CubeMove | null {
		return spec => {
			if(spec.edgeLength % 2 === 0) {
				return null;
			}
			const face = this.parseFace(data[0]);
			const sliceStart = Math.floor((spec.edgeLength + 1) / 2);
			const sliceEnd = sliceStart;
			return new CubeMove(spec, face, sliceStart, sliceEnd, 1);
		};
	}

	inlay(data: Array<any>): (spec: CubeSpecification) => CubeMove | null {
		return spec => {
			if(spec.edgeLength < 3) {
				return null;
			}
			const face = this.parseFace(data[0]);
			const sliceStart = 2;
			const sliceEnd = spec.edgeLength - 1;
			return new CubeMove(spec, face, sliceStart, sliceEnd, 1);
		};
	}

	rotation(data: Array<any>): (spec: CubeSpecification) => CubeMove {
		return spec => {
			const face = this.parseFace(data[0]);
			const sliceStart = 1;
			const sliceEnd = spec.edgeLength;
			return new CubeMove(spec, face, sliceStart, sliceEnd, 1);
		};
	}

	positive_integer(data: Array<any>): number {
		let resultString = '';
		resultString += data[0];
		data[1].forEach((numberString: string) => resultString += numberString);
		return Number.parseInt(resultString);
	}

	non_negative_integer(data: Array<any>): number {
		return Number.parseInt(data[0]);
	}

	whitespace(data: Array<any>): string {
		return '<whitespace>';
	}

	private parseFace(faceString: string): CubeFace {
		switch (faceString.toLowerCase()) {
			case 'r':
			case 'x':
				return CubeFace.RIGHT;
			case 'u':
			case 'y':
				return CubeFace.UP;
			case 'f':
			case 'z':
			case 's':
				return CubeFace.FRONT;
			case 'l':
			case 'm':
				return CubeFace.LEFT;
			case 'b':
				return CubeFace.BACK;
			case 'd':
			case 'e':
				return CubeFace.DOWN;
			default:
				throw new Error(`Invalid grammar face string: ${faceString}`);
		}
	}

}