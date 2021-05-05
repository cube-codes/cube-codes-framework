import { EventData } from "@cube-codes/cube-codes-model";
import { UiState } from "./UiState";

export interface UiStateChanged extends EventData {
	readonly oldState: UiState
	readonly newState: UiState
}