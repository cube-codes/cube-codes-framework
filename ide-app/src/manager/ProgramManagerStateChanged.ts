import { EventData } from "@cube-codes/cube-codes-model";
import { ProgramManagerState } from "./ProgramManagerState";

export interface ProgramManagerStateChanged extends EventData {
	readonly oldState: ProgramManagerState
	readonly newState: ProgramManagerState
}