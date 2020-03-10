import _isEmpty from 'lodash/isEmpty';
import _isNull from 'lodash/isNull'
const tree = {
  "type": "group",
  "id": "9a99988a-0123-4456-b89a-b1607f326fd8",
  "children1": {
    "9bbbb9aa-0123-4456-b89a-b1709fd7b25d": {
      "type": "rule",
      "id": "9bbbb9aa-0123-4456-b89a-b1709fd7b25d",
      "properties": {
        "field": "Case_Pre_BasicAnnual",
        "selectedInputSrcField": "policyInput",
        "functionSrc": null,
        "operator": "equal",
        "value": [
          null
        ],
        "valueSrc": [
          "field"
        ],
        "operatorOptions": null,
        "valueType": [
          null
        ]
      },
      "path": [
        "9a99988a-0123-4456-b89a-b1607f326fd8",
        "9bbbb9aa-0123-4456-b89a-b1709fd7b25d"
      ]
    },
    "8aaa9bb8-cdef-4012-b456-71709fdb6f21": {
      "type": "rule",
      "id": "8aaa9bb8-cdef-4012-b456-71709fdb6f21",
      "properties": {
        "field": null,
        "selectedInputSrcField": null,
        "functionSrc": null,
        "operator": null,
        "value": [],
        "valueSrc": [],
        "operatorOptions": null
      },
      "path": [
        "9a99988a-0123-4456-b89a-b1607f326fd8",
        "8aaa9bb8-cdef-4012-b456-71709fdb6f21"
      ]
    },
    "a9b89b98-89ab-4cde-b012-31709fdb70ec": {
      "type": "rule",
      "id": "a9b89b98-89ab-4cde-b012-31709fdb70ec",
      "properties": {
        "field": null,
        "selectedInputSrcField": null,
        "functionSrc": null,
        "operator": null,
        "value": [],
        "valueSrc": [],
        "operatorOptions": null
      },
      "path": [
        "9a99988a-0123-4456-b89a-b1607f326fd8",
        "a9b89b98-89ab-4cde-b012-31709fdb70ec"
      ]
    },
    "9a88bbb8-4567-489a-bcde-f1709fdb7309": {
      "type": "group",
      "id": "9a88bbb8-4567-489a-bcde-f1709fdb7309",
      "properties": {
        "conjunction": "AND"
      },
      "path": [
        "9a99988a-0123-4456-b89a-b1607f326fd8",
        "9a88bbb8-4567-489a-bcde-f1709fdb7309"
      ],
      "children1": {
        "8a8b99bb-0123-4456-b89a-b1709fdb730a": {
          "type": "rule",
          "id": "8a8b99bb-0123-4456-b89a-b1709fdb730a",
          "properties": {
            "field": null,
            "selectedInputSrcField": null,
            "functionSrc": null,
            "operator": null,
            "value": [],
            "valueSrc": [],
            "operatorOptions": null,
            "conjunction": "AND"
          },
          "path": [
            "9a99988a-0123-4456-b89a-b1607f326fd8",
            "9a88bbb8-4567-489a-bcde-f1709fdb7309",
            "8a8b99bb-0123-4456-b89a-b1709fdb730a"
          ]
        },
        "bba988a9-cdef-4012-b456-71709fdb791d": {
          "type": "group",
          "id": "bba988a9-cdef-4012-b456-71709fdb791d",
          "properties": {
            "conjunction": "AND"
          },
          "path": [
            "9a99988a-0123-4456-b89a-b1607f326fd8",
            "9a88bbb8-4567-489a-bcde-f1709fdb7309",
            "bba988a9-cdef-4012-b456-71709fdb791d"
          ],
          "children1": {
            "aa898a9a-89ab-4cde-b012-31709fdb791e": {
              "type": "rule",
              "id": "aa898a9a-89ab-4cde-b012-31709fdb791e",
              "properties": {
                "field": null,
                "selectedInputSrcField": null,
                "functionSrc": null,
                "operator": null,
                "value": [],
                "valueSrc": [],
                "operatorOptions": null,
                "conjunction": "AND"
              },
              "path": [
                "9a99988a-0123-4456-b89a-b1607f326fd8",
                "9a88bbb8-4567-489a-bcde-f1709fdb7309",
                "bba988a9-cdef-4012-b456-71709fdb791d",
                "aa898a9a-89ab-4cde-b012-31709fdb791e"
              ]
            },
            "88bb8a88-4567-489a-bcde-f1709fdb80b4": {
              "type": "rule",
              "id": "88bb8a88-4567-489a-bcde-f1709fdb80b4",
              "properties": {
                "field": null,
                "selectedInputSrcField": null,
                "functionSrc": null,
                "operator": null,
                "value": [],
                "valueSrc": [],
                "operatorOptions": null
              },
              "path": [
                "9a99988a-0123-4456-b89a-b1607f326fd8",
                "9a88bbb8-4567-489a-bcde-f1709fdb7309",
                "bba988a9-cdef-4012-b456-71709fdb791d",
                "88bb8a88-4567-489a-bcde-f1709fdb80b4"
              ]
            },
            "bab8b8bb-0123-4456-b89a-b1709fdb8252": {
              "type": "group",
              "id": "bab8b8bb-0123-4456-b89a-b1709fdb8252",
              "properties": {
                "conjunction": "AND"
              },
              "path": [
                "9a99988a-0123-4456-b89a-b1607f326fd8",
                "9a88bbb8-4567-489a-bcde-f1709fdb7309",
                "bba988a9-cdef-4012-b456-71709fdb791d",
                "bab8b8bb-0123-4456-b89a-b1709fdb8252"
              ],
              "children1": {
                "88abb88a-cdef-4012-b456-71709fdb8252": {
                  "type": "rule",
                  "id": "88abb88a-cdef-4012-b456-71709fdb8252",
                  "properties": {
                    "field": null,
                    "selectedInputSrcField": null,
                    "functionSrc": null,
                    "operator": null,
                    "value": [],
                    "valueSrc": [],
                    "operatorOptions": null,
                    "conjunction": "AND"
                  },
                  "path": [
                    "9a99988a-0123-4456-b89a-b1607f326fd8",
                    "9a88bbb8-4567-489a-bcde-f1709fdb7309",
                    "bba988a9-cdef-4012-b456-71709fdb791d",
                    "bab8b8bb-0123-4456-b89a-b1709fdb8252",
                    "88abb88a-cdef-4012-b456-71709fdb8252"
                  ]
                }
              }
            }
          }
        }
      }
    },
    "bab9ba98-89ab-4cde-b012-31709fdcedef": {
      "type": "group",
      "id": "bab9ba98-89ab-4cde-b012-31709fdcedef",
      "properties": {
        "conjunction": "AND"
      },
      "path": [
        "9a99988a-0123-4456-b89a-b1607f326fd8",
        "bab9ba98-89ab-4cde-b012-31709fdcedef"
      ],
      "children1": {
        "9a9b9aba-4567-489a-bcde-f1709fdcedf2": {
          "type": "rule",
          "id": "9a9b9aba-4567-489a-bcde-f1709fdcedf2",
          "properties": {
            "field": null,
            "selectedInputSrcField": null,
            "functionSrc": null,
            "operator": null,
            "value": [],
            "valueSrc": [],
            "operatorOptions": null,
            "conjunction": "AND"
          },
          "path": [
            "9a99988a-0123-4456-b89a-b1607f326fd8",
            "bab9ba98-89ab-4cde-b012-31709fdcedef",
            "9a9b9aba-4567-489a-bcde-f1709fdcedf2"
          ]
        },
        "b888b99b-89ab-4cde-b012-31709fde4073": {
          "type": "group",
          "id": "b888b99b-89ab-4cde-b012-31709fde4073",
          "properties": {
            "conjunction": "AND"
          },
          "path": [
            "9a99988a-0123-4456-b89a-b1607f326fd8",
            "bab9ba98-89ab-4cde-b012-31709fdcedef",
            "b888b99b-89ab-4cde-b012-31709fde4073"
          ],
          "children1": {
            "a89baa88-4567-489a-bcde-f1709fde4075": {
              "type": "rule",
              "id": "a89baa88-4567-489a-bcde-f1709fde4075",
              "properties": {
                "field": null,
                "selectedInputSrcField": null,
                "functionSrc": null,
                "operator": null,
                "value": [],
                "valueSrc": [],
                "operatorOptions": null,
                "conjunction": "AND"
              },
              "path": [
                "9a99988a-0123-4456-b89a-b1607f326fd8",
                "bab9ba98-89ab-4cde-b012-31709fdcedef",
                "b888b99b-89ab-4cde-b012-31709fde4073",
                "a89baa88-4567-489a-bcde-f1709fde4075"
              ]
            }
          }
        }
      }
    },
    "b9a89bab-0123-4456-b89a-b1709fdd37ae": {
      "type": "rule",
      "id": "b9a89bab-0123-4456-b89a-b1709fdd37ae",
      "properties": {
        "field": null,
        "selectedInputSrcField": null,
        "functionSrc": null,
        "operator": null,
        "value": [],
        "valueSrc": [],
        "operatorOptions": null
      },
      "path": [
        "9a99988a-0123-4456-b89a-b1607f326fd8",
        "b9a89bab-0123-4456-b89a-b1709fdd37ae"
      ]
    },
    "b899aa88-cdef-4012-b456-71709fde0ac7": {
      "type": "rule",
      "id": "b899aa88-cdef-4012-b456-71709fde0ac7",
      "properties": {
        "field": null,
        "selectedInputSrcField": null,
        "functionSrc": null,
        "operator": null,
        "value": [],
        "valueSrc": [],
        "operatorOptions": null
      },
      "path": [
        "9a99988a-0123-4456-b89a-b1607f326fd8",
        "b899aa88-cdef-4012-b456-71709fde0ac7"
      ]
    },
    "99b8989a-0123-4456-b89a-b1709fde5ed9": {
      "type": "group",
      "id": "99b8989a-0123-4456-b89a-b1709fde5ed9",
      "properties": {
        "conjunction": "AND"
      },
      "path": [
        "9a99988a-0123-4456-b89a-b1607f326fd8",
        "99b8989a-0123-4456-b89a-b1709fde5ed9"
      ],
      "children1": {
        "9988a8aa-cdef-4012-b456-71709fde5eda": {
          "type": "rule",
          "id": "9988a8aa-cdef-4012-b456-71709fde5eda",
          "properties": {
            "field": null,
            "selectedInputSrcField": null,
            "functionSrc": null,
            "operator": null,
            "value": [],
            "valueSrc": [],
            "operatorOptions": null,
            "conjunction": "AND"
          },
          "path": [
            "9a99988a-0123-4456-b89a-b1607f326fd8",
            "99b8989a-0123-4456-b89a-b1709fde5ed9",
            "9988a8aa-cdef-4012-b456-71709fde5eda"
          ]
        },
        "b9899a88-4567-489a-bcde-f1709fde70a6": {
          "type": "group",
          "id": "b9899a88-4567-489a-bcde-f1709fde70a6",
          "properties": {
            "conjunction": "AND"
          },
          "path": [
            "9a99988a-0123-4456-b89a-b1607f326fd8",
            "99b8989a-0123-4456-b89a-b1709fde5ed9",
            "b9899a88-4567-489a-bcde-f1709fde70a6"
          ],
          "children1": {
            "98988a8a-0123-4456-b89a-b1709fde70a7": {
              "type": "rule",
              "id": "98988a8a-0123-4456-b89a-b1709fde70a7",
              "properties": {
                "field": null,
                "selectedInputSrcField": null,
                "functionSrc": null,
                "operator": null,
                "value": [],
                "valueSrc": [],
                "operatorOptions": null,
                "conjunction": "AND"
              },
              "path": [
                "9a99988a-0123-4456-b89a-b1607f326fd8",
                "99b8989a-0123-4456-b89a-b1709fde5ed9",
                "b9899a88-4567-489a-bcde-f1709fde70a6",
                "98988a8a-0123-4456-b89a-b1709fde70a7"
              ]
            }
          }
        }
      }
    },
    "99a8b8ba-89ab-4cde-b012-31709fde61d8": {
      "type": "rule",
      "id": "99a8b8ba-89ab-4cde-b012-31709fde61d8",
      "properties": {
        "field": null,
        "selectedInputSrcField": null,
        "functionSrc": null,
        "operator": null,
        "value": [],
        "valueSrc": [],
        "operatorOptions": null
      },
      "path": [
        "9a99988a-0123-4456-b89a-b1607f326fd8",
        "99a8b8ba-89ab-4cde-b012-31709fde61d8"
      ]
    }
  },
  "properties": {
    "conjunction": "AND",
    "not": true
  },
  "path": [
    "9a99988a-0123-4456-b89a-b1607f326fd8"
  ]
};



