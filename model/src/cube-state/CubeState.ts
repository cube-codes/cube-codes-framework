import { CubePart } from "../cube-geometry/CubePart";
import { CubePartType } from "../cube-geometry/CubePartType";
import { CubeSpecification } from "../cube-geometry/CubeSpecification";
import { CubeletLocation } from "../cube/CubeletLocation";
import { Equalizable } from "../interface/Equalizable";
import { Exportable } from "../interface/Exportable";
import { Identifiable } from "../interface/Identifiable";
import { Printable } from "../interface/Printable";
import { Matrix } from "../linear-algebra/Matrix";
import { Arrays } from "../utilities/Arrays";
import { CubeletState, CubeletStateExport } from "./CubeletState";

export class CubeStateExport {

	constructor(readonly cubelets: ReadonlyArray<CubeletStateExport>) { }

}

export class CubeState implements Exportable<CubeStateExport>, Identifiable, Equalizable<CubeState>, Printable {

	constructor(spec: CubeSpecification,
		readonly cubelets: ReadonlyArray<CubeletState>) {
		//TODO: lots of validation
	}

	static fromSolved(spec: CubeSpecification): CubeState {
		const cubelets = Array<CubeletState>();
		for (const cubePartType of CubePartType.getAll()) {
			for (const cubePart of CubePart.getByType(cubePartType)) {
				for (const cubeletLocation of CubeletLocation.fromPart(spec, cubePart)) {
					cubelets.push(new CubeletState(cubeletLocation.origin, cubeletLocation.origin, Matrix.IDENTITY));
				}
			}
		}
		return new CubeState(spec, cubelets);
	}

	static import(spec: CubeSpecification, value: CubeStateExport): CubeState {
		return new CubeState(spec, value.cubelets.map(c => CubeletState.import(c)));
	}

	export(): CubeStateExport {
		return new CubeStateExport(this.cubelets.map(c => c.export()));
	}

	id(): string {
		return JSON.stringify(this.export());
	}

	equals(other: CubeState): boolean {
		return Arrays.equals(this.cubelets, other.cubelets);
	}

	toString(): string {
		//TODO: ???
		return '';
	}

}