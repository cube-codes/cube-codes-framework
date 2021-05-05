import { CubeApi, CubeletInspector } from "@cube-codes/cube-codes-ide-common";
import { SystemApi } from "./SystemApi";
import { UiApi } from "./UiApi"

export interface EditorApi {

	readonly SYSTEM: SystemApi

	readonly UI: UiApi

	readonly CUBE: CubeApi

	readonly CUBELETS: CubeletInspector

}