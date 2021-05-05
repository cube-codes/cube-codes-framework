import { CubeSpecification, CubeMoveStringifier, CubeMove, CubeFace } from "../../src";

const spec3 = new CubeSpecification(3);
const spec8 = new CubeSpecification(8);
const cms3 = new CubeMoveStringifier(spec3);
const cms8 = new CubeMoveStringifier(spec8);

test('Single Face Move Parse Test', () => {

	expect(cms3.parse('R')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 1, 1)]);
	expect(cms3.parse('U')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 1, 1)]);
	expect(cms3.parse('F')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 1, 1)]);
	expect(cms3.parse('L')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 1, 1)]);
	expect(cms3.parse('D')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 1, 1)]);
	expect(cms3.parse('B')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 1, 1)]);

	expect(cms3.parse('R2')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 1, 2)]);
	expect(cms3.parse('U2')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 1, 2)]);
	expect(cms3.parse('F2')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 1, 2)]);
	expect(cms3.parse('L2')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 1, 2)]);
	expect(cms3.parse('D2')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 1, 2)]);
	expect(cms3.parse('B2')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 1, 2)]);

	expect(cms3.parse('R\'')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 1, -1)]);
	expect(cms3.parse('U\'')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 1, -1)]);
	expect(cms3.parse('F\'')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 1, -1)]);
	expect(cms3.parse('L\'')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 1, -1)]);
	expect(cms3.parse('D\'')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 1, -1)]);
	expect(cms3.parse('B\'')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 1, -1)]);

});

test('Single Outer Block Move (default slices) Parse Test', () => {

	expect(cms3.parse('Rw')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, 1)]);
	expect(cms3.parse('Uw')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 2, 1)]);
	expect(cms3.parse('Fw')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 2, 1)]);
	expect(cms3.parse('Lw')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 2, 1)]);
	expect(cms3.parse('Dw')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 2, 1)]);
	expect(cms3.parse('Bw')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 2, 1)]);

	expect(cms3.parse('Rw2')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, 2)]);
	expect(cms3.parse('Uw2')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 2, 2)]);
	expect(cms3.parse('Fw2')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 2, 2)]);
	expect(cms3.parse('Lw2')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 2, 2)]);
	expect(cms3.parse('Dw2')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 2, 2)]);
	expect(cms3.parse('Bw2')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 2, 2)]);

	expect(cms3.parse('Rw\'')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, -1)]);
	expect(cms3.parse('Uw\'')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 2, -1)]);
	expect(cms3.parse('Fw\'')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 2, -1)]);
	expect(cms3.parse('Lw\'')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 2, -1)]);
	expect(cms3.parse('Dw\'')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 2, -1)]);
	expect(cms3.parse('Bw\'')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 2, -1)]);

	expect(cms3.parse('r')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, 1)]);
	expect(cms3.parse('u')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 2, 1)]);
	expect(cms3.parse('f')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 2, 1)]);
	expect(cms3.parse('l')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 2, 1)]);
	expect(cms3.parse('d')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 2, 1)]);
	expect(cms3.parse('b')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 2, 1)]);

	expect(cms3.parse('r2')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, 2)]);
	expect(cms3.parse('u2')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 2, 2)]);
	expect(cms3.parse('f2')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 2, 2)]);
	expect(cms3.parse('l2')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 2, 2)]);
	expect(cms3.parse('d2')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 2, 2)]);
	expect(cms3.parse('b2')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 2, 2)]);

	expect(cms3.parse('r\'')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, -1)]);
	expect(cms3.parse('u\'')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 2, -1)]);
	expect(cms3.parse('f\'')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 2, -1)]);
	expect(cms3.parse('l\'')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 2, -1)]);
	expect(cms3.parse('d\'')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 2, -1)]);
	expect(cms3.parse('b\'')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 2, -1)]);

});

