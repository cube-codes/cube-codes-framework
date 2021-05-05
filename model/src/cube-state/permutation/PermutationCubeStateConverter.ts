import { CubeSpecification } from "../../cube-geometry/CubeSpecification";
import { CubePart } from "../../cube-geometry/CubePart";
import { CubeState } from "../../cube-state/CubeState";
import { CubePartType } from "../../cube-geometry/CubePartType";
import { CubeletLocation } from "../../cube/CubeletLocation";
import { CubeletState } from "../../cube-state/CubeletState";
import { CubeletOrientation } from "../../cube/CubeletOrientation";
import { Vector } from "../../linear-algebra/Vector";
import { Matrix } from "../../linear-algebra/Matrix";
import { PermutationCubeState } from "./PermutationCubeState";

export class PermutationCubeStateConverter {

	constructor(readonly spec: CubeSpecification) { }

	fromCubeState(cubeState: CubeState): PermutationCubeState {

		const permutations = [new Array<number>(), new Array<number>(), new Array<number>()];
		const reorientations = [new Array<number>(), new Array<number>(), new Array<number>()];

		const log = false;
		let logstring = 'getState: ';

		for (const cubeletState of cubeState.cubelets) {
			const initialLocation = new CubeletLocation(this.spec, cubeletState.initialLocation);
			const location = new CubeletLocation(this.spec, cubeletState.location);
			const orientation = new CubeletOrientation(cubeletState.orientation);
			permutations[initialLocation.type.countDimensions()][this.fromLocation(initialLocation)] = this.fromLocation(location)
			reorientations[initialLocation.type.countDimensions()][this.fromLocation(initialLocation)] = this.fromMatrix(initialLocation.part, location.part, orientation);
			//if (log) logstring += ' At[' + this.indexFromLocation(initialLocation).toString() + ']' + cubical.toString() + " ";
		}

		if (log) logstring = logstring + permutations.toString() + reorientations.toString();
		if (log) console.log(logstring);

		return new PermutationCubeState(this.spec, permutations, reorientations);

	}

	toCubeState(state: PermutationCubeState): CubeState {

		const cubeletStates = new Array<CubeletState>();
		for (const type of CubePartType.getAll()) {
			for (let index = 0; index < type.countLocations(this.spec); index++) {
				const initialLocation = this.toLocation(index, type);
				const location = this.toLocation(state.permutations[type.index][index], type);
				const orientation = this.toMatrix(initialLocation.part, location.part, state.reorientations[type.index][index]);
				cubeletStates.push(new CubeletState(initialLocation.origin, location.origin, orientation.matrix));
			}
		}
		return new CubeState(this.spec, cubeletStates);
	}

	/** Index of a CubicalLocations by type. 
	 * The format is cubePartIndex*(N-2)^d+(remainingCoordinate[0]-1)*(N-2)^(d-1)...
	 * while remainingCoordinate[0] enumerates the possible values -max+1....max-1
	 * @param spec 
	 * @param CubicalLocation 
	 */
	fromLocation(cubeLocation: CubeletLocation): number {
		const componentMaximum = (cubeLocation.spec.edgeLength - 1) / 2;
		let result = cubeLocation.part.index;
		//encodes the remainingCoordinates 0...(N-3)^d, since each remainingCoordinate is -componentMaximum+1...componentMaximum-1
		for (let remainingCoordinate of cubeLocation.originComponentsInPartDimensions) {
			result = (remainingCoordinate + componentMaximum - 1) + result * (this.spec.edgeLength - 2);
		}
		//result=result+1; // from 0-based to to 1-based
		return result;
	}

	/** CubeLocation with a given index by type. The format is cubePartIndex*(N-2)^d+remainingCoordinate[0]*(N-2)^(d-1)...
	 * while remainingCoordinate[0] enumerates the possible values -max+1....max-1
	 */
	toLocation(indexByType: number, type: CubePartType): CubeletLocation {
		const componentMaximum = (this.spec.edgeLength - 1) / 2;
		//indexByType=indexByType-1; // from 1-based to to 0-based 
		let remainingCoordinates = new Array<number>();
		for (let i = type.countDimensions() - 1; i >= 0; i--) {
			remainingCoordinates[i] = (indexByType % (this.spec.edgeLength - 2)) - componentMaximum + 1;
			indexByType = Math.floor(indexByType / (this.spec.edgeLength - 2));
		}
		const cubePart = CubePart.getByTypeAndIndex(type, indexByType);
		return CubeletLocation.fromPartAndOriginComponentsInPartDimensions(this.spec, cubePart, remainingCoordinates);
	}

