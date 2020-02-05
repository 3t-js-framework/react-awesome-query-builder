import * as constants from '../constants';

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {string} field
 */
export const setField = (config, path, field) => ({
  type: constants.SET_FIELD,
  path: path,
  field: field,
  config: config
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {string} operator
 */
export const setOperator = (config, path, operator) => ({
  type: constants.SET_OPERATOR,
  path: path,
  operator: operator,
  config: config
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {integer} delta
 * @param {*} value
 * @param {string} valueType
 */
export const setValue = (config, path, delta, value, valueType) => ({
  type: constants.SET_VALUE,
  path: path,
  delta: delta,
  value: value,
  valueType: valueType,
  config: config
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {integer} delta
 * @param {*} srcKey
 */
export const setValueSrc = (config, path, delta, srcKey) => ({
  type: constants.SET_VALUE_SRC,
  path: path,
  delta: delta,
  srcKey: srcKey,
  config: config
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {string} name
 * @param {*} value
 */
export const setOperatorOption = (config, path, name, value) => ({
  type: constants.SET_OPERATOR_OPTION,
  path: path,
  name: name,
  value: value,
  config: config
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {string} field
 */
export const setInputSrcField = (config, path, field) => ({
  type: constants.SET_INPUT_SRC_FIELD,
  path: path,
  field: field,
  config: config
});

/**
 * @param {object} config
 * @param {Immutable.List} path
 * @param {object} functionSrc
 */
export const setFunctionSrc = (config, path, functionSrc) => ({
  type: constants.SET_FUNCTION_SRC,
  path: path,
  functionSrc: functionSrc,
  config: config
});

