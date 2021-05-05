import { BitInputStream, BitOutputStream } from "@thi.ng/bitstream";
import { Base64 } from "js-base64";
import { CubePartType } from "../cube-geometry/CubePartType";
import { CubeSpecification } from "../cube-geometry/CubeSpecification";
import { Dimension } from "../linear-algebra/Dimension";
import { Matrix } from "../linear-algebra/Matrix";
import { Vector } from "../linear-algebra/Vector";
import { CubeletState } from "./CubeletState";
import { CubeState } from "./CubeState";

export class CubeStateStringifier {

	readonly #maxComponent: number;

	readonly #edgeBitCount: number;

	constructor(private readonly spec: CubeSpecification) {
		this.#maxComponent = (this.spec.edgeLength - 1) / 2;
		this.#edgeBitCount = Math.ceil(Math.log2(this.spec.edgeLength));
	}

	parse(stateString: string): CubeState {
		const stream = new BitInputStream(Uint8Array.from(Base64.decode(stateString), c => c.charCodeAt(0)));
		const cubelets = [];
		const cubeletCount = CubePartType.getAll().map(t => t.countLocations(this.spec)).reduce((sum, value) => sum + value, 0);
		for(let cubeletIndex = 0; cubeletIndex < cubeletCount; cubeletIndex++) {
			cubelets.push(new CubeletState(this.parseLocation(stream), this.parseLocation(stream), this.parseOrientation(stream)));
		}
		return new CubeState(this.spec, cubelets);
	}

	private parseLocation(stream: BitInputStream): Vector {
		let location = Vector.ZERO;
		for (const dimension of Dimension.getAll()) {
			location = location.withComponent(dimension, stream.read(this.#edgeBitCount) - this.#maxComponent);
		}
		return location;
	}

	private parseOrientation(stream: BitInputStream): Matrix {
		let orientation = Matrix.ZERO;
		for (const rowDimension of Dimension.getAll()) {
			const columnDimension = Dimension.getByIndex(stream.read(2));
			const component = stream.read(1) === 1 ? 1 : -1;
			orientation = orientation.withComponent(rowDimension, columnDimension, component);
		}
		return orientation;
	}

	stringify(state: CubeState): string {
		const stream = new BitOutputStream();
		state.cubelets.forEach(c => {
			this.bitifyLocation(c.initialLocation, stream);
			this.bitifyLocation(c.location, stream);
			this.bitifyOrientation(c.orientation, stream);
		});
		return Base64.encode(String.fromCodePoint(...stream.bytes()));
	}

	private bitifyLocation(location: Vector, stream: BitOutputStream): void {
		for (const dimension of Dimension.getAll()) {
			stream.write(location.getComponent(dimension) + this.#maxComponent, this.#edgeBitCount);
		}
	}

	private bitifyOrientation(orientation: Matrix, stream: BitOutputStream): void {
		for (const rowDimension of Dimension.getAll()) {
			for (const columnDimension of Dimension.getAll()) {
				const component = orientation.getComponent(rowDimension, columnDimension);
				if(component !== 0) {
					stream.write(columnDimension.index, 2);
					stream.write(component === 1 ? 1 : 0, 1);
				}
			}
		}
	}

}