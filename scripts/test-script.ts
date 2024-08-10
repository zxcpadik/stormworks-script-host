// Script Example

import { GameBridge, GameDrawBridge } from '../stormworks-types'

export const ChipID = 'test'; // ID for script, must be different in each script
export var Input: GameBridge = new GameBridge(); // Chip Input
export var Output: GameBridge = new GameBridge(); // Chip Output
export var Screen: GameDrawBridge = new GameDrawBridge(); // Screen Controller

export async function onTick() {
  // Your code
  Output.SetBool(1, !Input.GetBool(1));
  Screen.drawText(2, 2, 'Sample');
}