import { jest } from '@jest/globals';

// stash the exported helpers once the module loads
let getAllPatterns;
let getPattern;

const mockFindAll = jest.fn();
const mockFindByPk = jest.fn();

beforeAll(async () => {
  // set default returns for the fakes
  mockFindAll.mockResolvedValue(['pattern-a']);
  mockFindByPk.mockResolvedValue({ pattern_ID: 42 });

  // supply fake implementations for the sequelize layer
  jest.unstable_mockModule('../models/patterns.js', () => ({
    Patterns: {
      findAll: mockFindAll,
      findByPk: mockFindByPk,
    },
  }));

  // import the module-under-test after mocks are in place
  const module = await import('../models/model.js');
  getAllPatterns = module.getAllPatterns;
  getPattern = module.getPattern;
});

beforeEach(() => {
  jest.clearAllMocks();
  mockFindAll.mockResolvedValue(['pattern-a']);
  mockFindByPk.mockResolvedValue({ pattern_ID: 42 });
});

test('getAllPatterns returns rows from Patterns.findAll', async () => {
  await expect(getAllPatterns()).resolves.toEqual(['pattern-a']);
});

test('getPattern uses findByPk and returns the row', async () => {
  await expect(getPattern(42)).resolves.toEqual({ pattern_ID: 42 });
  expect(mockFindByPk).toHaveBeenCalledWith(42);
});
