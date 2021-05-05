import { Equalizable } from "../../interface/Equalizable";
import { Exportable } from "../../interface/Exportable";
import { Identifiable } from "../../interface/Identifiable";
import { Printable } from "../../interface/Printable";

export class Color3OrbitExport {

	constructor(
		readonly cornerPermutationsVsEdgePermutationsSignum: number, // +1 or -1
		readonly cornerOrientationSumMod3: number, //0,1,2
		readonly edgeOrientationSumMod2: number) {} //0,1

}

export class Color3Orbit implements Exportable<Color3OrbitExport>, Identifiable, Equalizable<Color3Orbit>, Printable {

	static readonly TRIVIAL = new Color3Orbit(1, 0, 0);
	
	constructor(
		readonly cornerPermutationsVsEdgePermutationsSignum: number, // +1 or -1
		readonly cornerOrientationsSumMod3: number, //0,1,2
		readonly edgeOrientationsSumMod2: number) { //0,1
		if (cornerPermutationsVsEdgePermutationsSignum != +1 && cornerPermutationsVsEdgePermutationsSignum != -1) throw Error('Illegal value for permutations signum');
		if (cornerOrientationsSumMod3 != 0 && cornerOrientationsSumMod3 != 1 && cornerOrientationsSumMod3 != 2) throw Error('Illegal value for corner orientations');
		if (edgeOrientationsSumMod2 != 0 && edgeOrientationsSumMod2 != 1) throw Error('Illegal value for edge orientations');
	}

	static import(value: Color3OrbitExport): Color3Orbit {
		return new Color3Orbit(value.cornerPermutationsVsEdgePermutationsSignum, value.cornerOrientationSumMod3, value.edgeOrientationSumMod2);
	}

	export(): Color3OrbitExport {
		return new Color3OrbitExport(this.cornerPermutationsVsEdgePermutationsSignum, this.cornerOrientationsSumMod3, this.edgeOrientationsSumMod2);
	}

	id(): string {
		return JSON.stringify(this.export());
	}

	equals(other: Color3Orbit): boolean {
		return this.cornerPermutationsVsEdgePermutationsSignum === other.cornerPermutationsVsEdgePermutationsSignum && this.cornerOrientationsSumMod3 === other.cornerOrientationsSumMod3 && this.edgeOrientationsSumMod2 === other.edgeOrientationsSumMod2;
	}

	toString(): string {
		return `Orbit: Signums=${this.cornerPermutationsVsEdgePermutationsSignum}, CornerOrientations=${this.cornerOrientationsSumMod3}, EdgeOrientations=${this.edgeOrientationsSumMod2}`;
	}

	public isSolvable(): boolean {
		return this.equals(Color3Orbit.TRIVIAL);
	}
}