test('Single Outer Block Move (1 slice) Parse Test', () => {

	expect(cms3.parse('1Rw')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 1, 1)]);
	expect(cms3.parse('1Uw')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 1, 1)]);
	expect(cms3.parse('1Fw')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 1, 1)]);
	expect(cms3.parse('1Lw')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 1, 1)]);
	expect(cms3.parse('1Dw')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 1, 1)]);
	expect(cms3.parse('1Bw')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 1, 1)]);

	expect(cms3.parse('1Rw2')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 1, 2)]);
	expect(cms3.parse('1Uw2')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 1, 2)]);
	expect(cms3.parse('1Fw2')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 1, 2)]);
	expect(cms3.parse('1Lw2')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 1, 2)]);
	expect(cms3.parse('1Dw2')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 1, 2)]);
	expect(cms3.parse('1Bw2')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 1, 2)]);

	expect(cms3.parse('1Rw\'')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 1, -1)]);
	expect(cms3.parse('1Uw\'')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 1, -1)]);
	expect(cms3.parse('1Fw\'')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 1, -1)]);
	expect(cms3.parse('1Lw\'')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 1, -1)]);
	expect(cms3.parse('1Dw\'')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 1, -1)]);
	expect(cms3.parse('1Bw\'')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 1, -1)]);

	expect(cms3.parse('1r')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 1, 1)]);
	expect(cms3.parse('1u')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 1, 1)]);
	expect(cms3.parse('1f')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 1, 1)]);
	expect(cms3.parse('1l')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 1, 1)]);
	expect(cms3.parse('1d')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 1, 1)]);
	expect(cms3.parse('1b')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 1, 1)]);

	expect(cms3.parse('1r2')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 1, 2)]);
	expect(cms3.parse('1u2')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 1, 2)]);
	expect(cms3.parse('1f2')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 1, 2)]);
	expect(cms3.parse('1l2')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 1, 2)]);
	expect(cms3.parse('1d2')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 1, 2)]);
	expect(cms3.parse('1b2')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 1, 2)]);

	expect(cms3.parse('1r\'')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 1, -1)]);
	expect(cms3.parse('1u\'')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 1, -1)]);
	expect(cms3.parse('1f\'')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 1, -1)]);
	expect(cms3.parse('1l\'')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 1, -1)]);
	expect(cms3.parse('1d\'')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 1, -1)]);
	expect(cms3.parse('1b\'')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 1, -1)]);

});

test('Single Outer Block Move (2 slices) Parse Test', () => {

	expect(cms3.parse('2Rw')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, 1)]);
	expect(cms3.parse('2Uw')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 2, 1)]);
	expect(cms3.parse('2Fw')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 2, 1)]);
	expect(cms3.parse('2Lw')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 2, 1)]);
	expect(cms3.parse('2Dw')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 2, 1)]);
	expect(cms3.parse('2Bw')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 2, 1)]);

	expect(cms3.parse('2Rw2')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, 2)]);
	expect(cms3.parse('2Uw2')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 2, 2)]);
	expect(cms3.parse('2Fw2')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 2, 2)]);
	expect(cms3.parse('2Lw2')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 2, 2)]);
	expect(cms3.parse('2Dw2')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 2, 2)]);
	expect(cms3.parse('2Bw2')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 2, 2)]);

	expect(cms3.parse('2Rw\'')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, -1)]);
	expect(cms3.parse('2Uw\'')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 2, -1)]);
	expect(cms3.parse('2Fw\'')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 2, -1)]);
	expect(cms3.parse('2Lw\'')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 2, -1)]);
	expect(cms3.parse('2Dw\'')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 2, -1)]);
	expect(cms3.parse('2Bw\'')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 2, -1)]);

	expect(cms3.parse('2r')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, 1)]);
	expect(cms3.parse('2u')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 2, 1)]);
	expect(cms3.parse('2f')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 2, 1)]);
	expect(cms3.parse('2l')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 2, 1)]);
	expect(cms3.parse('2d')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 2, 1)]);
	expect(cms3.parse('2b')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 2, 1)]);

	expect(cms3.parse('2r2')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, 2)]);
	expect(cms3.parse('2u2')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 2, 2)]);
	expect(cms3.parse('2f2')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 2, 2)]);
	expect(cms3.parse('2l2')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 2, 2)]);
	expect(cms3.parse('2d2')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 2, 2)]);
	expect(cms3.parse('2b2')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 2, 2)]);

	expect(cms3.parse('2r\'')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, -1)]);
	expect(cms3.parse('2u\'')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 2, -1)]);
	expect(cms3.parse('2f\'')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 2, -1)]);
	expect(cms3.parse('2l\'')).toEqual([new CubeMove(spec3, CubeFace.LEFT, 1, 2, -1)]);
	expect(cms3.parse('2d\'')).toEqual([new CubeMove(spec3, CubeFace.DOWN, 1, 2, -1)]);
	expect(cms3.parse('2b\'')).toEqual([new CubeMove(spec3, CubeFace.BACK, 1, 2, -1)]);

});

