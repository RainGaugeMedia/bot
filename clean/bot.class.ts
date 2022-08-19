import { mapKey } from './constants/map-key.map';
import { Direction } from './constants/direction.enum';

export class Bot {
  // ***********************************************************************************
  // Class Member(s):
  // ***********************************************************************************

  private freeSpace: Array<[number, number]>[];
  private positionInitial: [number, number, Direction];
  private positionCurrent: [number, number, Direction];
  private positionTarget: [number, number];
  private totalColumns: number = 0;
  private totalRows: number = 0;

  // ***********************************************************************************
  // Constructor:
  // ***********************************************************************************

  constructor(map: string) {
    this.useMap(map);
  }

  // ***********************************************************************************
  // Public Method(s):
  // ***********************************************************************************

  /**
   * Get the current position of the bot.
   */
  public getCurrentPosition(): [number, number, Direction] { 
    return this.positionCurrent;
  }

  /**
   * Commands the robot to move forward 1 unit. Returns true if the robot did, false otherwise.
   */
  public moveForward(): boolean {
    const rowIndex: number = this.positionCurrent[0];
    const colIndex: number = this.positionCurrent[1];
    const direction: Direction = this.positionCurrent[2];
    const isVertical: boolean = direction % 2 === 0;
    const nextCol: number = isVertical ? colIndex : colIndex + (direction - 2) * -1;
    const nextRow: number = isVertical ? rowIndex + direction - 1 : rowIndex;

    // Don't iterate if out of index range
    if (nextRow < 0 || nextRow >= this.totalRows || nextCol < 0 || nextCol >= this.totalColumns) return this.resetPosition();
    const row: Array<[number, number]> = this.freeSpace[nextRow];
    for (let i = 0; i < row.length; i++) {
      if (nextCol >= row[i][0] && nextCol <= row[i][1]) {
        this.positionCurrent[0] = nextRow;
        this.positionCurrent[1] = nextCol;
        return true;
      }
    }
    return this.resetPosition();
  }

  /**
   * Returns boolean indicating whether the robot has reached its goal.
   */
  public isAtTarget(): boolean {
    return this.positionTarget.join() === this.positionCurrent.slice(0, 2).join();
  }

  /**
   * Commands the robot to turn right 90 degrees. Always succeeds.
   */
  public turnRight(): boolean {
    this.positionCurrent[2] = this.positionCurrent[2] >= Direction.LEFT ? Direction.TOP : this.positionCurrent[2] + 1;
    // Seems redundant, but for consistent API functionality
    return true;
  }

  /**
   * Use a given office layout map to start navigating the bot.
   * @param map the raw office layout map to navigate.
   */
  public useMap(map: string): void {
    this.freeSpace = this.parseMap(map);
  }

  // ***********************************************************************************
  // Private Method(s):
  // ***********************************************************************************

  /**
   * Parses the given map into the freeSpace data structure of an array of an array of tuples. Each array of tuples represnts a row, containing `[[min, max], [min, max], ...]` storing open indexes.
   * @param map the office layout map to parse.
   */
  private parseMap(map: string): Array<[number, number]>[] {
    const rows: string[] = map.split('\n');
    this.totalRows = rows.length;
    return rows.map((row: string, rowIndex: number) => {
      // Check for missed spaces in map and adjust if needed
      if (this.totalColumns < row.length) this.totalColumns = row.length;
      return this.parseRow(row, rowIndex);
    });
  }

  /**
   * Parse a row into an array of tuples. Each tuple represents a `[min,max]` value within the given row that the bot IS allowed to move.
   * @param row the line of the office layout map to parse.
   * @param rowIndex the index of the current row iteration.
   */
  private parseRow(row: string, rowIndex: number): Array<[number, number]> {
    let currentIndex: number = -1;
    return row.split(/([+]+)([@$.]+)/g)
      .filter((group: string) => group) // filter out empty side effects from RegExp
      .map<[number, number] | null>((group: string) => {
        const lastIndex: number = group.length - 1;
        const min: number = currentIndex + 1;
        currentIndex = min + lastIndex;
        const startingColIndex: number = group.indexOf('@');
        if (startingColIndex > -1) {
          this.positionInitial = [rowIndex, startingColIndex + min, Direction.RIGHT];
          this.positionCurrent = [...this.positionInitial];
        }
        const targetColIndex: number = group.indexOf('$');
        if (targetColIndex > -1) this.positionTarget = [rowIndex, targetColIndex + min];
        return mapKey[group[0]] ? [min, min + lastIndex] : null;
      })
      .filter((group: [number, number] | null) => group !== null) as Array<[number, number]>;
  }

  /**
   * Resets the current poition of the bot to it's original position.
   * @returns a false value knowing that the consumer of the function should always return a false value
   */
  private resetPosition(): boolean {
    this.positionCurrent = [...this.positionInitial];
    return false;
  }
}
