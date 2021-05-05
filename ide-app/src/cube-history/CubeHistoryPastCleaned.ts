import { EventData } from "@cube-codes/cube-codes-model";

/**
 * Data describing the event of cleaning some past of {@link CubeHistoryChange}s within the {@link CubeHistory}
 * 
 * The initial state was set to the final state of "before" and was marked as the current position if the former was removed.
 */
export interface CubeHistoryPastCleaned extends EventData {

	/**
	 * Index of the {@link CubeHistoryChange}s within the {@link CubeHistory} that the cleaning ends with (all previous changes were removed)
	 */
	readonly before: number

}