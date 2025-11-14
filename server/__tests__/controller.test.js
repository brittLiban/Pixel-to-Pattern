import { jest } from '@jest/globals';

let getAll;
let getSpecificPattern;
const getAllPatternsMock = jest.fn();
const getPatternMock = jest.fn();

beforeAll(async () => {
  // Hand controller.js a fake model module so calls hit our stub instead of the real DB logic.
  jest.unstable_mockModule('../models/model.js', () => ({
    getAllPatterns: getAllPatternsMock,
    getPattern: getPatternMock,
    postPattern: jest.fn(),
    updatePattern: jest.fn(),
  }));

  // controller.js also initializes the Sequelize model; replace it with inert spies so no connection happens.
  jest.unstable_mockModule('../models/patterns.js', () => ({
    Patterns: {
      destroy: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    },
  }));

  // Now import the real controller and grab the handler we want to exercise.
  const module = await import('../controllers/controller.js');
  getAll = module.getAll;
  getSpecificPattern = module.getSpecificPattern;
});

beforeEach(() => {
  jest.clearAllMocks();
});

const buildRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res); // mimic Express res.status().json() chaining
  res.json = jest.fn();
  return res;
};

test('getAll sends 200 with patterns from model', async () => {
  // setup: fake model returns data + build mock res helpers
  const req = {};
  const res = buildRes();
  getAllPatternsMock.mockResolvedValue(['pattern-a']);

  // run the actual controller
  await getAll(req, res);

  // check it hit the model + kicked back 200 with the payload
  expect(getAllPatternsMock).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(['pattern-a']);
});

test('getAll sends 500 on model error', async () => {
  // setup: make the model throw so we hit the error path
  const req = {};
  const res = buildRes();
  getAllPatternsMock.mockRejectedValue(new Error('boom'));

  // run controller
  await getAll(req, res);

  // controller catch block should surface as 500 + error message
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'boom' });
});

test('getSpecificPattern comes back 200 with single row', async () => {
  const req = { params: { id: '24' } };
  const res = buildRes();
  const fakePattern = { pattern_ID: 24 };
  getPatternMock.mockResolvedValue(fakePattern);

  await getSpecificPattern(req, res);

  expect(getPatternMock).toHaveBeenCalledWith('24');
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(fakePattern);
});