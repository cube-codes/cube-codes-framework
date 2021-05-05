import { CubeState } from "./CubeState";
import { CubeSpecification } from "../cube-geometry/CubeSpecification";
import { CubeFace } from "../cube-geometry/CubeFace";
import { Vector } from "../linear-algebra/Vector";
import { CubeletLocation } from "../cube/CubeletLocation";
import { CubePart } from "../cube-geometry/CubePart";
import { Arrays } from "../utilities/Arrays";
import { CubeletState } from "./CubeletState";
import { CubePartType } from "../cube-geometry/CubePartType";
import { Matrix } from "../linear-algebra/Matrix";

/**
 * Tools to read and write a textual diagram displaying where and in which orientation the cubicals are. However, the orientation of faces and different edges with same coloring (for N>3) are not distinguishable in this presentation.
 */
export class ColorCubeStateStringifier {

	readonly #maxComponent: number;

	constructor(private readonly spec: CubeSpecification) {
		this.#maxComponent = (this.spec.edgeLength - 1) / 2;
	}

	parse(stateString: string): CubeState {

		//1) READ STRING

		const faceletColorStrings = stateString.split(/\s+/).filter(fs => fs !== '').reverse();
		if (faceletColorStrings.length != 6 * this.spec.edgeLength * this.spec.edgeLength) throw new Error('Wrong number of facelets');

		const faceletColorsByOrigin = new Map<string, CubeFace>();

		//FIRST BLOCK
		for (let l = 0; l < this.spec.edgeLength; l++) {

			//UP
			{
				const y = this.#maxComponent + 1;
				const z = -this.#maxComponent + l;
				for (let x = -this.#maxComponent; x <= this.#maxComponent; x++) {
					faceletColorsByOrigin.set(Vector.fromComponents(x, y, z).id(), ColorCubeStateStringifier.parseFaceletColor(faceletColorStrings.pop()!));
				}
			}

		}

		//SECOND BLOCK
		for (let l = 0; l < this.spec.edgeLength; l++) {

			//LEFT
			{
				const x = -this.#maxComponent - 1;
				const y = this.#maxComponent - l;
				for (let z = -this.#maxComponent; z <= this.#maxComponent; z++) {
					faceletColorsByOrigin.set(Vector.fromComponents(x, y, z).id(), ColorCubeStateStringifier.parseFaceletColor(faceletColorStrings.pop()!));
				}
			}

			//FRONT
			{
				const y = this.#maxComponent - l;
				const z = this.#maxComponent + 1;
				for (let x = -this.#maxComponent; x <= this.#maxComponent; x++) {
					faceletColorsByOrigin.set(Vector.fromComponents(x, y, z).id(), ColorCubeStateStringifier.parseFaceletColor(faceletColorStrings.pop()!));
				}
			}

			//RIGHT
			{
				const x = this.#maxComponent + 1;
				const y = this.#maxComponent - l;
				for (let z = this.#maxComponent; z >= -this.#maxComponent; z--) {
					faceletColorsByOrigin.set(Vector.fromComponents(x, y, z).id(), ColorCubeStateStringifier.parseFaceletColor(faceletColorStrings.pop()!));
				}
			}

			//BACK
			{
				const y = this.#maxComponent - l;
				const z = -this.#maxComponent - 1;
				for (let x = this.#maxComponent; x >= -this.#maxComponent; x--) {
					faceletColorsByOrigin.set(Vector.fromComponents(x, y, z).id(), ColorCubeStateStringifier.parseFaceletColor(faceletColorStrings.pop()!));
				}
			}

		}

		//THIRD BLOCK
		for (let l = 0; l < this.spec.edgeLength; l++) {

			//DOWN
			{
				const y = -this.#maxComponent - 1;
				const z = this.#maxComponent - l;
				for (let x = -this.#maxComponent; x <= this.#maxComponent; x++) {
					faceletColorsByOrigin.set(Vector.fromComponents(x, y, z).id(), ColorCubeStateStringifier.parseFaceletColor(faceletColorStrings.pop()!));
				}
			}

		}

		/*let logstring_colorcube='';
		for(let i=0;i<6*N*N;i++) {logstring_colorcube=logstring_colorcube+ " "+ ColorCubeLanguage.stringifySticker(colors[i])+coordinates[i].toString()}
		console.count(logstring_colorcube);*/

		//2) SEARCH IN THIS "COLOR CUBE" FOR CUBICALS

		const cubelets = Array<CubeletState>();

		for (const type of CubePartType.getAll()) {

			//Make a pool of all initialLocations (=cubelets) of this type, to cross out those we have found already
			const initialLocationsPool = new Array<CubeletLocation>();
			for (const part of CubePart.getByType(type)) {
				for (const cubicalLocation of CubeletLocation.fromPart(this.spec, part)) {
					initialLocationsPool.push(cubicalLocation);
				}
			}

			//go through all locations
			for (const part of CubePart.getByType(type)) {
				for (const location of CubeletLocation.fromPart(this.spec, part)) {

					//memorize colors at this location
					let faceletColors = new Array<CubeFace>();
					for (const face of location.part.normalVectors) {
						faceletColors.push(faceletColorsByOrigin.get(location.origin.add(face.getNormalVector()).id())!);
						//console.log('('+location.coordinates.add(normalVector).toString()+':'+this.getColorAt(location.coordinates.add(normalVector)).toString());
					}

					//search for initialLocation i.e. cubelets (several initialLocations have the same color, so there are many solutions, which is also why we need the pool)
					//TODO: can be improved greatly using matrix calculations? 
					let found = false; //to detect if nothing is found
					search:
					//i as index in the array because otherwise deleting from the array is difficult
					for (let i = 0; i < initialLocationsPool.length; i++) {

						let initialLocation = initialLocationsPool[i];
						let initialNormalVectors = initialLocation.part.normalVectors.map(f => f.getNormalVector());
						const initialTangentVectors = initialLocation.part.tangentVectors.map(f => f.getNormalVector());
						const normalVectors = location.part.normalVectors.map(f => f.getNormalVector());
						const tangentVectors = location.part.tangentVectors.map(f => f.getNormalVector());

						//Now tries to match the normal vectors (tangent vectors have no color, so there are many solutions for FACE)
						for (let rotation = 0; rotation < type.countNormalVectors(); rotation++) {

							if (Arrays.equals(faceletColors, initialLocation.part.normalVectors)) {
								found = true;
								initialLocationsPool.splice(i, 1); //Remove possibility from pool
								const orientation = Matrix.forBaseChange(initialNormalVectors.concat(initialTangentVectors), normalVectors.concat(tangentVectors));
								cubelets.push(new CubeletState(initialLocation.origin, location.origin, orientation));
								break search;
							}

							//Try different rotation
							faceletColors = faceletColors.concat(faceletColors.splice(0, 1));
							initialNormalVectors = initialNormalVectors.concat(initialNormalVectors.splice(0, 1));

						}
					}

					if (!found) throw new Error(`Not found cubelet with color combination ${faceletColors[0].toString()}`);

				}
			}
		}

		return new CubeState(this.spec, cubelets);

	}

