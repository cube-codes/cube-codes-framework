import { AmbientLight, DirectionalLight, Scene } from 'three'
import { CubeSolutionCondition, CubeSpecification, CubeState } from '@cube-codes/cube-codes-model'
import { CubeCamera } from './CubeCamera';
import { CubeRealisation } from './CubeRealisation';

export class CubeSituation {

	readonly scene: Scene

	readonly cubeRealisation: CubeRealisation

	readonly camera: CubeCamera

	readonly light: DirectionalLight

	constructor(readonly cubeSpec: CubeSpecification, readonly cubeSolutionCondition: CubeSolutionCondition, readonly cubeState: CubeState, width: number, height: number) {

		this.scene = new Scene();

		const ambientLight = new AmbientLight(0xffffff, 0.7);
		this.scene.add(ambientLight);

		this.light = new DirectionalLight(0xffffff, 0.4);
		this.scene.add(this.light);

		this.cubeRealisation = new CubeRealisation(this.cubeSpec, this.cubeSolutionCondition, this.cubeState);
		this.scene.add(...this.cubeRealisation.getCubelets());

		this.camera = new CubeCamera(this.cubeSpec, width, height);
		this.light.position.copy(this.camera.position);

	}

	setSize(width: number, height: number): void {
		this.camera.setSize(width, height);
	}

}