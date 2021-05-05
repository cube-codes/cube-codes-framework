import { EventData } from "@cube-codes/cube-codes-model";

/**
 * Data describing the event of moving within the {@link CubeHistory}
 */
export interface CubeHistoryMoved extends EventData {

	/**
	 * Current position within the {@link CubeHistory} before the move
	 */
	readonly from: number

	/**
	 * Signed count of {@link CubeHistoryChange}s within the {@link CubeHistory} that are stepped over by the move (= to - from)
	 */
	readonly by: number

	/**
	 * Current position within the {@link CubeHistory} after the move
	 */
	readonly to: number

}