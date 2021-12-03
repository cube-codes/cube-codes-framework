import { Equalizable, Exportable, Identifiable, Printable } from "@cube-codes/cube-codes-model";

export class UiViewMode implements Exportable<number>, Identifiable, Equalizable<UiViewMode>, Printable {

	private static readonly _all: Array<UiViewMode> = new Array();
	private static readonly _allByName: Map<string, UiViewMode> = new Map();

	static readonly NORMAL: UiViewMode = new UiViewMode(0, 'NORMAL');
	static readonly HISTORY_PLAYER: UiViewMode = new UiViewMode(1, 'HISTORY_PLAYER');

	static getAll(): ReadonlyArray<UiViewMode> {
		return this._all;
	}

	static getByIndex(index: number): UiViewMode {
		const item = this._all[index];
		if (item === undefined) throw new Error(`Invalid index: ${index}`);
		return item;
	}

	static getByName(name: string): UiViewMode {
		const item = this._allByName.get(name);
		if (item === undefined) throw new Error(`Invalid name: ${name}`);
		return item;
	}

	private constructor(readonly index: number, readonly name: string) {
		UiViewMode._all.push(this);
		UiViewMode._allByName.set(this.name, this);
	}

	static import(value: number): UiViewMode {
		return UiViewMode.getByIndex(value);
	}

	export(): number {
		return this.index;
	}

	id(): string {
		return this.name;
	}

	equals(other: UiViewMode): boolean {
		return this.index === other.index;
	}

	toString(): string {
		return `${this.name}`;
	}

}