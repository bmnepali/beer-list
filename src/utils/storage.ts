export class StorageUtils<T> {
  private key: string;
  private static instance: StorageUtils<any> | null = null;

  private constructor(key: string) {
    this.key = key;
  }

  /**
   * Gets the instance of the StoreUtils
   * @param key String
   */
  public static getInstance<T>(key: string): StorageUtils<T> {
    if (!StorageUtils.instance) {
      StorageUtils.instance = new StorageUtils<T>(key);
    }
    return StorageUtils.instance as StorageUtils<T>;
  }

  /**
   * Adds record<T> in the esisting list
   * @param record T
   */
  public addRecord(record: T): void {
    const records = this.getRecords();
    records.push(record);
    this.storeRecords(records);
  }

  /**
   * Gets the list of records
   */
  public getRecords(): T[] {
    const records = localStorage.getItem(this.key);
    return records ? JSON.parse(records) : [];
  }

  /**
   * Saves the reords in the LocalStorage
   * @param records T[]
   */
  public storeRecords(records: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(records));
  }

  /**
   * Gets the paginated records from the store
   * @param pageNumber
   * @param pageSize
   */
  public getPaginatedRecords(
    pageNumber: number,
    pageSize: number
  ): { records: T[]; totalCount: number } {
    const records = this.getRecords();
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      records: records.slice(startIndex, endIndex),
      totalCount: records.length
    };
  }
}
