import { EventData } from "@cube-codes/cube-codes-model";

/**
 * Data describing the event of cleaning some future of {@link CubeHistoryChange}s within the {@link CubeHistory}
 * 
 * The state of "after" was marked as the current position if the former was removed.
 * 
 * This can happen when a new {@link CubeHistoryChange} is recorded while the current position of the {@link CubeHistory} is not at its end. As the history cannot hold multiple branches the old one has to be removed.
 */
export interface CubeHistoryFutureCleaned extends EventData {

	/**
	 * Index of the {@link CubeHistoryChange}s within the {@link CubeHistory} that the cleaning starts from (all further changes were removed)
	 */
	readonly after: number

}