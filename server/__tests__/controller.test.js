import { jest } from '@jest/globals';

let getAll;
let getSpecificPattern;
let uploadPattern;
let deletePattern;
const getAllPatternsMock = jest.fn();
const getPatternMock = jest.fn();
const postPatternMock = jest.fn();
const destroyMock = jest.fn();

beforeAll(async () => {
  // Hand controller.js a fake model module so calls hit our stub instead of the real DB logic.
  jest.unstable_mockModule('../models/model.js', () => ({
    getAllPatterns: getAllPatternsMock,
    getPattern: getPatternMock,
    postPattern: postPatternMock,
    updatePattern: jest.fn(),
  }));

  // controller.js also initializes the Sequelize model; replace it with inert spies so no connection happens.
  jest.unstable_mockModule('../models/patterns.js', () => ({
    Patterns: {
      destroy: destroyMock,
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
  uploadPattern = module.uploadPattern;
  deletePattern = module.deletePattern;
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

test('getSpecificPattern surfaces 500 when model rejects', async () => {
  const req = { params: { id: '7' } };
  const res = buildRes();
  getPatternMock.mockRejectedValue(new Error('missing pattern'));

  await getSpecificPattern(req, res);

  expect(getPatternMock).toHaveBeenCalledWith('7');
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: 'missing pattern' });
});

test('uploadPattern returns 201 with newly created id', async () => {
  const payload = { pattern_name: 'Grid', pattern_info: {}, description: 'simple grid' };
  const req = { body: payload };
  const res = buildRes();
  const fakeId = { pattern_ID: 88 };
  postPatternMock.mockResolvedValue(fakeId);

  await uploadPattern(req, res);

  expect(postPatternMock).toHaveBeenCalledWith(payload);
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith(fakeId);
});

test('deletePattern returns 404 when nothing is removed', async () => {
  const req = { params: { id: '55' } };
  const res = buildRes();
  destroyMock.mockResolvedValue(0);

  await deletePattern(req, res);

  expect(destroyMock).toHaveBeenCalledWith({ where: { pattern_ID: '55' } });
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: 'Pattern not found' });
});