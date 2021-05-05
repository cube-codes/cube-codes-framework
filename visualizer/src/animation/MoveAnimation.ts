import { Animation } from './Animation'
import { Quaternion, Vector3 } from 'three'
import { CubeStateChanged, CubeletState } from '@cube-codes/cube-codes-model'
import { Utils } from '../Utils'
import { CubeVisualizer } from '../CubeVisualizer'
import { CubeletRealisation } from '../CubeletRealisation'

export enum MoveAnimationState {
	PENDING,
	MOVING,
	FINISHED
}

export class MoveAnimation implements Animation {

	private readonly newStatesByInitialLocation: ReadonlyMap<string, CubeletState>

	private readonly cubeletsThatWillChange: ReadonlyArray<CubeletRealisation>

	private readonly axis: Vector3

	private readonly fullAngle: number

	private state: MoveAnimationState

	private currentAngle: number // from 0 to fullAngle (can be negative)

	constructor(private readonly visualizer: CubeVisualizer, private readonly stateChanged: CubeStateChanged, private readonly resolve: (value: void | PromiseLike<void>) => void) {

		this.newStatesByInitialLocation = stateChanged.newState.cubelets.reduce((mm, cs) => mm.set(Utils.vectorId(cs.initialLocation), cs), new Map<string, CubeletState>());
		this.cubeletsThatWillChange = stateChanged.oldState.cubelets.filter(cs => !cs.equals(this.newStatesByInitialLocation.get(Utils.vectorId(cs.initialLocation))!)).map(cs => visualizer.situation.cubeRealisation.getCubelet(cs.initialLocation)!);

		const move = this.stateChanged.move!;
		this.axis = new Vector3(0, 0, 0).setComponent(move.face.dimension.index, move.face.positiveDirection ? 1 : -1);
		this.fullAngle = move.angle * -1 * Math.PI / 2;

		this.state = MoveAnimationState.PENDING;
		this.currentAngle = 0;

	}

	isFinished(): boolean {
		return this.state === MoveAnimationState.FINISHED;
	}

	step(timePast: number): void {
		
		if(this.state === MoveAnimationState.PENDING) {
			this.state = MoveAnimationState.MOVING;
		}

		const stepAngle = this.fullAngle * (this.stateChanged.source?.animation === false ? 1 : timePast / this.visualizer.animationDuration);

		if (Math.abs(this.currentAngle + stepAngle) > Math.abs(this.fullAngle)) {

			for (const cubelet of this.cubeletsThatWillChange) {
				cubelet.setState(this.newStatesByInitialLocation.get(Utils.vectorId(cubelet.initialLocation))!);
			}
			this.state = MoveAnimationState.FINISHED;

			this.resolve();

		} else {

			this.currentAngle += stepAngle;
			const transformation = new Quaternion().setFromAxisAngle(this.axis, stepAngle);
			for (const cubelet of this.cubeletsThatWillChange) {
				cubelet.applyQuaternion(transformation);
				cubelet.position.applyQuaternion(transformation);
			}

		}

	}

}