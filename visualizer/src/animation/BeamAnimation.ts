import { Animation } from './Animation'
import { CubeStateChanged, CubeletState } from '@cube-codes/cube-codes-model'
import { Utils } from '../Utils'
import { CubeVisualizer } from '../CubeVisualizer'

export enum BeamAnimationState {
	PENDING,
	FADING_OUT,
	FADING_IN,
	FINISHED
}

export class BeamAnimation implements Animation {

	private readonly newStatesByInitialLocation: ReadonlyMap<string, CubeletState>

	private state: BeamAnimationState

	private currentOpacity: number // from -1 to 1

	constructor(private readonly visualizer: CubeVisualizer, private readonly stateChanged: CubeStateChanged, private readonly resolve: (value: void | PromiseLike<void>) => void) {

		this.newStatesByInitialLocation = stateChanged.newState.cubelets.reduce((mm, cs) => mm.set(Utils.vectorId(cs.initialLocation), cs), new Map<string, CubeletState>());

		this.state = BeamAnimationState.PENDING;
		this.currentOpacity = -1;

	}

	isFinished(): boolean {
		return this.state === BeamAnimationState.FINISHED;
	}

	step(timePast: number): void {
		
		if(this.state === BeamAnimationState.PENDING) {
			this.state = BeamAnimationState.FADING_OUT;
		}

		const stepOpacity = 2 * (this.stateChanged.source?.animation === false ? 1 : timePast / this.visualizer.animationDuration);

		if (this.currentOpacity + stepOpacity > 0 && this.state === BeamAnimationState.FADING_OUT) {
			for (const cubelet of this.visualizer.situation.cubeRealisation.getCubelets()) {
				cubelet.setState(this.newStatesByInitialLocation.get(Utils.vectorId(cubelet.initialLocation))!);
			}
			this.state = BeamAnimationState.FADING_IN;
		}

		if (this.currentOpacity + stepOpacity > 1) {

			this.visualizer.canvas.style.opacity = '1';
			this.state = BeamAnimationState.FINISHED;

			this.resolve();

		} else {

			this.currentOpacity += stepOpacity;
			this.visualizer.canvas.style.opacity = Math.abs(this.currentOpacity).toString();

		}

	}

}