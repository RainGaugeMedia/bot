"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const map_key_map_1 = require("./constants/map-key.map");
const direction_enum_1 = require("./constants/direction.enum");
class Bot {
    // ***********************************************************************************
    // Constructor:
    // ***********************************************************************************
    constructor(map) {
        this.totalColumns = 0;
        this.totalRows = 0;
        this.useMap(map);
    }
    // ***********************************************************************************
    // Public Method(s):
    // ***********************************************************************************
    /**
     * Get the current position of the bot.
     */
    getCurrentPosition() {
        return this.positionCurrent;
    }
    /**
     * Commands the robot to move forward 1 unit. Returns true if the robot did, false otherwise.
     */
    moveForward() {
        const rowIndex = this.positionCurrent[0];
        const colIndex = this.positionCurrent[1];
        const direction = this.positionCurrent[2];
        const isVertical = direction % 2 === 0;
        const nextCol = isVertical ? colIndex : colIndex + (direction - 2) * -1;
        const nextRow = isVertical ? rowIndex + direction - 1 : rowIndex;
        // Don't iterate if out of index range
        if (nextRow < 0 || nextRow >= this.totalRows || nextCol < 0 || nextCol >= this.totalColumns)
            return this.resetPosition();
        const row = this.freeSpace[nextRow];
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
    isAtTarget() {
        return this.positionTarget.join() === this.positionCurrent.slice(0, 2).join();
    }
    /**
     * Commands the robot to turn right 90 degrees. Always succeeds.
     */
    turnRight() {
        this.positionCurrent[2] = this.positionCurrent[2] >= direction_enum_1.Direction.LEFT ? direction_enum_1.Direction.TOP : this.positionCurrent[2] + 1;
        // Seems redundant, but for consistent API functionality
        return true;
    }
    /**
     * Use a given office layout map to start navigating the bot.
     * @param map the raw office layout map to navigate.
     */
    useMap(map) {
        this.freeSpace = this.parseMap(map);
    }
    // ***********************************************************************************
    // Private Method(s):
    // ***********************************************************************************
    /**
     * Parses the given map into the freeSpace data structure of an array of an array of tuples. Each array of tuples represnts a row, containing `[[min, max], [min, max], ...]` storing open indexes.
     * @param map the office layout map to parse.
     */
    parseMap(map) {
        const rows = map.split('\n');
        this.totalRows = rows.length;
        return rows.map((row, rowIndex) => {
            // Check for missed spaces in map and adjust if needed
            if (this.totalColumns < row.length)
                this.totalColumns = row.length;
            return this.parseRow(row, rowIndex);
        });
    }
    /**
     * Parse a row into an array of tuples. Each tuple represents a `[min,max]` value within the given row that the bot IS allowed to move.
     * @param row the line of the office layout map to parse.
     * @param rowIndex the index of the current row iteration.
     */
    parseRow(row, rowIndex) {
        let currentIndex = -1;
        return row.split(/([+]+)([@$.]+)/g)
            .filter((group) => group) // filter out empty side effects from RegExp
            .map((group) => {
            const lastIndex = group.length - 1;
            const min = currentIndex + 1;
            currentIndex = min + lastIndex;
            const startingColIndex = group.indexOf('@');
            if (startingColIndex > -1) {
                this.positionInitial = [rowIndex, startingColIndex + min, direction_enum_1.Direction.RIGHT];
                this.positionCurrent = [...this.positionInitial];
            }
            const targetColIndex = group.indexOf('$');
            if (targetColIndex > -1)
                this.positionTarget = [rowIndex, targetColIndex + min];
            return map_key_map_1.mapKey[group[0]] ? [min, min + lastIndex] : null;
        })
            .filter((group) => group !== null);
    }
    /**
     * Resets the current poition of the bot to it's original position.
     * @returns a false value knowing that the consumer of the function should always return a false value
     */
    resetPosition() {
        this.positionCurrent = [...this.positionInitial];
        return false;
    }
}
exports.Bot = Bot;
