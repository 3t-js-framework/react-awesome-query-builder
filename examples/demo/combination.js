// import _forEach from 'lodash/forEach';

const fields = {};

const getListConstants = (dataType = "", valueDefinitions = []) => {
  const result = valueDefinitions.filter(x => x.dataType === dataType);
  return result;
};

const getListOperators = (type, isList) => {
  const operatorsForList = ["select_any_in", "select_not_any_in"];
  const operatorsForEqual = ["equal", "not_equal"];
  const operatorsForEmpty = ["is_empty", "is_not_empty"];
  const defaultOperators = [
    "less",
    "less_or_equal",
    "greater",
    "greater_or_equal"
  ];

  let result = [];

  switch (type) {
    case "text":
      result = [...operatorsForEqual, ...operatorsForList];
      break;
    case "number":
      result = [
        ...operatorsForEqual,
        ...defaultOperators,
        ...operatorsForEmpty
      ];
      if (isList) {
        result = [...result, ...operatorsForList];
      }
      break;
    case "boolean":
      result = [...operatorsForEqual, ...operatorsForEmpty];
      if (isList) {
        result = [...result, ...operatorsForList];
      }
      break;
    case "datetime":
      result = [
        ...operatorsForEqual,
        ...defaultOperators,
        ...operatorsForEmpty
      ];
      if (isList) {
        result = [...result, ...operatorsForList];
      }
      break;
    default:
      break;
  }

  return result;
};

function convertValueDefinition(valueDefinitions) {
  const result = valueDefinitions.map((value, index) => ({
    ...value,
    key: index + 1
  }));
  return result;
}

function convertCombination(combination) {
  if (!combination) return;

  const {
    policyInputs = [],
    valueDefinitions = [],
    functions = []
  } = combination;

  // get policy input

  policyInputs.forEach(function(item) {
    const listConstants = getListConstants(item.dataType, valueDefinitions);
    const operators = getListOperators(item.dataType, item.isList);
    console.log("operators: ", operators);

    fields[item.name] = {
      label: item.name,
      type: item.dataType,
      isList: item.isList,
      listConstants,
      operators
    };
  });

  const constants = convertValueDefinition(valueDefinitions);

  const result = { fields, constants, functions };

  return result;
}

export default convertCombination;
