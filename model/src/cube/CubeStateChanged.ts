import { CubeMove } from "../cube-move/CubeMove";
import { CubeState } from "../cube-state/CubeState";
import { EventData } from "../event/EventData";

export interface CubeStateChanged extends EventData {
	readonly oldState: CubeState
	readonly newState: CubeState
	readonly move?: CubeMove
}