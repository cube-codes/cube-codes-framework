import { EventData, Event } from "../../src";

interface ClickData extends EventData {
	readonly text1: string
}

interface DblClickData extends EventData {
	readonly text2: string
}

class Button {

	readonly clickEvent = new Event<ClickData>()
	readonly dblclickEvent = new Event<DblClickData>()
	
	click(): void {
		this.clickEvent.trigger({text1: '1'});
	}
	
	dblclick(): void {
		this.dblclickEvent.trigger({text2: '2'});
	}
	
}

test('Click & DblClick once', () => {

	const b = new Button();
	let clickResult = undefined;
	let dblclickResult = undefined;
	b.clickEvent.on(e => { clickResult = e.text1 });
	b.dblclickEvent.on(e => { dblclickResult = e.text2 });
	b.click();
	b.dblclick();

	expect(clickResult).toEqual('1');
	expect(dblclickResult).toEqual('2');

});