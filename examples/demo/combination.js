// import _forEach from 'lodash/forEach';

const fields = {};
const functionInputs = {};

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

  switch (String(type).toLowerCase()) {
    case "text":
      result = [
        ...defaultOperators, 
        ...operatorsForEqual, 
        ...operatorsForList, 
        ...operatorsForEmpty
      ];
      break;
    case "number":
      result = [
        ...operatorsForEqual,
        ...defaultOperators,
        ...operatorsForList,
        ...operatorsForEmpty
      ];
      // if (isList) {
      //   result = [...result, ...operatorsForList];
      // }
      break;
    case "bool":
      result = [...operatorsForEqual, ...operatorsForEmpty];
      // if (isList) {
      //   result = [...result, ...operatorsForList];
      // }
      break;
    case "date":
      result = [
        ...operatorsForEqual,
        ...defaultOperators,
        ...operatorsForList,
        ...operatorsForEmpty
      ];
      // if (isList) {
      //   result = [...result, ...operatorsForList];
      // }
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

function convertDataType(dataType) {
  let result = String(dataType).toLowerCase();
  if(!['text','bool','number','date'].includes(result)){
    result = 'text';
  };
  return result
}

function convertCombination(combination) {
  if (!combination) return;

  const {
    policyInputs = [],
    valueDefinitions = [],
    functions = []
  } = combination;

  // get policy input

  policyInputs.sort((a,b) => String(a.name).localeCompare(String(b.name))).forEach(function(item) {
    const dataType = convertDataType(item.dataType);
    const listConstants = getListConstants(dataType, valueDefinitions);
    const operators = getListOperators(dataType, item.isList);
    
    fields[item.name] = {
      label: item.name,
      inputSrc: 'policyInput',
      type: dataType,
      isList: item.isList,
      listConstants,
      operators
    };
  });

  functions.sort((a,b) => String(a.name).localeCompare(String(b.name))).forEach(function(item) {
    const dataType = convertDataType(item.dataType);
    const listConstants = valueDefinitions; // set all constants for functionInput
    const operators = getListOperators(dataType, item.isList);
    fields[item.code] = {
      label: item.name,
      key: item.code,
      inputSrc: 'functionInput',
      functionName: item.name || "",
      params: item.parameterTypes.split(";") || [],
      type: dataType || "",
      isList: item.isList || false,
      listConstants,
      operators
    };
  });

  valueDefinitions.sort((a,b) => String(a.name).localeCompare(String(b.name))).forEach(function(item) {
    const dataType = convertDataType(item.dataType);
    const listConstants = getListConstants(dataType, valueDefinitions); // set all constants for functionInput
    const operators = getListOperators(dataType, item.isList);
    fields[item.name] = {
      label: item.name,
      inputSrc: 'valueDefination',
      type: dataType || "",
      isList: item.isList || false,
      listConstants,
      operators
    };
  });

  const constants = convertValueDefinition(valueDefinitions);
  const result = { fields, constants, functions, functionInputs };

  return result;
}

export default convertCombination;
