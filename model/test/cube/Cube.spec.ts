import { CubeApi } from '../CubeApi';
import { CubeFace, Cube, Cubelet, CubeletLocation, CubePart, CubeSolutionCondition, CubeSolutionConditionType, CubeSpecification, Dimension, Matrix, Vector } from '../../src';

test('Simple Move', () => {

	const spec = new CubeSpecification(4);
	const solv = new CubeSolutionCondition(CubeSolutionConditionType.STRICT);
	const cube = new Cube(spec, solv);
	const cubeApi = new CubeApi(cube);
	cubeApi.front();
	expect(cubeApi.cubelets.initiallyAtOrigin(Vector.fromComponents(1.5, 1.5, 1.5)).findOne().currentLocation.origin).toEqual(Vector.fromComponents(1.5, -1.5, 1.5));
	expect(cubeApi.cubelets.initiallyAtOrigin(Vector.fromComponents(1.5, 1.5, -1.5)).findOne().currentLocation.origin).toEqual(Vector.fromComponents(1.5, 1.5, -1.5));

});

test('Solution Condition', () => {

	const spec = new CubeSpecification(3);
	const solv1 = new CubeSolutionCondition(CubeSolutionConditionType.STRICT);
	const cube1 = new Cube(spec, solv1);
	const cube1Api = new CubeApi(cube1);
	//Rotate complete cube on the front clockwise
	cube1Api.z();
	//without using getPerspectiveFromFaceMids()
	expect(cube1.isSolved());
	//with using getPerspectiveFromFaceMids()
	const perspectiveFromFaceMids=cube1.getPerspectiveFromFaceMids()
	expect(perspectiveFromFaceMids.toString()).toEqual("((0,1,0),(-1,0,0),(0,0,1))");
	expect(solv1.isCubeSolvedFromPerspective(cube1,perspectiveFromFaceMids));
	const atUF=cube1Api.cubelets.currentlyInPart(CubePart.UF).findOne();
	expect(atUF.initialLocation.part).toEqual(CubePart.LF);
	expect(atUF.solvedLocation.part).toEqual(CubePart.UF);
	expect(atUF.getColorAt(CubeFace.UP)).toEqual(CubeFace.LEFT);
	//THROWS AN EXCEPTION (TODO TEST) expect(atUF.getColorAt(CubeFace.DOWN)).toEqual(CubeFace.LEFT);
	////
	//Demonstrate different behaviour of the different solution conditions
	const solv2 = new CubeSolutionCondition(CubeSolutionConditionType.COLOR);
	const cube2 = new Cube(spec, solv2);
	const cube2Api = new CubeApi(cube2);
	cube2Api.z();
	//same cubes, different solv
	expect(cube1.isSolved());
	expect(cube2.isSolved());
	//Rotate orientation of element at right face 
	cube1Api.cubelets.currentlyAtOrigin(new Vector([1,0,0])).findOne().currentOrientation.rotate(Dimension.X);
	cube2Api.cubelets.currentlyAtOrigin(new Vector([1,0,0])).findOne().currentOrientation.rotate(Dimension.X);
	//different results
	expect(!cube1.isSolved());
	expect(cube2.isSolved());
	//TODO The other different behaviour: N=4 with two same edges switched 
});

test('Basic Test', () => {

	const spec = new CubeSpecification(4);
	const solv = new CubeSolutionCondition(CubeSolutionConditionType.STRICT);
	const uf2 = CubeletLocation.fromPartAndOriginComponentsInPartDimensions(spec, CubePart.UF, [0.5]);

	// Is the cubelet location origin correctly calculated
	expect(uf2.origin).toEqual(Vector.fromComponents(0.5, 1.5, 1.5));

	const uf2cubelet = new Cubelet(new Cube(spec, solv), uf2);

	// Is the origin still visible in the cubelet?
	expect(uf2cubelet.initialLocation.origin).toEqual(Vector.fromComponents(0.5, 1.5, 1.5));
	expect(uf2cubelet.currentLocation.origin).toEqual(Vector.fromComponents(0.5, 1.5, 1.5));

	uf2cubelet.rotate(Dimension.Y);

	// Does it keep the initial location?
	expect(uf2cubelet.initialLocation.origin).toEqual(Vector.fromComponents(0.5, 1.5, 1.5));
	// Does it change the location correctly?
	expect(uf2cubelet.currentLocation.origin).toEqual(Vector.fromComponents(1.5, 1.5, -0.5));
	// Does the function 

	///////////////////////////
	//Reorientation

	//Is a BaseChange from given vectors identified correctly 
	const LDB_to_LFD = Matrix.forBaseChange([Vector.fromComponents(1, 0, 0), Vector.fromComponents(0, 1, 0), Vector.fromComponents(0, 0, 1)], [Vector.fromComponents(1, 0, 0), Vector.fromComponents(0, 0, -1), Vector.fromComponents(0, 1, 0)]);
	expect(LDB_to_LFD.toString()).toEqual('((1,0,0),(0,0,1),(0,-1,0))');
	//....Test Reorientaion

	///////////////////////////
	// Rotation Cube
	const cube = new Cube(spec, solv);
	const cubeApi = new CubeApi(cube);
	cubeApi.right();
	//console.log(cube.toString());
	expect(cubeApi.cubelets.initiallyAtOrigin(Vector.fromComponents(1.5, 1.5, 1.5)).findOne().currentLocation.origin).toEqual(Vector.fromComponents(1.5, 1.5, -1.5));
	expect(cubeApi.cubelets.initiallyAtOrigin(Vector.fromComponents(0.5, 1.5, 1.5)).findOne().currentLocation.origin).toEqual(Vector.fromComponents(0.5, 1.5, 1.5));

});