// const validationTree = (tree) => {
//   if(!tree) return null;
//   const {type, children1, properties} = tree
//   if(type === 'group' && !_isEmpty(children1)){
//     for(var x in children1){
//       validationTree(children1[x])
//     }
    
//   }else if(type === 'rule') {
//     const check = checkLeftCondition(properties);
//     if(!check) return false
//   }

//   return true;
// };
const checkLeftCondition = (properties = {}) => {
  const {selectedInputSrcField, field, value, valueSrc, operator} = properties;
  const resultValue = value[0];
  if(!selectedInputSrcField || !field){
    return false
  } else if(!resultValue && operator !== "is_empty" && operator !== "is_not_empty") {
    return false
  }

  if(valueSrc[0] === 'function'){
    const {parameters} = resultValue;
    const check = parameters.some(function(param){
      return param === null || param === ""
    });
    if(check){
      return false;
      
    }
  }
  return true
};

const checkRule = (tree) => {
  let checkPass = true;

  const validationTree = (tree) => {
    if(!tree) return null;
    const {type, children1, properties} = tree
    if(type === 'group' && !_isEmpty(children1)){
      for(var x in children1){
        validationTree(children1[x])
      }
    }else if(type === 'rule') {
      const check = checkLeftCondition(properties);
      if(!check){
        checkPass = false;
        return
      }
    }
    return true;
  };
  validationTree(tree);
  return checkPass;
}

export default checkRule;