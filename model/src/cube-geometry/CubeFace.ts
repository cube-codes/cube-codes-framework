import { Vector } from "../linear-algebra/Vector";
import { Equalizable } from "../interface/Equalizable";
import { Exportable } from "../interface/Exportable";
import { Printable } from "../interface/Printable";
import { Dimension } from "../linear-algebra/Dimension";
import { Identifiable } from "../interface/Identifiable";

/** 
 * CubeFaces are directions in which normal vectors point, in which cubicals show different stickers. Of course CubeFaces can be identified with CubeParts of type Face, but they have different roles.
 */
export class CubeFace implements Exportable<number>, Identifiable, Equalizable<CubeFace>, Printable {

	private static readonly _all: Array<CubeFace> = new Array();
	private static readonly _allByNormalVectorExport: Map<string, CubeFace> = new Map();

	static readonly RIGHT: CubeFace = new CubeFace(0, 'RIGHT', Dimension.X, true);
	static readonly UP: CubeFace = new CubeFace(1, 'UP', Dimension.Y, true);
	static readonly FRONT: CubeFace = new CubeFace(2, 'FRONT', Dimension.Z, true);
	static readonly LEFT: CubeFace = new CubeFace(3, 'LEFT', Dimension.X, false);
	static readonly DOWN: CubeFace = new CubeFace(4, 'DOWN', Dimension.Y, false);
	static readonly BACK: CubeFace = new CubeFace(5, 'BACK', Dimension.Z, false);

	static getAll(): ReadonlyArray<CubeFace> {
		return this._all;
	}

	static getByIndex(index: number): CubeFace {
		const item = this._all[index];
		if (item === undefined) throw new Error(`Invalid index: ${index}`);
		return item;
	}

	static getByNormalVector(normalVector: Vector): CubeFace {
		const item = this._allByNormalVectorExport.get(JSON.stringify(normalVector.export()));
		if (item === undefined) throw new Error(`Invalid normal vector: ${normalVector}`);
		return item;
	}

	static getByDimensionAndDirection(dimension: Dimension, positiveDirection: boolean): CubeFace {
		return this.getByNormalVector(Vector.fromComponent(dimension, positiveDirection ? 1 : -1));
	}

	private constructor(readonly index: number, readonly name: string, readonly dimension: Dimension, readonly positiveDirection: boolean) {
		CubeFace._all.push(this);
		CubeFace._allByNormalVectorExport.set(JSON.stringify(this.getNormalVector().export()), this);
	}

	static import(value: number): CubeFace {
		return CubeFace.getByIndex(value);
	}

	export(): number {
		return this.index;
	}

	id(): string {
		return JSON.stringify(this.export());
	}

	equals(other: CubeFace): boolean {
		return this.index === other.index;
	}

	toString(): string {
		return `${this.name}`;
	}

	getNormalVector(): Vector {
		return Vector.fromComponent(this.dimension, this.positiveDirection ? 1 : -1);
	}

}