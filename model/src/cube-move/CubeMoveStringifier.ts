import { Parser } from "nearley";
import { CubeFace } from "../cube-geometry/CubeFace";
import { CubeSpecification } from "../cube-geometry/CubeSpecification";
import { Dimension } from "../linear-algebra/Dimension";
import { CubeMove } from "./CubeMove";
import { CubeMoveGrammarBuilder } from "./CubeMoveGrammarBuilder";

export class CubeMoveStringifier {

	constructor(private readonly spec: CubeSpecification) { }

	/**
	 * Parses a Cube Move string using the CubeMoveGrammar:<br />
	 * <iframe src="../grammar.docs.CubeMoveGrammar.html" style="border-width: 0; width: 142.86%; height: 1000px; margin-bottom: -300px; transform: scale(0.70); transform-origin: 0 0; "></iframe>
	 */
	parse(movesString: string): ReadonlyArray<CubeMove> {
		const parser = new Parser(CubeMoveGrammarBuilder.build());
		parser.feed(movesString);
		return parser.finish()[0](this.spec);
	}

	stringify(moves: ReadonlyArray<CubeMove>): string {
		return moves.map(move => {

			let angleOrientation;
			let moveString = '';

			if (this.spec.edgeLength % 2 === 1 && move.sliceStart === Math.ceil(this.spec.edgeLength / 2) && move.sliceEnd === move.sliceStart) { // middle
				angleOrientation = (move.face.positiveDirection ? 1 : -1) * (move.face.dimension.equals(Dimension.Z) ? 1 : -1);
				moveString += this.stringifyMiddleFace(move.face);
			} else if (move.sliceEnd === move.sliceStart) { // slice
				angleOrientation = 1;
				moveString += move.sliceStart !== 1 ? move.sliceStart.toString() : '';
				moveString += this.stringifySliceFace(move.face);
			} else if (move.sliceStart === 2 && move.sliceEnd === this.spec.edgeLength - 1) { // inlay
				angleOrientation = (move.face.positiveDirection ? 1 : -1) * (move.face.dimension.equals(Dimension.Z) ? 1 : -1);
				moveString += this.stringifyInlayFace(move.face);
			} else if (move.sliceStart === 1 && move.sliceEnd === this.spec.edgeLength) { // rotation
				angleOrientation = (move.face.positiveDirection ? 1 : -1);
				moveString += this.stringifyRotationFace(move.face);
			} else { // range
				angleOrientation = 1;
				moveString += move.sliceStart !== 1 ? move.sliceStart.toString() + '-' : '';
				moveString += move.sliceEnd !== move.sliceStart + 1 ? move.sliceEnd.toString() : '';
				moveString += this.stringifyRangeFace(move.face);
			}

			moveString += this.stringifyAngle(move.angle * angleOrientation);

			return moveString;

		}).join(' ');
	}

	private stringifyMiddleFace(face: CubeFace): string {
		switch (face.dimension) {
			case Dimension.X:
				return 'M';
			case Dimension.Y:
				return 'E';
			case Dimension.Z:
				return 'S';
			default:
				throw new Error(`Invalid dimension: ${face.dimension}`);
		}
	}

	private stringifySliceFace(face: CubeFace): string {
		switch (face) {
			case CubeFace.RIGHT:
				return 'R';
			case CubeFace.UP:
				return 'U';
			case CubeFace.FRONT:
				return 'F';
			case CubeFace.LEFT:
				return 'L';
			case CubeFace.DOWN:
				return 'D';
			case CubeFace.BACK:
				return 'B';
			default:
				throw new Error(`Invalid face: ${face}`);
		}
	}

	private stringifyInlayFace(face: CubeFace): string {
		switch (face.dimension) {
			case Dimension.X:
				return 'm';
			case Dimension.Y:
				return 'e';
			case Dimension.Z:
				return 's';
			default:
				throw new Error(`Invalid dimension: ${face.dimension}`);
		}
	}

	private stringifyRotationFace(face: CubeFace): string {
		switch (face.dimension) {
			case Dimension.X:
				return 'x';
			case Dimension.Y:
				return 'y';
			case Dimension.Z:
				return 'z';
			default:
				throw new Error(`Invalid dimension: ${face.dimension}`);
		}
	}

	private stringifyRangeFace(face: CubeFace): string {
		switch (face) {
			case CubeFace.RIGHT:
				return 'r';
			case CubeFace.UP:
				return 'u';
			case CubeFace.FRONT:
				return 'f';
			case CubeFace.LEFT:
				return 'l';
			case CubeFace.DOWN:
				return 'd';
			case CubeFace.BACK:
				return 'b';
			default:
				throw new Error(`Invalid face: ${face}`);
		}
	}

	private stringifyAngle(angle: number): string {
		const absoluteAngle = Math.abs(angle).toString();
		return (absoluteAngle !== '1' ? absoluteAngle : '') + (angle < 0 ? '\'' : '');
	}

}