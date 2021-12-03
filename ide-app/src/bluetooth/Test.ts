import { Vector } from "@cube-codes/cube-codes-model";
import { importKey, unsafeDecryptBlock } from "./AES";
import { Quaternion } from "three";
import { Ui } from "../ui/Ui";

export class Smartcube {

	static readonly UUID = {
		ganCubeService: "0000fff0-0000-1000-8000-00805f9b34fb",
		physicalStateCharacteristic: "0000fff5-0000-1000-8000-00805f9b34fb",
		actualAngleAndBatteryCharacteristic: "0000fff7-0000-1000-8000-00805f9b34fb",
		faceletStatus1Characteristic: "0000fff2-0000-1000-8000-00805f9b34fb",
		faceletStatus2Characteristic: "0000fff3-0000-1000-8000-00805f9b34fb",
		deviceInformationService: "0000180a-0000-1000-8000-00805f9b34fb",
		systemIdCharacteristic: "00002a23-0000-1000-8000-00805f9b34fb",
		versionCharacteristic: "00002a28-0000-1000-8000-00805f9b34fb",
	};

	private static async readBuffer(characteristic: BluetoothRemoteGATTCharacteristic): Promise<Uint8Array> {
		const value = await characteristic.readValue();
		return new Uint8Array(value.buffer);
	}

	private static key10 = new Uint8Array([198, 202, 21, 223, 79, 110, 19, 182, 119, 13, 230, 89, 58, 175, 186, 162]);
	private static key11 = new Uint8Array([67, 226, 91, 214, 125, 220, 120, 216, 7, 96, 163, 218, 130, 60, 1, 241,]);

	private static async getKey(server: BluetoothRemoteGATTServer): Promise<CryptoKey | null> {

		const deviceInformationService = await server.getPrimaryService(this.UUID.deviceInformationService);

		const versionCharacteristic = await deviceInformationService.getCharacteristic(this.UUID.versionCharacteristic);
		const versionBuffer = await this.readBuffer(versionCharacteristic);
		const version = (((versionBuffer[0] << 8) + versionBuffer[1]) << 8) + versionBuffer[2];

		if (version < 0x01_00_08) {
			return null;
		}

		const keyXor = version < 0x01_01_00 ? this.key10 : this.key11;

		const systemIdCharacteristic = await deviceInformationService.getCharacteristic(this.UUID.systemIdCharacteristic);
		const systemIdBuffer = (await this.readBuffer(systemIdCharacteristic)).reverse();

		const key = new Uint8Array(keyXor);
		for (let i = 0; i < systemIdBuffer.length; i++) {
			key[i] = (key[i] + systemIdBuffer[i]) % 256;
		}

		return importKey(key);
	}

	static async connect(): Promise<Smartcube> {
		const device = await self.navigator.bluetooth.requestDevice({
			acceptAllDevices: true,
			optionalServices: [this.UUID.deviceInformationService, this.UUID.ganCubeService]
		});
		console.log(`Device choosen: id=${device.id}, name=${device.name}`);
		const server = await device.gatt!.connect();
		const key = await this.getKey(server);
		return new Smartcube(server, key);
	}

	constructor(private readonly server: BluetoothRemoteGATTServer, private readonly key: CryptoKey | null) {
	}

	async getState(): Promise<PhysicalState> {
		return PhysicalState.read(await this.server.getPrimaryService(Smartcube.UUID.ganCubeService).then(s => s.getCharacteristic(Smartcube.UUID.physicalStateCharacteristic)), this.key);
	}

}

function probablyDecodedCorrectly(data: Uint8Array): boolean {
	return (
		data[13] < 0x12 &&
		data[14] < 0x12 &&
		data[15] < 0x12 &&
		data[16] < 0x12 &&
		data[17] < 0x12 &&
		data[18] < 0x12
	);
}

async function decryptState(
	data: Uint8Array,
	aesKey: CryptoKey | null,
): Promise<Uint8Array> {
	if (aesKey === null) {
		return data;
	}

	const copy = new Uint8Array(data);
	copy.set(new Uint8Array(await unsafeDecryptBlock(aesKey, copy.slice(3))), 3);
	copy.set(
		new Uint8Array(await unsafeDecryptBlock(aesKey, copy.slice(0, 16))),
		0,
	);

	if (probablyDecodedCorrectly(copy)) {
		return copy;
	}

	throw new Error("Invalid Gan cube state");
}


