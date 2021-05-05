/**
 * Data for a {@link MessageInbox} and received by a {@link MessageListener}
 */
export interface MessageData<MessageType> {

	readonly type: MessageType

	readonly id: string
 
}