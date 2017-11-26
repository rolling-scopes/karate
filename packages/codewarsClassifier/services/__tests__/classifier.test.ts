import { classify } from '../classifier'
const mock = require('./mock.json')

test('Classifier', function () {
  const res = classify(mock)
  expect(res).toMatchSnapshot();
})