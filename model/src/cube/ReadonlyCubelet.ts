import { CubeFace } from "../cube-geometry/CubeFace";
import { CubePart } from "../cube-geometry/CubePart";
import { CubePartType } from "../cube-geometry/CubePartType";
import { Printable } from "../interface/Printable";
import { Cube } from "./Cube";
import { CubeletLocation } from "./CubeletLocation";
import { CubeletOrientation } from "./CubeletOrientation";

export interface ReadonlyCubelet extends Printable {

	readonly cube: Cube

	readonly initialLocation: CubeletLocation

	readonly initialPart: CubePart

	readonly initialOrientation: CubeletOrientation

	readonly currentLocation: CubeletLocation

	readonly currentPart: CubePart

	readonly currentOrientation: CubeletOrientation

	readonly solvedLocation: CubeletLocation

	readonly solvedPart: CubePart

	readonly solvedOrientation: CubeletOrientation

	readonly type: CubePartType

	isSolved(): boolean

	getColorAt(currentFace: CubeFace): CubeFace

}