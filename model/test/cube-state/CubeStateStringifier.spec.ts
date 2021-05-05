import { CubeSpecification, CubeStateStringifier, CubeState } from "../../src";

const spec8 = new CubeSpecification(8);
const css8 = new CubeStateStringifier(spec8);

test('Simple stringify and parse of solved cube', () => {

	const state = CubeState.fromSolved(spec8);
	const exportValue = css8.stringify(state);
	expect(css8.parse(exportValue)).toEqual(state);

});