/**
 * Simulates some storage for office layout maps
 */
class MapStore {
  // ***********************************************************************************
  // Class Member(s):
  // ***********************************************************************************

  private maps: string[] = [];

  // ***********************************************************************************
  // Public Method(s):
  // ***********************************************************************************

  /**
   * Adds a map to the store.
   * @param map A string representing an office layout.
   */
  public addMap(map: string): boolean {
    this.maps.push(map);
    // if (err) return false;
    return true;
  }

  /**
   * Get the stored office layout map given an index.
   * @param index the index of the desired map.
   * @throws error if doesn't exist.
   */
  public getMap(index: number): string {
    const map: string = this.maps[index];
    if (!map) throw Error(`No map with index ${index}`);
    return map;
  }
}

/** A single instance of the map store. */
export const mapStore: MapStore = new MapStore();