const MAX_LATEST_MOVES = 6;

export class Move {
	constructor(readonly face: string, readonly angle: number = 1) {}
}

const ganMoveToBlockMove: { [i: number]: Move } = {
	0x00: new Move("U"),
	0x02: new Move("U", -1),
	0x03: new Move("R"),
	0x05: new Move("R", -1),
	0x06: new Move("F"),
	0x08: new Move("F", -1),
	0x09: new Move("D"),
	0x0b: new Move("D", -1),
	0x0c: new Move("L"),
	0x0e: new Move("L", -1),
	0x0f: new Move("B"),
	0x11: new Move("B", -1),
  };

export class PhysicalState {
	public static async read(
		characteristic: BluetoothRemoteGATTCharacteristic,
		aesKey: CryptoKey | null,
	): Promise<PhysicalState> {
		const value = await decryptState(
			new Uint8Array((await characteristic.readValue()).buffer),
			aesKey,
		);
		return new PhysicalState(new DataView(value.buffer));
	}

	private arr: Uint8Array;
	private arrLen = 19;

	private constructor(private dataView: DataView) {
		this.arr = new Uint8Array(dataView.buffer);
		if (this.arr.length !== this.arrLen) {
			throw new Error("Unexpected array length");
		}
	}

	public rotQuat(): Vector {
		let x = this.dataView.getInt16(0, true) / 16384;
		let y = this.dataView.getInt16(2, true) / 16384;
		let z = this.dataView.getInt16(4, true) / 16384;
		[x, y, z] = [-y, z, -x];
		return new Vector([x, y, z]);
	}

	public rotQuat2(ui: Ui): Quaternion {
		let x = this.dataView.getInt16(0, true) / 16384; // 2^ 14
		let y = this.dataView.getInt16(2, true) / 16384;
		let z = this.dataView.getInt16(4, true) / 16384;
		//[x, y, z] = [-y, z, -x];
		let x2=x;
		let y2=z;
		let z2=-y;
		const wSquared = 1 - (x2 * x2 + y2 * y2 + z2 * z2);
		const w = wSquared > 0 ? Math.sqrt(wSquared) : 0;
		const quat = new Quaternion(x2, y2, z2, w);
		//const quatInv = quat.clone().invert();
		//let u1 = new Vector3(1,0,0).applyQuaternion(quatInv);
		//let u2 = new Vector3(0,1,0).applyQuaternion(quatInv);
		//let u3 = new Vector3(0,0,1).applyQuaternion(quatInv);
		//ui.editorWidget.log(`${x.toFixed(4)} | ${y.toFixed(4)} | ${z.toFixed(4)} --- ${x2.toFixed(4)} | ${y2.toFixed(4)} | ${z2.toFixed(4)} --- 100 => ${u1.x.toFixed(4)} | ${u1.y.toFixed(4)} | ${u1.z.toFixed(4)} --- 010 => ${u2.x.toFixed(4)} | ${u2.y.toFixed(4)} | ${u2.z.toFixed(4)} --- 001 => ${u3.x.toFixed(4)} | ${u3.y.toFixed(4)} | ${u3.z.toFixed(4)}`);
		return quat;
	}

	// Loops from 255 to 0.
	public moveCounter(): number {
		return this.arr[12];
	}

	public numMovesSince(previousMoveCounter: number): number {
		return (this.moveCounter() - previousMoveCounter) & 0xff;
	}

	// Due to the design of the Gan356i protocol, it's common to query for the
	// latest physical state and find 0 moves have been performed since the last
	// query. Therefore, it's useful to allow 0 as an argument.
	public latestMoves(n: number): Move[] {
		if (n < 0 || n > MAX_LATEST_MOVES) {
			throw new Error(`Must ask for 0 to 6 latest moves. (Asked for ${n})`);
		}
		return Array.from(this.arr.slice(19 - n, 19)).map(
			(i) => ganMoveToBlockMove[i],
		);
	}
}