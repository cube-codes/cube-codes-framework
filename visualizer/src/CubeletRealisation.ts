import { CubeletState, CubeSolutionCondition, CubeSolutionConditionType, CubeSpecification, Matrix, Vector } from "@cube-codes/cube-codes-model";
import { BoxGeometry, Group, Mesh, MeshStandardMaterial, TextGeometry } from "three";
import { FONT } from "./Font";
import { RoundedBoxBufferGeometry } from "./RoundedBoxBufferGeometry";
import { Utils } from "./Utils";

export class CubeletRealisation extends Group {

	static readonly EDGE_LENGTH: number = 1;

	readonly initialLocation: Vector

	constructor(readonly spec: CubeSpecification, readonly solutionCondition: CubeSolutionCondition, cubeletState: CubeletState) {

		super();
		this.initialLocation = cubeletState.initialLocation;

		const maxComponent = (this.spec.edgeLength - 1) / 2;
		const initialLocationComponentLimit = cubeletState.initialLocation.components.map(c => c === maxComponent ? 1 : c === -maxComponent ? -1 : 0);

		this.createBase();

		for(let dimension = 0; dimension < 3; dimension++) {
			if (initialLocationComponentLimit[dimension] !== 0) {
				this.createSticker(dimension, initialLocationComponentLimit[dimension]);
				if(solutionCondition.type === CubeSolutionConditionType.STRICT) {
					this.createNumber(dimension, initialLocationComponentLimit[dimension]);
				}
			}
		}

		this.setState(cubeletState);

	}

	private createBase(): void {

		const edgeRadius = 0.05;
		const segmentCount = 10;
		const color = 0x222222;
		const roughness = 0.6;

		const geometry = new RoundedBoxBufferGeometry(CubeletRealisation.EDGE_LENGTH, CubeletRealisation.EDGE_LENGTH, CubeletRealisation.EDGE_LENGTH, edgeRadius, segmentCount);
		const material = new MeshStandardMaterial({
			color: color,
			roughness: roughness
		});
		const mesh = new Mesh(geometry, material);
		this.add(mesh);

	}

	private positionMesh(mesh: Mesh, dimension: number, direction: number, depth: number, out: number): void {
		if(dimension === 0) {
			mesh.rotateY(direction * Math.PI / 2);
		} else if(dimension === 1) {
			mesh.rotateX(-direction * Math.PI / 2);
		} else if(dimension === 2) {
			mesh.rotateY((1 - direction) * Math.PI / 2);
		} else {
			throw new Error('Illegal dimension');
		}
		mesh.position.setComponent(dimension, direction * ((CubeletRealisation.EDGE_LENGTH / 2) - (depth / 2) + out));
	}

	private createSticker(dimension: number, direction: number): void {

		const edgeLength = CubeletRealisation.EDGE_LENGTH - 0.05;
		const out = 0.005;
		const edgeRadius = 0.1;
		const depth = 2 * edgeRadius;
		const segmentCount = 10;
		const color = [0xba0c2f, 0xffffff, 0x009a44, 0xfe5000, 0xffd700, 0x003da5];
		const roughness = 0.4;

		const geometry = new RoundedBoxBufferGeometry(edgeLength, edgeLength, depth, edgeRadius, segmentCount);
		const material = new MeshStandardMaterial({
			color: color[dimension + (direction === 1 ? 0 : 3)],
			roughness: roughness
		});
		const mesh = new Mesh(geometry, material);
		this.add(mesh);
		this.positionMesh(mesh, dimension, direction, depth, out);

	}

	private createNumber(dimension: number, direction: number): void {

		const font = FONT;
		const fontSize = 0.3;
		const out = 0.01;
		const depth = 0.05;
		const color = 0x222222;
		const roughness = 0.8;

		const lineWidth = 0.5;
		const lineThickness = 0.03;
		const lineOffset = 0.28;

		const maxComponent = (this.spec.edgeLength - 1) / 2;
		let row, column;
		if(dimension === 0) {
			row = maxComponent - this.initialLocation.getY();
			column = maxComponent - (direction * this.initialLocation.getZ());
		} else if(dimension === 1) {
			row = maxComponent + (direction * this.initialLocation.getZ());
			column = maxComponent + this.initialLocation.getX();
		} else if(dimension === 2) {
			row = maxComponent - this.initialLocation.getY();
			column = maxComponent + (direction * this.initialLocation.getX());
		} else {
			throw new Error('Illegal dimension');
		}
		const value = (row * this.spec.edgeLength) + column + 1;
		
		const geometry = new TextGeometry(value.toString(), {
			font: font,
			size: fontSize,
			height: depth
		}).center();
		const material = new MeshStandardMaterial({
			color: color,
			roughness: roughness
		});
		const mesh = new Mesh(geometry, material);
		this.add(mesh);
		this.positionMesh(mesh, dimension, direction, depth, out);
		
		const lineGeometry = new BoxGeometry(lineWidth, lineThickness, depth);
		const lineMesh = new Mesh(lineGeometry, material);
		this.add(lineMesh);
		this.positionMesh(lineMesh, dimension, direction, depth, out);
		lineMesh.position.setComponent(dimension === 1 ? 2 : 1, (dimension === 1 ? direction : -1) * lineOffset);

	}

	setLocation(location: Vector): void {
		this.position.set(location.getX(), location.getY(), location.getZ());
	}

	setOrientation(orientation: Matrix): void {
		this.quaternion.setFromRotationMatrix(Utils.matrix4FromMatrix(orientation));
	}

	setState(newState: CubeletState): void {
		this.setLocation(newState.location);
		this.setOrientation(newState.orientation);
	}

}