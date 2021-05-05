import { MessageData } from "./MessageData";
import { MessageListener } from "./MessageListener";

/**
 * Gateway enabling to receive a message with {@link MessageData} and holding registered {@link MessageListener}s
 * @typeParam M - {@link MessageData} of the message that is listened for
 */
export class MessageInbox<M extends MessageData<any>> {

	/**
	 * List of all registered listeners for this message
	 */
	readonly #listeners = new Array<MessageListener<M>>();

	constructor(readonly type: string) {}

	/**
	 * Relays a message if the channel id fits and thus executes the callback function of all registered {@link MessageListener}s
	 * @param messageData - Data of the sent message
	 */
	tryRelay(messageData: M): void {
		if(messageData.type !== this.type) { return; }
		this.#listeners.forEach(listener => listener.call({}, messageData));
	}

	/**
	 * Registeres a new {@link MessageListener} for that message
	 * @param listener - {@link MessageListener} to be registered
	 */
	on(listener: MessageListener<M>): void {
		this.#listeners.push(listener);
	}

}