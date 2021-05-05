import { EventSource } from "./EventSource";

/**
 * Data of a triggered {@link Event} and received by a {@link EventListener}
 */
export interface EventData {

	/**
	 * Arbitrary information added by the triggerer
	 */
	readonly source?: EventSource

}