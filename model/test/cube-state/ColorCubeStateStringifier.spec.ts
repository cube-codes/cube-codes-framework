import { CubeSpecification, CubeSolutionCondition, CubeSolutionConditionType, Cube, ColorCubeStateStringifier } from '../../src';
import { CubeApi } from '../CubeApi';

test('Basic Test', () => {

	const spec = new CubeSpecification(3);
	const solv = new CubeSolutionCondition(CubeSolutionConditionType.COLOR);
	const cube = new Cube(spec, solv);
	const cubeApi = new CubeApi(cube);
	const colorCubeStateStringifier = new ColorCubeStateStringifier(spec);

	//How does the solved cube look? 
	//const cubeStateString1 = colorCubeStateStringifier.stringify(cube.getState());
	//console.log(cubeStateString1);

	//How does the solved cube look? 
	cubeApi.right();
	const cubeStateString2 = colorCubeStateStringifier.stringify(cube.getState());
	//console.log(cubeStateString2);

	//Can I parse it back to the cube?
	const cube2 = new Cube(spec, solv);
	const cube2Api = new CubeApi(cube2);
	cube2.setState(colorCubeStateStringifier.parse(cubeStateString2));
	cube2Api.right(1, 3);
	expect(cube2.isSolved());

});