"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapStore = void 0;
/**
 * Simulates some storage for office layout maps
 */
class MapStore {
    constructor() {
        // ***********************************************************************************
        // Class Member(s):
        // ***********************************************************************************
        this.maps = [];
    }
    // ***********************************************************************************
    // Public Method(s):
    // ***********************************************************************************
    /**
     * Adds a map to the store.
     * @param map A string representing an office layout.
     */
    addMap(map) {
        this.maps.push(map);
        // if (err) return false;
        return true;
    }
    /**
     * Get the stored office layout map given an index.
     * @param index the index of the desired map.
     * @throws error if doesn't exist.
     */
    getMap(index) {
        const map = this.maps[index];
        if (!map)
            throw Error(`No map with index ${index}`);
        return map;
    }
}
/** A single instance of the map store. */
exports.mapStore = new MapStore();
