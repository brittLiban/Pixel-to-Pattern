import { jest } from '@jest/globals';

// we stash the actual exported helper here after we import the module
let getAllPatterns;

beforeAll(async () => {
  // build a stand-in for Patterns.findAll that pretends the DB returned one row
  const mockFindAll = jest.fn().mockResolvedValue(['pattern-a']);

  
  // hand them this fake object instead of loading the real sequelize model
  jest.unstable_mockModule('../models/patterns.js', () => ({
    Patterns: {
      findAll: mockFindAll,
    },
  }));

  // now import the real module-under-test; it sees the fake dependency,
  const module = await import('../models/model.js');
  getAllPatterns = module.getAllPatterns;
});

test('getAllPatterns returns rows from Patterns.findAll', async () => {
  // exercise the real helper: it calls the fake findAll and passes its result back
  await expect(getAllPatterns()).resolves.toEqual(['pattern-a']);
});
