import { CubeState } from '../cube-state/CubeState';
import { Cubelet } from './Cubelet';
import { CubeMove } from "../cube-move/CubeMove";
import { CubeSpecification } from "../cube-geometry/CubeSpecification";
import { Event } from "../event/Event";
import { CubePartType } from "../cube-geometry/CubePartType";
import { CubePart } from "../cube-geometry/CubePart";
import { CubeStateChanged } from "./CubeStateChanged";
import { CubeletLocation } from "./CubeletLocation";
import { CubeSolutionCondition } from "./CubeSolutionCondition";
import { CubeletState } from "../cube-state/CubeletState";
import { CubeletOrientation } from "./CubeletOrientation";
import { ReadonlyCubelet } from "./ReadonlyCubelet";
import { Dimension } from '../linear-algebra/Dimension';
import { Vector } from '../linear-algebra/Vector';
import { Matrix } from '../linear-algebra/Matrix';
import { EventSource } from '../event/EventSource';

export class Cube {

	/**
	 * @event
	 */
	readonly stateChanged = new Event<CubeStateChanged>();

	readonly #cubelets: ReadonlyArray<Cubelet>

	constructor(readonly spec: CubeSpecification, readonly solutionCondition: CubeSolutionCondition, state?: CubeState) {

		const cubelets = new Array<Cubelet>();
		for (const cubePartType of CubePartType.getAll()) {
			for (const cubePart of CubePart.getByType(cubePartType)) {
				for (const cubeletLocation of CubeletLocation.fromPart(spec, cubePart)) {
					cubelets.push(new Cubelet(this, cubeletLocation));
				}
			}
		}
		this.#cubelets = cubelets;

		if (state) {
			this.setState(state);
		}

	}

	clone(): Cube {
		return new Cube(this.spec, this.solutionCondition, this.getState());
	}

	get cubelets(): ReadonlyArray<ReadonlyCubelet> {
		return this.#cubelets;
	}

	isSolved(): boolean {
		return this.solutionCondition.isCubeSolved(this);
	}

	getState(): CubeState {
		const cubelets = new Array<CubeletState>();
		for (const cubelet of this.#cubelets) {
			cubelets.push(new CubeletState(cubelet.initialLocation.origin, cubelet.currentLocation.origin, cubelet.currentOrientation.matrix));
		}
		return new CubeState(this.spec, cubelets);
	}

	async setState(newState: CubeState, source?: EventSource): Promise<Cube> {

		//TODO: More validation? Depends on validation in cubeState

		const oldState = this.getState();

		for (let cubeletState of newState.cubelets) {
			for (let cubelet of this.#cubelets) {
				if (cubelet.initialLocation.origin.equals(cubeletState.initialLocation)) {
					cubelet.beam(new CubeletLocation(this.spec, cubeletState.location), new CubeletOrientation(cubeletState.orientation));
				}
			}
		}

		await this.stateChanged.trigger({ oldState: oldState, newState: newState, source: source });

		return this;

	}

	async move(move: CubeMove, source?: EventSource): Promise<Cube> {

		const oldState = this.getState();

		const dimension = move.face.dimension;
		const componentMaximum = (this.spec.edgeLength - 1) / 2;
		const startSliceComponent = (componentMaximum - (move.sliceStart - 1)) * (move.face.positiveDirection ? 1 : -1); // sliceStart is one-based
		const angle = (((move.angle * (move.face.positiveDirection ? 1 : -1) * -1) % 4) + 4) % 4; // rotateSlice rotates CCW

		let sliceComponent = startSliceComponent;
		for (let sliceIndex = 0; sliceIndex <= move.sliceEnd - move.sliceStart; sliceIndex++) {
			for (let angleIndex = 0; angleIndex < angle; angleIndex++) {
				for (let cubelet of this.#cubelets) {
					if (cubelet.currentLocation.origin.componentEquals(dimension, sliceComponent)) {
						cubelet.rotate(dimension);
					}
				}
			}
			sliceComponent += move.face.positiveDirection ? -1 : 1;
		}

		await this.stateChanged.trigger({ oldState: oldState, newState: this.getState(), move: move, source: source });

		return this;

	}

	getPerspectiveFromFaceMids(): CubeletOrientation {
		const maxComponent = this.spec.edgeLength / 2 - 0.5;
		if (this.spec.edgeLength % 2 === 0) throw Error('getPerspectiveFromFaceMids() only implemented for odd cubes');
		const from = Dimension.getAll().map(d => Vector.fromComponent(d, maxComponent));
		const to = Dimension.getAll().map(d => this.#cubelets.filter(c => c.initialLocation.origin.equals(from[d.index]))[0].currentLocation.origin);
		return new CubeletOrientation(Matrix.forBaseChange(from, to));
	}


}