	private static parseFaceletColor(faceletColorString: String): CubeFace {
		switch (faceletColorString) {
			case 'F': return CubeFace.FRONT;
			case 'R': return CubeFace.RIGHT;
			case 'U': return CubeFace.UP;
			case 'B': return CubeFace.BACK;
			case 'L': return CubeFace.LEFT;
			case 'D': return CubeFace.DOWN;
			default: throw new Error(`Invalid facelet color string: ${faceletColorString}`);
		}
	}

	stringify(cubeState: CubeState): string {

		//1) BUILD A "COLOR CUBE" WITH COLORS INSERTED AT LOCATION+NORMALVECTOR

		const faceletColorsByOrigin = new Map<string, CubeFace>();

		//Go throgh all cubelets 
		for (const cubeletState of cubeState.cubelets) {
			const initialLocation = new CubeletLocation(this.spec, cubeletState.initialLocation);
			for (const face of initialLocation.part.normalVectors) {
				const transformedNormalVectors = cubeletState.orientation.vectorMultiply(face.getNormalVector());
				faceletColorsByOrigin.set(cubeletState.location.add(transformedNormalVectors).id(), face);
			}
		}

		/*let logstring_colorcube='';
		for(let i=0;i<6*N*N;i++) {logstring_colorcube=logstring_colorcube+ " "+ ColorCubeLanguage.stringifySticker(colors[i])+coordinates[i].toString()}
		console.count(logstring_colorcube);*/

		//2) WRITE STRING

		const separator = new String(' ');
		const faceseparator = new String('  ').repeat(this.spec.edgeLength);
		const linebreak = '\n';

		var result = '';

		//FIRST BLOCK
		for (let l = 0; l < this.spec.edgeLength; l++) {

			// Indentation over LEFT
			result += faceseparator;

			//UP
			{
				const y = this.#maxComponent + 1;
				const z = -this.#maxComponent + l;
				for (let x = -this.#maxComponent; x <= this.#maxComponent; x++) {
					result += ColorCubeStateStringifier.stringifyFaceletColor(faceletColorsByOrigin.get(Vector.fromComponents(x, y, z).id())!) + separator;
				}
			}

			// Indentation over RIGHT and BACK
			result += faceseparator;
			result += faceseparator;

			result += linebreak;

		}

		//SECOND BLOCK
		for (let l = 0; l < this.spec.edgeLength; l++) {

			//LEFT
			{
				const x = -this.#maxComponent - 1;
				const y = this.#maxComponent - l;
				for (let z = -this.#maxComponent; z <= this.#maxComponent; z++) {
					result += ColorCubeStateStringifier.stringifyFaceletColor(faceletColorsByOrigin.get(Vector.fromComponents(x, y, z).id())!) + separator;
				}
			}

			//FRONT
			{
				const y = this.#maxComponent - l;
				const z = this.#maxComponent + 1;
				for (let x = -this.#maxComponent; x <= this.#maxComponent; x++) {
					result += ColorCubeStateStringifier.stringifyFaceletColor(faceletColorsByOrigin.get(Vector.fromComponents(x, y, z).id())!) + separator;
				}
			}

			//RIGHT
			{
				const x = this.#maxComponent + 1;
				const y = this.#maxComponent - l;
				for (let z = this.#maxComponent; z >= -this.#maxComponent; z--) {
					result += ColorCubeStateStringifier.stringifyFaceletColor(faceletColorsByOrigin.get(Vector.fromComponents(x, y, z).id())!) + separator;
				}
			}

			//BACK
			{
				const y = this.#maxComponent - l;
				const z = -this.#maxComponent - 1;
				for (let x = this.#maxComponent; x >= -this.#maxComponent; x--) {
					result += ColorCubeStateStringifier.stringifyFaceletColor(faceletColorsByOrigin.get(Vector.fromComponents(x, y, z).id())!) + separator;
				}
			}
			
			result += linebreak;
		
		}

		//THIRD BLOCK
		for (let l = 0; l < this.spec.edgeLength; l++) {

			// Indentation underneeth LEFT
			result += faceseparator;

			//DOWN
			{
				const y = -this.#maxComponent - 1;
				const z = this.#maxComponent - l;
				for (let x = -this.#maxComponent; x <= this.#maxComponent; x++) {
					result += ColorCubeStateStringifier.stringifyFaceletColor(faceletColorsByOrigin.get(Vector.fromComponents(x, y, z).id())!) + separator;
				}
			}

			// Indentation underneeth RIGHT and BACK
			result += faceseparator;
			result += faceseparator;
			
			result += linebreak;

		}

		return result;
	
	}

	private static stringifyFaceletColor(faceletColor: CubeFace) {
		switch (faceletColor) {
			case CubeFace.FRONT: return 'F';
			case CubeFace.RIGHT: return 'R';
			case CubeFace.UP: return 'U';
			case CubeFace.BACK: return 'B';
			case CubeFace.LEFT: return 'L';
			case CubeFace.DOWN: return 'D';
			default: throw new Error(`Invalid facelet color: ${faceletColor}`);
		}
	}

}
