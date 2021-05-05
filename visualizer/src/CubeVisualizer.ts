import { WebGLRenderer } from 'three'
import { OrbitControls } from '@three-ts/orbit-controls';
import { Cube } from '@cube-codes/cube-codes-model'
import { AnimationQueue } from './AnimationQueue';
import { MoveAnimation } from './animation/MoveAnimation';
import { BeamAnimation } from './animation/BeamAnimation';
import { CubeSituation } from './CubeSituation';

export class CubeVisualizer {

	private static readonly FPS_INTERVAL = 1000 / 60

	readonly situation: CubeSituation

	readonly cameraControls: OrbitControls

	readonly renderer: WebGLRenderer

	readonly animationQueue: AnimationQueue

	constructor(readonly cube: Cube, readonly canvas: HTMLCanvasElement, public animationDuration: number) {

		this.situation = new CubeSituation(cube.spec, cube.solutionCondition, cube.getState(), this.canvas.clientWidth, this.canvas.clientHeight);

		this.cameraControls = new OrbitControls(this.situation.camera, this.canvas);
		this.cameraControls.enablePan = false;
		this.cameraControls.enableZoom = false;

		this.renderer = new WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas: this.canvas
		});

		this.animationQueue = new AnimationQueue();
		this.cube.stateChanged.on(e => {
			return new Promise<void>(resolve => {
				if (e.move) {
					this.animationQueue.add(new MoveAnimation(this, e, resolve));
				} else {
					this.animationQueue.add(new BeamAnimation(this, e, resolve));
				}
			});
		});

		let lastTime: number;
		const animate = (time: number) => {

			if (lastTime === undefined) {
				lastTime = time;
			}
			const timePast = time - lastTime;

			requestAnimationFrame(animate);

			if (timePast < CubeVisualizer.FPS_INTERVAL) {
				return;
			}

			const currentAnimation = this.animationQueue.getCurrent();
			if (currentAnimation) {
				currentAnimation.step(timePast);
				if (currentAnimation.isFinished()) {
					this.animationQueue.removeCurrent();
				}
			}

			if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
				this.situation.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
				this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
			}
			
			this.cameraControls.update();
			this.situation.light.position.copy(this.situation.camera.position);

			this.renderer.render(this.situation.scene, this.situation.camera);

			lastTime = time;

		}

		requestAnimationFrame(animate);

	}

}