import { Equalizable } from "../interface/Equalizable";
import { Exportable } from "../interface/Exportable";
import { Identifiable } from "../interface/Identifiable";
import { Printable } from "../interface/Printable";

export class Dimension implements Exportable<number>, Identifiable, Equalizable<Dimension>, Printable {

	private static readonly _all: Array<Dimension> = new Array();

	static readonly X = new Dimension(0, 'X')
	static readonly Y = new Dimension(1, 'Y')
	static readonly Z = new Dimension(2, 'Z')

	static getAll(): ReadonlyArray<Dimension> {
		return this._all;
	}

	static getByIndex(index: number): Dimension {
		const item = this._all[index];
		if (item === undefined) throw new Error(`Invalid index: ${index}`);
		return item;
	}

	private constructor(readonly index: number, readonly name: string) {
		Dimension._all.push(this);
	}

	static import(value: number): Dimension {
		return this.getByIndex(value);
	}

	export(): number {
		return this.index;
	}

	id(): string {
		return JSON.stringify(this.export());
	}

	equals(other: Dimension): boolean {
		return this.index === other.index;
	}

	toString(): string {
		return this.name;
	}

	getOrthogonal(dimension2: Dimension): Dimension {
		return Dimension.getByIndex(3 - this.index - dimension2.index);
	}

}