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
    this.stack.push(['1', Math.round(r).toString(), Math.round(g).toString(), Math.round(b).toString(), a.toString()].join('#')); // setColor
  }
  public drawClear() {
    this.stack.push('2'); // drawClear
  }
  public drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.stack.push(["3", x1.toString(), y1.toString(), x2.toString(), y2.toString()].join('#')); // drawLine
  }
  public drawCircle(x: number, y: number, r: number) {
    this.stack.push(["4", x.toString(), y.toString(), Math.round(r).toString()].join('#')); // drawCircle
  }
  public drawCircleF(x: number, y: number, r: number) {
    this.stack.push(["5", x.toString(), y.toString(), Math.round(r).toString()].join('#')); // drawCircleF
  }
  public drawRect(x: number, y: number, w: number, h: number) {
    this.stack.push(["6", x.toString(), y.toString(), w.toString(), h.toString()].join('#')); // drawRect
  }
  public drawRectF(x: number, y: number, w: number, h: number) {
    this.stack.push(["7", x.toString(), y.toString(), w.toString(), h.toString()].join('#')); // drawRectF
  }
  public drawTriangle(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    this.stack.push(["8", x1.toString(), y1.toString(), x2.toString(), y2.toString(), x3.toString(), y3.toString()].join('#')); // drawTriangle
  }
  public drawTriangleF(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
    this.stack.push(["9", x1.toString(), y1.toString(), x2.toString(), y2.toString(), x3.toString(), y3.toString()].join('#')); // drawTriangleF
  }
  public drawText(x: number, y: number, t: string) {
    this.stack.push(["10", x.toString(), y.toString(), Buffer.from(t).toString('base64')].join('#')); // drawText
  }
  public drawTextBox(x: number, y: number, w: number, h: number, t: string, ha: number = -1, va: number = -1) {
    this.stack.push(["11", x.toString(), y.toString(), w.toString(), h.toString(), Buffer.from(t).toString('base64'), ha.toString(), va.toString()].join('#')); // drawTextBox
  }
  public drawMap(x: number, y: number, zoom: number) {
    this.stack.push(["12", x.toString(), y.toString(), zoom.toString()].join('#')); // drawMap
  }
  public setMapColorOcean(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['13', Math.round(r).toString(), Math.round(g).toString(), Math.round(b).toString(), Math.round(a).toString()].join('#')); // setMapColorOcean
  }
  public setMapColorShallows(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['14', Math.round(r).toString(), Math.round(g).toString(), Math.round(b).toString(), Math.round(a).toString()].join('#')); // setMapColorShallows
  }
  public setMapColorLand(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['15', Math.round(r).toString(), Math.round(g).toString(), Math.round(b).toString(), Math.round(a).toString()].join('#')); // setMapColorLand
  }
  public setMapColorGrass(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['16', Math.round(r).toString(), Math.round(g).toString(), Math.round(b).toString(), Math.round(a).toString()].join('#')); // setMapColorGrass
  }
  public setMapColorSand(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['17', Math.round(r).toString(), Math.round(g).toString(), Math.round(b).toString(), Math.round(a).toString()].join('#')); // setMapColorSand
  }
  public setMapColorSnow(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['18', Math.round(r).toString(), Math.round(g).toString(), Math.round(b).toString(), Math.round(a).toString()].join('#')); // setMapColorSnow
  }
  public setMapColorRock(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['19', Math.round(r).toString(), Math.round(g).toString(), Math.round(b).toString(), Math.round(a).toString()].join('#')); // setMapColorRock
  }
  public setMapColorGravel(r: number, g: number, b: number, a: number = 255) {
    this.stack.push(['20', Math.round(r).toString(), Math.round(g).toString(), Math.round(b).toString(), Math.round(a).toString()].join('#')); // setMapColorGravel
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