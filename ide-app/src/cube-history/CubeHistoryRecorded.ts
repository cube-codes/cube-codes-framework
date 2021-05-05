import { EventData } from "@cube-codes/cube-codes-model";
import { CubeHistoryChange } from "./CubeHistoryChange";

/**
 * Data describing the event of recording a new {@link CubeHistoryChange} within the {@link CubeHistory}
 */
export interface CubeHistoryRecorded extends EventData {

	/**
	 * {@link CubeHistoryChange} that was recorded 
	 */
	readonly change: CubeHistoryChange

	/**
	 * Index of the newly recorded {@link CubeHistoryChange} within the {@link CubeHistory} and the new current position
	 */
	readonly position: number

}