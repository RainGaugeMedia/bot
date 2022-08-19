console.clear();

/*
*/

function simulateHttpCall(): Promise<any> {
  return new Promise((res, rej) => {
    setTimeout(
      () => {
        res(true);
      },
      Math.round(Math.random() * 1000)
    );
  });
  
}

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
    if (startingColIndex > -1) {
      positionInitial = [rowIndex, startingColIndex + min, Direction.RIGHT];
      positionCurrent = [...positionInitial];
    }
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
  // Don't iterate if out of index range
  if (nextRow < 0 || nextRow >= totalRows || nextCol < 0 || nextCol >= totalColumns) {
    positionCurrent = positionInitial;
    return false;
  }
  const freeRow: Array<[number, number]> = freeSpace[nextRow];
  for (let i = 0; i < freeRow.length; i++) {
    if (nextCol >= freeRow[i][0] && nextCol <= freeRow[i][1]) {
      positionCurrent[0] = nextRow;
      positionCurrent[1] = nextCol;
      
      return true;
    }
  }
  console.log('NOOO');
  positionCurrent = [...positionInitial];
  
  return false;
}

function turnRight(): void {
  positionCurrent[2] = positionCurrent[2] >= Direction.LEFT ? Direction.TOP : positionCurrent[2] + 1;
}

addMap(`++++++++++++++++++++++...\n+@..................$....\n++++++++++++++++++++++...`);
// addMap(`++++++++++++++++++++++++++++++++++++++++++
// +@.......................................+
// +++++++++++++++++++.++++++++++++++++++++++
//                   +.+
//                   +.+
//                   +.+
//                   +.+
//                   +.+
//                   +.++++++++++++++++++++++
//                   +.....................$+
//                   ++++++++++++++++++++++++`);
freeSpace = parseMap(ingestMap(0));

// MOVE TO TARGET
for (let i = 0; i < totalColumns - 1; i++) {
  moveForward();
  if (isAtTarget()) break;
}
console.log(positionCurrent); // HERE IS THE TARGET

// MOVE INTO WALL
turnRight();
console.log(positionCurrent); // HERE IS THE TARGET
moveForward();
console.log(positionCurrent); // NOW START OVER





