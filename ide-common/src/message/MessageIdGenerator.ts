export class MessageIdGenerator {

	static generate(): string {
		return Math.floor(Math.random() * Math.pow(10, 20)).toString();
	}

}