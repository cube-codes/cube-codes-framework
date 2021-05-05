import { MessageData } from "./MessageData";

/**
 * Handler that receives {@link MessageData} managed by a {@link MessageInbox}
 * @typeParam M - {@link MessageData} that is listened for
 */
export interface MessageListener<M extends MessageData<any>> {

	/**
	 * Function call
	 * @param m - Message data that is worked on
	 */
	(m: M): void

}