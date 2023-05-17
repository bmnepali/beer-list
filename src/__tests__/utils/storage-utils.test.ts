import { StorageUtils } from "../../utils/storage";

describe('StorageUtils', () => {
  let storageUtils: StorageUtils<number>;

  afterEach(() => {
    localStorage.clear();
  });

  describe('getInstance', () => {
    it('should return the same instance for the same key', () => {
      const instance1 = StorageUtils.getInstance('testKey');
      const instance2 = StorageUtils.getInstance('testKey');
      expect(instance1).toBe(instance2);
    });

    it('should return same instance for different keys', () => {
      const instance1 = StorageUtils.getInstance('testKey1');
      const instance2 = StorageUtils.getInstance('testKey2');
      expect(instance1).toBe(instance2);
    });
  });

  describe('testing other menthods', () => {
    beforeEach(() => {
      // Reset the instance before each test
      StorageUtils['instance'] = null;
      storageUtils = StorageUtils.getInstance('testKey');
      localStorage.clear();
    });


  describe('addRecord', () => {
    it('should add a record to the list', () => {
      storageUtils.addRecord(1);
      storageUtils.addRecord(2);
      const records = storageUtils.getRecords();
      expect(records).toEqual([1, 2]);
    });
  });

  describe('getRecords', () => {
    it('should return an empty array if no records are stored', () => {
      const records = storageUtils.getRecords();
      expect(records).toEqual([]);
    });

    it('should return the stored records', () => {
      localStorage.setItem('testKey', JSON.stringify([1, 2, 3]));
      const records = storageUtils.getRecords();
      expect(records).toEqual([1, 2, 3]);
    });
  });

  describe('storeRecords', () => {
    it('should store the given records', () => {
      const records = [1, 2, 3];
      storageUtils.storeRecords(records);
      const storedRecords = JSON.parse(localStorage.getItem('testKey')!);
      expect(storedRecords).toEqual(records);
    });
  });

  describe('getPaginatedRecords', () => {
    beforeEach(() => {
      const records = [1, 2, 3, 4, 5];
      storageUtils.storeRecords(records);
    });

    it('should return the correct paginated records for the first page', () => {
      const { records } = storageUtils.getPaginatedRecords(1, 2);
      expect(records).toEqual([1, 2]);
    });

    it('should return the correct paginated records for a middle page', () => {
      const { records } = storageUtils.getPaginatedRecords(2, 2);
      expect(records).toEqual([3, 4]);
    });

    it('should return the correct paginated records for the last page', () => {
      const { records } = storageUtils.getPaginatedRecords(3, 2);
      expect(records).toEqual([5]);
    });

    it('should return the correct total count of records', () => {
      const { totalCount } = storageUtils.getPaginatedRecords(1, 2);
      expect(totalCount).toBe(5);
    });
  });
  })
});

