import { Equalizable } from "../interface/Equalizable";
import { Exportable } from "../interface/Exportable";
import { Identifiable } from "../interface/Identifiable";
import { Printable } from "../interface/Printable";
import { Matrix } from "../linear-algebra/Matrix";
import { Vector } from "../linear-algebra/Vector";

export class CubeletStateExport {

	constructor(readonly initialLocation: ReadonlyArray<number>,
		readonly location: ReadonlyArray<number>,
		readonly orientation: ReadonlyArray<ReadonlyArray<number>>) { }

}

export class CubeletState implements Exportable<CubeletStateExport>, Identifiable, Equalizable<CubeletState>, Printable {

	constructor(readonly initialLocation: Vector,
		readonly location: Vector,
		readonly orientation: Matrix) {
		//TODO: Lots of validation
	}

	static import(value: CubeletStateExport): CubeletState {
		return new CubeletState(Vector.import(value.initialLocation), Vector.import(value.location), Matrix.import(value.orientation));
	}

	export(): CubeletStateExport {
		return new CubeletStateExport(this.initialLocation.export(), this.location.export(), this.orientation.export());
	}

	id(): string {
		return JSON.stringify(this.export());
	}

	equals(other: CubeletState): boolean {
		return this.initialLocation.equals(other.initialLocation) && this.location.equals(other.location) && this.orientation.equals(other.orientation);
	}

	toString(): string {
		//TODO: ???
		return '';
	}

}