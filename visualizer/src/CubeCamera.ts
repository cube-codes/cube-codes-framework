import { CubeSpecification } from "@cube-codes/cube-codes-model";
import { PerspectiveCamera, Spherical } from "three";

export class CubeCamera extends PerspectiveCamera {

	private static readonly FOV = 30

	private static readonly INITIAL_POLAR_ANGLE = Math.PI / 8

	private static readonly INITIAL_AZIMUTHAL_ANGLE = (Math.PI / 2) - (Math.PI / 8)

	constructor(readonly spec: CubeSpecification, width: number, height: number) {
		super(CubeCamera.FOV, 2, 0.1, 1000);
		this.setSize(width, height);
		this.resetPerspective();
	}

	private calculateDistance(): number {
		const freeFactor = 1.1;
		return Math.max(1, 1 / this.aspect) * (freeFactor * Math.sqrt(3) * this.spec.edgeLength / 2) / Math.sin(this.fov / 2 / 180 * Math.PI);
	}

	setSize(width: number, height: number): void {
		this.aspect = width / height;
		this.updateProjectionMatrix();
		const currentPosition = new Spherical().setFromVector3(this.position);
		this.position.setFromSphericalCoords(this.calculateDistance(), currentPosition.phi, currentPosition.theta);
		this.lookAt(0, 0, 0);
	}

	resetPerspective(): void {
		const currentPosition = new Spherical().setFromVector3(this.position);
		this.position.setFromSphericalCoords(currentPosition.radius, CubeCamera.INITIAL_AZIMUTHAL_ANGLE, CubeCamera.INITIAL_POLAR_ANGLE);
		this.lookAt(0, 0, 0);
	}

}