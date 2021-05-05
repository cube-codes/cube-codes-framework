import { CubePart } from "../cube-geometry/CubePart";
import { CubePartType } from "../cube-geometry/CubePartType";
import { CubeSpecification } from "../cube-geometry/CubeSpecification";
import { Equalizable } from "../interface/Equalizable";
import { Printable } from "../interface/Printable";
import { Dimension } from "../linear-algebra/Dimension";
import { Matrix } from "../linear-algebra/Matrix";
import { Vector } from "../linear-algebra/Vector";

/** 
 * Immutable. Wraps a CubeCoordinate in the cube, which has recognized the containing CubePart (Corner, Edge, Face) and local coordinates (or thrown an error).
 * 
 */
export class CubeletLocation implements Equalizable<CubeletLocation>, Printable {

	readonly part: CubePart;

	readonly originComponentsInPartDimensions: ReadonlyArray<number>;

	constructor(readonly spec: CubeSpecification, readonly origin: Vector) {

		//TODO: Test origin on being valid

		let partOrigin = Vector.ZERO;
		const partDimensions = new Array<Dimension>();
		const originComponentsInPartDimensions = new Array<number>();

		//Go through all dimensions and see if the result is sharp 0 resp. max or if it is some value in between.
		const componentMaximum = (spec.edgeLength - 1) / 2;
		for (const dimension of Dimension.getAll()) {
			const originComponent = origin.getComponent(dimension);
			if (originComponent === componentMaximum) {
				partOrigin = partOrigin.withComponent(dimension, 1);
			} else if (originComponent === -componentMaximum) {
				partOrigin = partOrigin.withComponent(dimension, -1);
			} else if (originComponent > -componentMaximum && originComponent < componentMaximum) {
				partDimensions.push(dimension);
				originComponentsInPartDimensions.push(originComponent);
			} else if (originComponent < 0 || originComponent > componentMaximum) {
				throw new Error(`Origin outside of cube: ${origin}`);
			}
		}

		if (partDimensions.length === 3) throw new Error(`Origin inside of cube: ${origin}`);

		this.part = CubePart.getByOriginAndDimensions(partOrigin, partDimensions);
		this.originComponentsInPartDimensions = originComponentsInPartDimensions;

	}

	/** Computes a CubicalLocation on given CubePart toghether with local coordinates. Used in CubicalLocation.getAll and IndexToLocation.fromIndex and possibly during cube inspection.
	 * 
	 */
	static fromPartAndOriginComponentsInPartDimensions(spec: CubeSpecification, part: CubePart, originComponentsInPartDimensions: ReadonlyArray<number>): CubeletLocation {

		if (part.dimensions.length != originComponentsInPartDimensions.length) throw new Error(`Origin components in part dimensions have wrong length (expected: ${part.dimensions.length}): ${originComponentsInPartDimensions.length}`);

		let origin: Vector = part.origin.scalarMultiply((spec.edgeLength - 1) / 2);
		for (let dimensionInPartIndex = 0; dimensionInPartIndex < part.dimensions.length; dimensionInPartIndex++) {
			origin = origin.withComponent(part.dimensions[dimensionInPartIndex], originComponentsInPartDimensions[dimensionInPartIndex]);
		}

		return new CubeletLocation(spec, origin);

	}


	/**Constructs all cubical locations inside (i.e. ecluding lowerdimensional boundary) of a given Face/Edge/Corner
	 * essentially by covering all possibilities in the if-tree in the constructor
	*/
	static fromPart(spec: CubeSpecification, part: CubePart): ReadonlyArray<CubeletLocation> {
		const maxOriginComponent = (spec.edgeLength - 1) / 2;
		const result = new Array<CubeletLocation>();
		if (part.type === CubePartType.CORNER) {
			result.push(CubeletLocation.fromPartAndOriginComponentsInPartDimensions(spec, part, []));
		} else if (part.type === CubePartType.EDGE) {
			for (let remainingOriginComponent = -maxOriginComponent + 1; remainingOriginComponent <= maxOriginComponent - 1; remainingOriginComponent++) {
				result.push(CubeletLocation.fromPartAndOriginComponentsInPartDimensions(spec, part, [remainingOriginComponent]));
			}
		} else if (part.type === CubePartType.FACE) {
			for (let remainingOriginComponent1 = -maxOriginComponent + 1; remainingOriginComponent1 <= maxOriginComponent - 1; remainingOriginComponent1++) {
				for (let remainingOriginComponent2 = -maxOriginComponent + 1; remainingOriginComponent2 <= maxOriginComponent - 1; remainingOriginComponent2++) {
					result.push(CubeletLocation.fromPartAndOriginComponentsInPartDimensions(spec, part, [remainingOriginComponent1, remainingOriginComponent2]));
				}
			}
		} else {
			throw new Error(`Invalid type: ${part.type}`);
		}
		return result;
	}

	equals(other: CubeletLocation): boolean {
		return this.origin.equals(other.origin);
	}

	toString() {
		return this.origin.toString();
	}

	get type() {
		return this.part.type;
	}

	isAlong(dimension: Dimension): boolean {
		return this.part.dimensions.some(d => d === dimension);
	}

	rotate(axis: Dimension): CubeletLocation {
		return new CubeletLocation(this.spec, Matrix.fromRotation(axis).vectorMultiply(this.origin));
	}

}