test('Single Outer Block Move (6 slices, Octocube) Parse Test', () => {

	expect(cms8.parse('6Rw')).toEqual([new CubeMove(spec8, CubeFace.RIGHT, 1, 6, 1)]);
	expect(cms8.parse('6Uw')).toEqual([new CubeMove(spec8, CubeFace.UP, 1, 6, 1)]);
	expect(cms8.parse('6Fw')).toEqual([new CubeMove(spec8, CubeFace.FRONT, 1, 6, 1)]);
	expect(cms8.parse('6Lw')).toEqual([new CubeMove(spec8, CubeFace.LEFT, 1, 6, 1)]);
	expect(cms8.parse('6Dw')).toEqual([new CubeMove(spec8, CubeFace.DOWN, 1, 6, 1)]);
	expect(cms8.parse('6Bw')).toEqual([new CubeMove(spec8, CubeFace.BACK, 1, 6, 1)]);

	expect(cms8.parse('6Rw2')).toEqual([new CubeMove(spec8, CubeFace.RIGHT, 1, 6, 2)]);
	expect(cms8.parse('6Uw2')).toEqual([new CubeMove(spec8, CubeFace.UP, 1, 6, 2)]);
	expect(cms8.parse('6Fw2')).toEqual([new CubeMove(spec8, CubeFace.FRONT, 1, 6, 2)]);
	expect(cms8.parse('6Lw2')).toEqual([new CubeMove(spec8, CubeFace.LEFT, 1, 6, 2)]);
	expect(cms8.parse('6Dw2')).toEqual([new CubeMove(spec8, CubeFace.DOWN, 1, 6, 2)]);
	expect(cms8.parse('6Bw2')).toEqual([new CubeMove(spec8, CubeFace.BACK, 1, 6, 2)]);

	expect(cms8.parse('6Rw\'')).toEqual([new CubeMove(spec8, CubeFace.RIGHT, 1, 6, -1)]);
	expect(cms8.parse('6Uw\'')).toEqual([new CubeMove(spec8, CubeFace.UP, 1, 6, -1)]);
	expect(cms8.parse('6Fw\'')).toEqual([new CubeMove(spec8, CubeFace.FRONT, 1, 6, -1)]);
	expect(cms8.parse('6Lw\'')).toEqual([new CubeMove(spec8, CubeFace.LEFT, 1, 6, -1)]);
	expect(cms8.parse('6Dw\'')).toEqual([new CubeMove(spec8, CubeFace.DOWN, 1, 6, -1)]);
	expect(cms8.parse('6Bw\'')).toEqual([new CubeMove(spec8, CubeFace.BACK, 1, 6, -1)]);

	expect(cms8.parse('6r')).toEqual([new CubeMove(spec8, CubeFace.RIGHT, 1, 6, 1)]);
	expect(cms8.parse('6u')).toEqual([new CubeMove(spec8, CubeFace.UP, 1, 6, 1)]);
	expect(cms8.parse('6f')).toEqual([new CubeMove(spec8, CubeFace.FRONT, 1, 6, 1)]);
	expect(cms8.parse('6l')).toEqual([new CubeMove(spec8, CubeFace.LEFT, 1, 6, 1)]);
	expect(cms8.parse('6d')).toEqual([new CubeMove(spec8, CubeFace.DOWN, 1, 6, 1)]);
	expect(cms8.parse('6b')).toEqual([new CubeMove(spec8, CubeFace.BACK, 1, 6, 1)]);

	expect(cms8.parse('6r2')).toEqual([new CubeMove(spec8, CubeFace.RIGHT, 1, 6, 2)]);
	expect(cms8.parse('6u2')).toEqual([new CubeMove(spec8, CubeFace.UP, 1, 6, 2)]);
	expect(cms8.parse('6f2')).toEqual([new CubeMove(spec8, CubeFace.FRONT, 1, 6, 2)]);
	expect(cms8.parse('6l2')).toEqual([new CubeMove(spec8, CubeFace.LEFT, 1, 6, 2)]);
	expect(cms8.parse('6d2')).toEqual([new CubeMove(spec8, CubeFace.DOWN, 1, 6, 2)]);
	expect(cms8.parse('6b2')).toEqual([new CubeMove(spec8, CubeFace.BACK, 1, 6, 2)]);

	expect(cms8.parse('6r\'')).toEqual([new CubeMove(spec8, CubeFace.RIGHT, 1, 6, -1)]);
	expect(cms8.parse('6u\'')).toEqual([new CubeMove(spec8, CubeFace.UP, 1, 6, -1)]);
	expect(cms8.parse('6f\'')).toEqual([new CubeMove(spec8, CubeFace.FRONT, 1, 6, -1)]);
	expect(cms8.parse('6l\'')).toEqual([new CubeMove(spec8, CubeFace.LEFT, 1, 6, -1)]);
	expect(cms8.parse('6d\'')).toEqual([new CubeMove(spec8, CubeFace.DOWN, 1, 6, -1)]);
	expect(cms8.parse('6b\'')).toEqual([new CubeMove(spec8, CubeFace.BACK, 1, 6, -1)]);

});

