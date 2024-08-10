export interface SWScript {
  ChipID: string,
  Input: GameBridge,
  Output: GameBridge,
  Screen: GameDrawBridge,
  onTick: (() => void) | (() => Promise<void>)
}

export class GameBridge {
  /**
   * Direct access to number array, start with index ```0```
   */
  public numbers: number[] = [];
  /**
   * Direct access to bool array, start with index ```0```
   */
  public bools: boolean[] = [];

  /**
   * Number from bridge
   * @param id index, starts from ```1```
   * @returns ```number``` at index, ```0``` if not in index range
   */
  public GetNumber(id: number) {
    return this.numbers[id - 1] || 0;
  }
  /**
   * Bool from bridge
   * @param id index, starts from ```1```
   * @returns ```bool``` at index
   */
  public GetBool(id: number) {
    return this.bools[id - 1] || false;
  }
  /**
   * Set number in bridge
   * @param id index, starts from ```1```
   * @param value number value
   * @returns self, ```0``` if not in range
   */
  public SetNumber(id: number, value: number) {
    if (id < 1 || id > 32) return 0;
    return this.numbers[id - 1] = value;
  }
  /**
   * Set bool in bridge
   * @param id index, starts from ```1```
   * @param value bool value
   * @returns self, ```false``` if not in range
   */
  public SetBool(id: number, value: boolean) {
    if (id < 1 || id > 32) return false;
    return this.bools[id - 1] = value;
  }

  /**
   * Parse raw data
   * @param str raw input string from microcontroller
   * @returns ```true``` if parsed correctly
   */
  public Parse(str: string) {
    let blocks = (str || "").split(';');

    if (blocks.length < 64) return false;
    for (let i = 0; i < 32; i++) {
      this.numbers[i] = Number.parseFloat(blocks[i]);
    }
    for (let i = 32; i < 64; i++) {
      this.bools[i - 32] = !!Number.parseInt(blocks[i]);
    }
    return true;
  }
  /**
   * Serialize data to string
   * @returns raw output string
   */
  public ToString() {
    let str = '';

    for (let i = 0; i < 32; i++) {
      str += (this.numbers[i] || 0).toString() + ';';
    }
    for (let i = 0; i < 32; i++) {
      str += (+(this.bools[i] || false)).toString() + ';';
    }

    return str;
  }
}

export class GameDrawBridge {
  public stack: string[] = [];
  public Height: number = 0;
  public Width: number = 0;

  public getHeight() {
    return this.Height;
  }
  public getWidth() {
    return this.Width;
  }
  public setColor(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['setColor', r.toString(), g.toString(), b.toString(), a.toString()].join('#'));
  }
  public drawClear() {
    this.stack.push('drawClear');
  }
  public drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.stack.push(["drawLine", x1.toString(), y1.toString(), x2.toString(), y2.toString()].join('#'));
  }
  public drawCircle(x: number, y: number, r: number) {
    this.stack.push(["drawCircle", x.toString(), y.toString(), r.toString()].join('#'));
  }
  public drawCircleF(x: number, y: number, r: number) {
    this.stack.push(["drawCircleF", x.toString(), y.toString(), r.toString()].join('#'));
  }
  public drawRect(x: number, y: number, w: number, h: number) {
    this.stack.push(["drawRect", x.toString(), y.toString(), w.toString(), h.toString()].join('#'));
  }
  public drawRectF(x: number, y: number, w: number, h: number) {
    this.stack.push(["drawRectF", x.toString(), y.toString(), w.toString(), h.toString()].join('#'));
  }
  public drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    this.stack.push(["drawTriangle", x1.toString(), y1.toString(), x2.toString(), y2.toString(), x3.toString(), y3.toString()].join('#'));
  }
  public drawTriangleF(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    this.stack.push(["drawTriangleF", x1.toString(), y1.toString(), x2.toString(), y2.toString(), x3.toString(), y3.toString()].join('#'));
  }
  public drawText(x: number, y: number, t: string) {
    this.stack.push(["drawText", x.toString(), y.toString(), Buffer.from(t).toString('base64')].join('#'));
  }
  public drawTextBox(x: number, y: number, w: number, h: number, t: string, ha: number = -1, va: number = -1) {
    this.stack.push(["drawTextBox", x.toString(), y.toString(), w.toString(), h.toString(), Buffer.from(t).toString('base64'), ha.toString(), va.toString()].join('#'));
  }
  public drawMap(x: number, y: number, zoom: number) {
    this.stack.push(["drawMap", x.toString(), y.toString(), zoom.toString()].join('#'));
  }
  public setMapColorOcean(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['setMapColorOcean', r.toString(), g.toString(), b.toString(), a.toString()].join('#'));
  }
  public setMapColorShallows(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['setMapColorShallows', r.toString(), g.toString(), b.toString(), a.toString()].join('#'));
  }
  public setMapColorLand(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['setMapColorLand', r.toString(), g.toString(), b.toString(), a.toString()].join('#'));
  }
  public setMapColorGrass(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['setMapColorGrass', r.toString(), g.toString(), b.toString(), a.toString()].join('#'));
  }
  public setMapColorSand(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['setMapColorSand', r.toString(), g.toString(), b.toString(), a.toString()].join('#'));
  }
  public setMapColorSnow(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['setMapColorSnow', r.toString(), g.toString(), b.toString(), a.toString()].join('#'));
  }
  public setMapColorRock(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['setMapColorRock', r.toString(), g.toString(), b.toString(), a.toString()].join('#'));
  }
  public setMapColorGravel(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['setMapColorGravel', r.toString(), g.toString(), b.toString(), a.toString()].join('#'));
  }

  public Parse(str: string) {
    let b = (str)!.split(';')!.pop()!.split(':')!;
    if (b.length < 2) return false;
    this.Height = Number.parseFloat(b[0] || '0');
    this.Width = Number.parseFloat(b[1] || '0');
    this.stack = [];
    return true;
  }
  public ToString() {
    if (this.Height == 0 || this.Width == 0) return '';
    return this.stack.join(':');
  }
}