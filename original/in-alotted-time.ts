const maps: string[] = [];

/** Add a map */
function addMap(map: string): void {
  maps.push(map);
}

/** Load and return a map from map store */
function ingestMap(location: number): string {
  return maps[location];
}

enum Direction {
  TOP, RIGHT, BOTTOM, LEFT
}

/** */
const mapKey: Record<string, boolean> = {
  '$': true,
  '+': false,
  '.': true,
  '@': true
};


let freeSpace: [number, number][];
let positionInitial: [number, number, Direction];
let positionCurrent: [number, number, Direction];
let positionTarget: [number, number];
let totalColumns: number = 0;
let totalRows: number = 0;

function parseMap(map: string): Array<[number, number]>[] {
  const rows: string[] = map.split('\n');
  totalRows = rows.length;
  return rows.map((row: string, rowIndex: number) => {
    // Check for missed spaces in map and adjust if needed
    if (totalColumns < row.length) totalColumns = row.length;
    return parseRow(row, rowIndex);
  });
}

/** Get an array of available spaces in the form of [[min, max], [min, max]] */
function parseRow(rawRow: string, rowIndex: number): [[number, number]] {
  let now = -1;
  return rawRow.split(/([+]+)([@$.]+)/g)
  .filter((a) => a)
  .map((section: string, i: number) => {
    const lastIndex: number = section.length - 1;
    const min: number = now + 1;
    now = min + lastIndex;
    const startingColIndex: number = section.indexOf('@');
    if (startingColIndex > -1) positionInitial = positionCurrent = [rowIndex, startingColIndex + min, Direction.RIGHT];
    const targetColIndex: number = section.indexOf('$');
    if (targetColIndex > -1) positionTarget = [rowIndex, targetColIndex + min];
    return mapKey[section[0]] ? [min, min + lastIndex] : null;
  })
.filter(a => a)
}

function isAtTarget(): boolean {
  return positionTarget.join() === positionCurrent.slice(0,2).join();
}

function moveForward(): boolean {
  const rowIndex: number = positionCurrent[0];
  const colIndex: number = positionCurrent[1];
  const direction: Direction = positionCurrent[2];
  let nextCol: number;
  let nextRow: number;
  switch(direction) {
    case Direction.TOP:
      nextCol = colIndex;
      nextRow = rowIndex - 1;
      break;
    case Direction.RIGHT:
      nextCol = colIndex + 1;
      nextRow = rowIndex;
      break;
    case Direction.BOTTOM:
      nextCol = colIndex;
      nextRow = rowIndex + 1;
      break;
    case Direction.LEFT:
      nextCol = colIndex + 1;
      nextRow = rowIndex;
      break;
    default:
      // Don't be scared
      
  }
  // console.log(positionCurrent);
  // console.log([nextRow, nextCol, direction]);
  // if !nextRow moveToInitial
  freeSpace[nextRow].forEach((a) => {
    console.log(a);
    console.log(colIndex);
    
    // a.forEach(() => {
    //   console.log(a);
    // });
  });
  
}

function turnRight(): void {
  positionCurrent[2] = positionCurrent[2] >= Direction.LEFT ? Direction.TOP : positionCurrent[2] + 1;
}