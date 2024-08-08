import { GameBridge, GameDrawBridge } from '../stormworks-types'

export const ChipID = 'test';
export var Input: GameBridge = new GameBridge();
export var Output: GameBridge = new GameBridge();
export var Screen: GameDrawBridge = new GameDrawBridge();

let c = 0;
export async function onTick() {
  Output.SetBool(1, !Input.GetBool(1));

  Screen.setColor(255, 255, 0);
  Screen.drawText(0, 2, Screen.getHeight().toString());
  Screen.drawText(0, 10, Screen.getWidth().toString());
  c++;
}