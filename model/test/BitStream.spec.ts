import { BitInputStream, BitOutputStream } from '@thi.ng/bitstream'

test('Dummy Test', () => {

	const outputStream = new BitOutputStream();
	outputStream.writeWords([0b1, 0b11111111111111111111, 0b110111], 20);
	expect(outputStream.reader().readWords(60, 1).map(n => n.toString()).join('')).toEqual('000000000000000000011111111111111111111100000000000000110111');

	const outputArray = outputStream.bytes();
	expect(outputArray).toEqual(new Uint8Array([0, 0, 31, 255, 255, 0, 3, 112]));

	const exportValue = String.fromCodePoint(...outputArray);
	expect(exportValue.length).toEqual(8);

	const importArray = Uint8Array.from(exportValue, c => c.charCodeAt(0));
	expect(importArray).toEqual(new Uint8Array([0, 0, 31, 255, 255, 0, 3, 112]));

	const inputStream = new BitInputStream(importArray);
	expect(inputStream.readWords(3, 20)).toEqual([0b1, 0b11111111111111111111, 0b110111]);

});