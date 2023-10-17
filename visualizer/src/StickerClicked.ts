import { EventData } from "@cube-codes/cube-codes-model";
import { BufferGeometry, Mesh, MeshStandardMaterial } from "three";

export interface StickerClicked extends EventData {
	readonly sticker: Mesh<BufferGeometry, MeshStandardMaterial>
}