test('Single Rotation Move Parse Test', () => {

	expect(cms3.parse('x')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 3, 1)]);
	expect(cms3.parse('y')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 3, 1)]);
	expect(cms3.parse('z')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 3, 1)]);

	expect(cms3.parse('x2')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 3, 2)]);
	expect(cms3.parse('y2')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 3, 2)]);
	expect(cms3.parse('z2')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 3, 2)]);

	expect(cms3.parse('x\'')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 1, 3, -1)]);
	expect(cms3.parse('y\'')).toEqual([new CubeMove(spec3, CubeFace.UP, 1, 3, -1)]);
	expect(cms3.parse('z\'')).toEqual([new CubeMove(spec3, CubeFace.FRONT, 1, 3, -1)]);

});

test('Multi Move Parse Test', () => {

	expect(cms3.parse('3R 2Fw\' Fw U2 U U')).toEqual([new CubeMove(spec3, CubeFace.RIGHT, 3, 3, 1), new CubeMove(spec3, CubeFace.FRONT, 1, 2, -1), new CubeMove(spec3, CubeFace.FRONT, 1, 2, 1), new CubeMove(spec3, CubeFace.UP, 1, 1, 2), new CubeMove(spec3, CubeFace.UP, 1, 1, 1), new CubeMove(spec3, CubeFace.UP, 1, 1, 1)]);
	expect(cms8.parse('2-4r3\' m8 M2\'')).toEqual([new CubeMove(spec8, CubeFace.RIGHT, 2, 4, -3), new CubeMove(spec8, CubeFace.LEFT, 2, 7, 8)]);

});

