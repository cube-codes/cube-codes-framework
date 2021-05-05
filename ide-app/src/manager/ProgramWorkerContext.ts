import { Ui } from "../ui/Ui";
import { ProgramWorkerContextMessageBus } from "./ProgramWorkerContextMessageBus";

export class ProgramWorkerContext {

	private readonly worker: Worker

	readonly messageBus: ProgramWorkerContextMessageBus

	constructor(readonly ui: Ui) {
		if (!Worker) throw new Error('Worker not available');
		this.worker = new Worker(`${this.ui.settings.workerDirectory}/worker.js`);
		this.messageBus = new ProgramWorkerContextMessageBus(this.worker);
	}

	terminate() {
		this.worker.terminate();
	}

}