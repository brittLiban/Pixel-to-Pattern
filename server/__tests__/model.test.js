import { jest } from '@jest/globals';

// stash the exported helpers once the module loads
let getAllPatterns;
let getPattern;
let postPattern;
let updatePattern;

const mockFindAll = jest.fn();
const mockFindByPk = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();

beforeAll(async () => {
  // default fake return values so tests start with clean predictable data
  mockFindAll.mockResolvedValue(['pattern-a']);
  mockFindByPk.mockResolvedValue({ pattern_ID: 42 });
  mockCreate.mockResolvedValue({ pattern_ID: 99 });
  mockUpdate.mockResolvedValue([1]);

  // replace the sequelize Patterns model with our mock functions
  jest.unstable_mockModule('../models/patterns.js', () => ({
    Patterns: {
      findAll: mockFindAll,
      findByPk: mockFindByPk,
      create: mockCreate,
      update: mockUpdate,
    },
  }));

  // import the real module under test now that its dependencies are faked
  const module = await import('../models/model.js');
  getAllPatterns = module.getAllPatterns;
  getPattern = module.getPattern;
  postPattern = module.postPattern;
  updatePattern = module.updatePattern;
});

beforeEach(() => {
  jest.clearAllMocks();
  // reset default resolves in case a test overrides them
  mockFindAll.mockResolvedValue(['pattern-a']);
  mockFindByPk.mockResolvedValue({ pattern_ID: 42 });
  mockCreate.mockResolvedValue({ pattern_ID: 99 });
  mockUpdate.mockResolvedValue([1]);
});

test('getAllPatterns returns rows from Patterns.findAll', async () => {
  await expect(getAllPatterns()).resolves.toEqual(['pattern-a']);
});

test('getPattern uses findByPk and returns the row', async () => {
  await expect(getPattern(42)).resolves.toEqual({ pattern_ID: 42 });
  expect(mockFindByPk).toHaveBeenCalledWith(42);
});

test('postPattern forwards payload to Patterns.create', async () => {
  const payload = { pattern_name: 'new', pattern_info: {}, description: 'desc' };
  mockCreate.mockResolvedValue({ pattern_ID: 7 });

  await expect(postPattern(payload)).resolves.toEqual(7);
  expect(mockCreate).toHaveBeenCalledWith(payload);
});

test('updatePattern calls underlying update with id + data', async () => {
  const changes = { pattern_name: 'updated' };

  await expect(updatePattern(1, changes)).resolves.toBeUndefined();
  expect(mockUpdate).toHaveBeenCalledWith(changes, { where: { pattern_id: 1 } });
});
