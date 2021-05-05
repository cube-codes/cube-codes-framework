import { EventData } from "@cube-codes/cube-codes-model";
import { CubeHistoryState } from "./CubeHistoryState";

export interface CubeHistoryStateChanged extends EventData {
	readonly oldState: CubeHistoryState
	readonly newState: CubeHistoryState
}