	/** Returns a number 0....CubePart.normalVectors.length-1 that expresses how the Matrix (mapping the normal vectors at initiallocation to normal vectors at newlocation) are shifted with respect to the fixed order of the normal vectors at both places
	 */
	fromMatrix(initialPart: CubePart, newPart: CubePart, orientation: CubeletOrientation): number {
		const log: boolean = false;
		let logstring = 'reorientationNumberFromMatrix ' + initialPart.toString() + "->" + newPart.toString() + "|" + orientation.matrix.toString() + "\n";
		let transformedNormalVectors = new Array<Vector>();
		const transformedTangentVectors = new Array<Vector>();
		const newlocationNormalVectors = new Array<Vector>();
		const newlocationTangentVectors = new Array<Vector>();

		if (initialPart.type != newPart.type) throw new Error('CubeParts not matching type')
		for (let i: number = 0; i < initialPart.type.countNormalVectors(); i++) {
			transformedNormalVectors.push(orientation.matrix.vectorMultiply(initialPart.normalVectors[i].getNormalVector()));
			newlocationNormalVectors.push(newPart.normalVectors[i].getNormalVector());
			if (log) logstring = logstring + '(' + transformedNormalVectors[i].toString() + '/' + newlocationNormalVectors[i].toString() + ')';
		}
		for (let i: number = 0; i < 3 - initialPart.type.countNormalVectors(); i++) {
			transformedTangentVectors.push(orientation.matrix.vectorMultiply(initialPart.tangentVectors[i].getNormalVector()));
			newlocationTangentVectors.push(newPart.tangentVectors[i].getNormalVector());
			if (log) logstring = logstring + '(' + transformedTangentVectors[i].toString() + '/' + newlocationTangentVectors[i].toString() + ')';
		}
		if (log) console.log(logstring);

		//Find out how the normal vectors are cyclically permuted and how the tangent vectors are rotated
		//In arbitrary dimension we would combine these two types of information, but in dimension 3 this means 
		//* for CORNER 3 normal vectors, for EDGE 2 normal vectors (and no or a already fixed tangent vectors )
		//* for FACE 4 possible roations of the tangent vector (and 1 fixed normal vector)

		if (initialPart.type === CubePartType.FACE) {
			for (let reorientationNumber = 0; reorientationNumber < 4; reorientationNumber++) {
				if (transformedTangentVectors[0].equals(newlocationTangentVectors[0])) return reorientationNumber;
				//rotate the only one transformedNormalVector counterclockwise around the only one normal vector
				transformedTangentVectors[0] = transformedTangentVectors[0].crossProduct(transformedNormalVectors[0]);
			}
		}
		else {
			for (let reorientationNumber = 0; reorientationNumber < initialPart.type.countNormalVectors(); reorientationNumber++) {
				if (transformedNormalVectors[0].equals(newlocationNormalVectors[0])) return reorientationNumber;
				//shift index by 1
				transformedNormalVectors = transformedNormalVectors.concat(transformedNormalVectors.splice(0, 1));
			}
		}
		throw new Error('Cannot bring the sets of normal and additional vectors to coincide (cube with illegal reorientations to start with?)');
	}

	/** Takes a number 0....CubePart.normalVectors.length-1 and finds a Matrix (mapping the normal vectors at initiallocation to normal vectors at newlocation) are shifted with respect to the fixed order of the normal vectors at both places
	* Because Face has four normal vectors (instead of one), the function is unique
	*/
	toMatrix(initialPart: CubePart, newPart: CubePart, reorientationNumber: number): CubeletOrientation {
		const log: boolean = false;
		let logstring = 'reorientationNumberFromMatrix ' + initialPart.toString() + "->" + newPart.toString() + "|" + reorientationNumber.toString() + "\n";
		let initialLocationNormalVectors = new Array<Vector>();
		const initialLocationTangentVectors = new Array<Vector>();
		const newLocationNormalVectors = new Array<Vector>();
		const newLocationTangentVectors = new Array<Vector>();

		if (initialPart.type != newPart.type) throw new Error('CubeParts not matching type')
		for (let i: number = 0; i < initialPart.type.countNormalVectors(); i++) {
			initialLocationNormalVectors.push(initialPart.normalVectors[i].getNormalVector());
			newLocationNormalVectors.push(newPart.normalVectors[i].getNormalVector());
			if (log) logstring = logstring + '(' + initialLocationNormalVectors[i].toString() + '/' + newLocationNormalVectors[i].toString() + ')';
		}
		for (let i: number = 0; i < 3 - initialPart.type.countNormalVectors(); i++) {
			initialLocationTangentVectors.push(initialPart.tangentVectors[i].getNormalVector());
			newLocationTangentVectors.push(newPart.tangentVectors[i].getNormalVector());
			if (log) logstring = logstring + '(' + initialLocationTangentVectors[i].toString() + '/' + newLocationTangentVectors[i].toString() + ')';
		}
		if (log) console.log(logstring);

		//shift according to reorientationNumber
		if (initialPart.type === CubePartType.FACE) {
			//rotate the only one transformedNormalVector counterclockwise around the only one normal vector
			for (let i = 0; i < reorientationNumber; i++) {
				initialLocationTangentVectors[0] = initialLocationTangentVectors[0].crossProduct(initialLocationNormalVectors[0]);
				initialLocationTangentVectors[1] = initialLocationTangentVectors[1].crossProduct(initialLocationNormalVectors[0]);
			}
		} else if (initialPart.type === CubePartType.CORNER) {
			//shift index
			initialLocationNormalVectors = initialLocationNormalVectors.concat(initialLocationNormalVectors.splice(0, reorientationNumber));
		} else if (initialPart.type === CubePartType.EDGE) {
			//shift index
			initialLocationNormalVectors = initialLocationNormalVectors.concat(initialLocationNormalVectors.splice(0, reorientationNumber));
			//must flip the tangentvector so it stays a rotation matrixwith detetminant 1
			if (reorientationNumber === 1) initialLocationTangentVectors[0] = initialLocationTangentVectors[0].scalarMultiply(-1);
		}

		//Solve for matrix: It is enough to match the first one?
		const initialLocationBasis = initialLocationNormalVectors.concat(initialLocationTangentVectors);
		const newLocationBasis = newLocationNormalVectors.concat(newLocationTangentVectors);
		return new CubeletOrientation(Matrix.forBaseChange(initialLocationBasis, newLocationBasis));

	}

}