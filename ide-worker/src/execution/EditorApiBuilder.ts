import { EditorApi } from "./EditorApi";

export class EditorApiBuilder {

	private static addReadonlyProperty(name: string, value: any): void {
		Object.defineProperty(self, name, {
			configurable: false,
			enumerable: false,
			value: value,
			writable: false
		});
	}

	static set(editorApi: EditorApi) {
		Object.entries(editorApi).forEach(([key, value]) => EditorApiBuilder.addReadonlyProperty(key, value));
	}

}