test('Complex Parse Test', () => {

	expect(cms3.parse('(2D\' R2)2\'')).toEqual(cms3.parse('R2\' 2D R2\' 2D'));
	expect(cms3.parse('[U: L]')).toEqual(cms3.parse('U L U\''));
	expect(cms3.parse('[U, L]')).toEqual(cms3.parse('U L U\' L\''));

	expect(cms3.parse('[[2U: (R 2D)]2\', L]')).toEqual(cms3.parse('2U 2D\' R\' 2U\' 2U 2D\' R\' 2U\' L 2U R 2D 2U\' 2U R 2D 2U\' L\''));
	expect(cms3.parse('(U3 (3R)\')2\'')).toEqual(cms3.parse('3R U3\' 3R U3\''));

	expect(cms3.parse('M10')).toEqual(cms3.parse('M10'));
	expect(cms3.parse('(M)10')).toEqual(cms3.parse('M M M M M M M M M M'));
	expect(cms3.parse('(U F)3')).toEqual(cms3.parse('U F U F U F'));
	expect(cms3.parse('(U F)10')).toEqual(cms3.parse('U F U F U F U F U F U F U F U F U F U F'));
	expect(cms3.parse('[D,R]28')).toEqual(cms3.parse('[D,R]27 [D,R]'));
	expect(cms8.parse('(M)3\'')).toEqual(cms8.parse(''));
	expect(cms8.parse('[M: L]')).toEqual(cms8.parse('L'));
	expect(cms8.parse('[U, M]')).toEqual(cms8.parse('U U\''));

});

test('Single Face Move Stringify Test', () => {

	expect(cms3.stringify([new CubeMove(spec3, CubeFace.RIGHT, 1, 1, 1)])).toEqual('R');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.UP, 1, 1, 1)])).toEqual('U');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.FRONT, 1, 1, 1)])).toEqual('F');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.LEFT, 1, 1, 1)])).toEqual('L');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.DOWN, 1, 1, 1)])).toEqual('D');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.BACK, 1, 1, 1)])).toEqual('B');

	expect(cms3.stringify([new CubeMove(spec3, CubeFace.RIGHT, 1, 1, 2)])).toEqual('R2');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.UP, 1, 1, 2)])).toEqual('U2');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.FRONT, 1, 1, 2)])).toEqual('F2');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.LEFT, 1, 1, 2)])).toEqual('L2');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.DOWN, 1, 1, 2)])).toEqual('D2');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.BACK, 1, 1, 2)])).toEqual('B2');

	expect(cms3.stringify([new CubeMove(spec3, CubeFace.RIGHT, 1, 1, -1)])).toEqual('R\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.UP, 1, 1, -1)])).toEqual('U\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.FRONT, 1, 1, -1)])).toEqual('F\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.LEFT, 1, 1, -1)])).toEqual('L\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.DOWN, 1, 1, -1)])).toEqual('D\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.BACK, 1, 1, -1)])).toEqual('B\'');

});

test('Single Outer Block Move (2 slice) Stringify Test', () => {

	expect(cms3.stringify([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, 1)])).toEqual('r');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.UP, 1, 2, 1)])).toEqual('u');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.FRONT, 1, 2, 1)])).toEqual('f');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.LEFT, 1, 2, 1)])).toEqual('l');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.DOWN, 1, 2, 1)])).toEqual('d');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.BACK, 1, 2, 1)])).toEqual('b');

	expect(cms3.stringify([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, 2)])).toEqual('r2');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.UP, 1, 2, 2)])).toEqual('u2');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.FRONT, 1, 2, 2)])).toEqual('f2');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.LEFT, 1, 2, 2)])).toEqual('l2');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.DOWN, 1, 2, 2)])).toEqual('d2');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.BACK, 1, 2, 2)])).toEqual('b2');

	expect(cms3.stringify([new CubeMove(spec3, CubeFace.RIGHT, 1, 2, -1)])).toEqual('r\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.UP, 1, 2, -1)])).toEqual('u\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.FRONT, 1, 2, -1)])).toEqual('f\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.LEFT, 1, 2, -1)])).toEqual('l\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.DOWN, 1, 2, -1)])).toEqual('d\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.BACK, 1, 2, -1)])).toEqual('b\'');

});

