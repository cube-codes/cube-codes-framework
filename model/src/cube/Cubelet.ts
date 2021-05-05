import { CubeFace } from "../cube-geometry/CubeFace";
import { CubePart } from "../cube-geometry/CubePart";
import { CubePartType } from "../cube-geometry/CubePartType";
import { Dimension } from "../linear-algebra/Dimension";
import { Cube } from "./Cube";
import { CubeletLocation } from "./CubeletLocation";
import { CubeletOrientation } from "./CubeletOrientation";
import { ReadonlyCubelet } from "./ReadonlyCubelet";

export class Cubelet implements ReadonlyCubelet {

	#location: CubeletLocation;

	#orientation: CubeletOrientation;

	constructor(
		readonly cube: Cube,
		readonly initialLocation: CubeletLocation,
		currentLocation?: CubeletLocation,
		currentOrientation?: CubeletOrientation) {

		this.#location = currentLocation ?? initialLocation;
		this.#orientation = currentOrientation ?? CubeletOrientation.IDENTITY;

		if (!this.cube.spec.equals(this.initialLocation.spec)) throw new Error(`Invalid spec of intial location (expected: ${this.cube.spec}): ${this.initialLocation.spec}`);
		if (!this.cube.spec.equals(this.#location.spec)) throw new Error(`Invalid spec of location (expected: ${this.cube.spec}): ${this.#location.spec}`);
		if (!this.initialLocation.type.equals(this.#location.type)) throw new Error(`Invalid type of location (expected: ${this.initialLocation.type}): ${this.#location.type}`);
	}

	/** Outputs the data of a CubeState. Used for debug and lesson "permutation" and "orbit"
	 * 
	 */
	toString(): string {
		return this.type.toString() + '(' + this.initialLocation.toString() + '->' + this.currentLocation.toString() + '|' + this.currentOrientation.toString() + ')';
	}

	get initialPart(): CubePart {
		return this.initialLocation.part;
	}

	get initialOrientation(): CubeletOrientation {
		return CubeletOrientation.IDENTITY;
	}

	get currentLocation(): CubeletLocation {
		return this.#location;
	}

	get currentPart(): CubePart {
		return this.#location.part;
	}

	get currentOrientation(): CubeletOrientation {
		return this.#orientation;
	}

	get solvedLocation(): CubeletLocation {
		return new CubeletLocation(this.cube.spec, this.cube.getPerspectiveFromFaceMids().matrix.vectorMultiply(this.initialLocation.origin));
	}

	get solvedPart(): CubePart {
		return this.solvedLocation.part;
	}

	get solvedOrientation(): CubeletOrientation {
		return new CubeletOrientation(this.cube.getPerspectiveFromFaceMids().matrix.multiply(this.initialOrientation.matrix));
	}

	get type(): CubePartType {
		return this.initialLocation.type;
	}

	//Using getPerpectiveFromMids for odd cubes
	isSolved(): boolean {
		return this.cube.solutionCondition.isCubeletSolvedFromPerspective(this, this.cube.getPerspectiveFromFaceMids())
	}

	rotate(dimension: Dimension): void {
		this.#location = this.#location.rotate(dimension);
		this.#orientation = this.#orientation.rotate(dimension);
	}

	beam(newLocation: CubeletLocation, newOrientation: CubeletOrientation) {
		if (!this.cube.spec.equals(newLocation.spec)) throw new Error(`Invalid spec of location (expected: ${this.cube.spec}): ${newLocation.spec}`);
		if (!this.initialLocation.type.equals(newLocation.type)) throw new Error(`Invalid type of location (expected: ${this.initialLocation.type}): ${newLocation.type}`);
		this.#location = newLocation;
		this.#orientation = newOrientation;
	}

	getColorAt(currentFace: CubeFace): CubeFace {
		if (!this.currentLocation.part.normalVectors.find(v => currentFace.equals(v))) throw Error("Cubelet is not visible from currentFace");
		return CubeFace.getByNormalVector(this.currentOrientation.matrix.inverse().vectorMultiply(currentFace.getNormalVector()));
	}

}
