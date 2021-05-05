import { EventData } from "./EventData";

/**
 * Handler that receives {@link EventData} of a triggered {@link Event}
 * @typeParam E - {@link EventData} of the {@link Event} that is listened for
 */
export interface EventListener<E extends EventData> {

	/**
	 * Function call
	 * @param e - Event data that is worked on
	 */
	(e: E): Promise<void> | void

}