test('Single Outer Block Move (3 slice, Quadrocube) Stringify Test', () => {

	expect(cms8.stringify([new CubeMove(spec8, CubeFace.RIGHT, 1, 3, 1)])).toEqual('3r');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.UP, 1, 3, 1)])).toEqual('3u');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.FRONT, 1, 3, 1)])).toEqual('3f');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.LEFT, 1, 3, 1)])).toEqual('3l');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.DOWN, 1, 3, 1)])).toEqual('3d');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.BACK, 1, 3, 1)])).toEqual('3b');

	expect(cms8.stringify([new CubeMove(spec8, CubeFace.RIGHT, 1, 3, 2)])).toEqual('3r2');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.UP, 1, 3, 2)])).toEqual('3u2');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.FRONT, 1, 3, 2)])).toEqual('3f2');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.LEFT, 1, 3, 2)])).toEqual('3l2');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.DOWN, 1, 3, 2)])).toEqual('3d2');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.BACK, 1, 3, 2)])).toEqual('3b2');

	expect(cms8.stringify([new CubeMove(spec8, CubeFace.RIGHT, 1, 3, -1)])).toEqual('3r\'');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.UP, 1, 3, -1)])).toEqual('3u\'');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.FRONT, 1, 3, -1)])).toEqual('3f\'');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.LEFT, 1, 3, -1)])).toEqual('3l\'');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.DOWN, 1, 3, -1)])).toEqual('3d\'');
	expect(cms8.stringify([new CubeMove(spec8, CubeFace.BACK, 1, 3, -1)])).toEqual('3b\'');

});

test('Single Rotation Move (3 slice) Stringify Test', () => {

	expect(cms3.stringify([new CubeMove(spec3, CubeFace.RIGHT, 1, 3, 1)])).toEqual('x');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.UP, 1, 3, 1)])).toEqual('y');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.FRONT, 1, 3, 1)])).toEqual('z');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.LEFT, 1, 3, 1)])).toEqual('x\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.DOWN, 1, 3, 1)])).toEqual('y\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.BACK, 1, 3, 1)])).toEqual('z\'');

	expect(cms3.stringify([new CubeMove(spec3, CubeFace.RIGHT, 1, 3, 2)])).toEqual('x2');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.UP, 1, 3, 2)])).toEqual('y2');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.FRONT, 1, 3, 2)])).toEqual('z2');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.LEFT, 1, 3, 2)])).toEqual('x2\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.DOWN, 1, 3, 2)])).toEqual('y2\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.BACK, 1, 3, 2)])).toEqual('z2\'');

	expect(cms3.stringify([new CubeMove(spec3, CubeFace.RIGHT, 1, 3, -1)])).toEqual('x\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.UP, 1, 3, -1)])).toEqual('y\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.FRONT, 1, 3, -1)])).toEqual('z\'');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.LEFT, 1, 3, -1)])).toEqual('x');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.DOWN, 1, 3, -1)])).toEqual('y');
	expect(cms3.stringify([new CubeMove(spec3, CubeFace.BACK, 1, 3, -1)])).toEqual('z');

});

test('Multi Move Stringify Test', () => {

	expect(cms3.stringify([new CubeMove(spec3, CubeFace.DOWN, 1, 2, 5), new CubeMove(spec3, CubeFace.BACK, 1, 3, -5), new CubeMove(spec3, CubeFace.UP, 1, 1, 2)])).toEqual('d5 z5 U2');

});