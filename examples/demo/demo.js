import React, { Component } from "react";
import { Query, Builder, Preview, Utils } from "query-builder-lib";
const { queryBuilderFormat, queryString, mongodbFormat } = Utils;
// import config from "./config";
import config from "./configClient";
import convertCombination from "./combination";

var stringify = require("json-stringify-safe");
import "../../css/reset.scss";
import "../../css/styles.scss";
//import '../../css/compact_styles.scss';
import "../../css/denormalize.scss";
const Immutable = require("immutable");
const transit = require("transit-immutable-js");
import { fromJS } from "immutable";

// https://github.com/ukrbublik/react-awesome-query-builder/issues/69
var seriazlieAsImmutable = true;

var serializeTree, loadTree, initValue;
if (!seriazlieAsImmutable) {
  serializeTree = function(tree) {
    return JSON.stringify(tree.toJS());
  };
  loadTree = function(serTree) {
    let tree = JSON.parse(serTree);
    return fromJS(tree, function(key, value) {
      let outValue;
      if (key == "value" && value.get(0) && value.get(0).toJS !== undefined)
        outValue = Immutable.List.of(value.get(0).toJS());
      else
        outValue = Immutable.Iterable.isIndexed(value)
          ? value.toList()
          : value.toOrderedMap();
      return outValue;
    });
  };
  initValue =
    '{"type":"group","id":"9a99988a-0123-4456-b89a-b1607f326fd8","children1":{"a98ab9b9-cdef-4012-b456-71607f326fd9":{"type":"rule","id":"a98ab9b9-cdef-4012-b456-71607f326fd9","properties":{"field":"multicolor","operator":"multiselect_equals","value":[["yellow","green"]],"valueSrc":["value"],"operatorOptions":null,"valueType":["multiselect"]},"path":["9a99988a-0123-4456-b89a-b1607f326fd8","a98ab9b9-cdef-4012-b456-71607f326fd9"]}},"properties":{"conjunction":"AND","not":false},"path":["9a99988a-0123-4456-b89a-b1607f326fd8"]}';
} else {
  serializeTree = transit.toJSON;
  loadTree = transit.fromJSON;
  initValue =
    '["~#iM",["type","group","id","9a99988a-0123-4456-b89a-b1607f326fd8","children1",["^0",["9b99998b-0123-4456-b89a-b17014d8d65e",["^0",["type","rule","id","9b99998b-0123-4456-b89a-b17014d8d65e","properties",["^0",["field","6bfc5366-8f3e-4512-80f0-bde00b7d1a22","selectedInputSrcField","functionInput","functionSrc",["^ ","parameters",["#number-true-2#"],"functionSelected","Minus","valueSrc",["constant"],"dataTypes",["number"],"key","6bfc5366-8f3e-4512-80f0-bde00b7d1a22"],"operator","equal","value",["~#iL",[1]],"valueSrc",["^5",["value"]],"operatorOptions",null,"valueType",["^5",["number"]]]],"path",["^5",["9a99988a-0123-4456-b89a-b1607f326fd8","9b99998b-0123-4456-b89a-b17014d8d65e"]]]]]],"properties",["~#iOM",["conjunction","AND","not",false]],"path",["^5",["9a99988a-0123-4456-b89a-b1607f326fd8"]]]]';
  // '["~#iM",["type","group","id","9a99988a-0123-4456-b89a-b1607f326fd8","children1",["~#iOM",["a98ab9b9-cdef-4012-b456-71607f326fd9",["^0",["type","rule","id","a98ab9b9-cdef-4012-b456-71607f326fd9","properties",["^0",["field","age","operator","equal","value",["~#iL",[["^ ","parameters",["",0,false],"functionSelected","min","valueSrc",[]]]],"valueSrc",["^2",["function"]],"operatorOptions",null,"valueType",["^2",["funtion"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","a98ab9b9-cdef-4012-b456-71607f326fd9"]]]],"999ba9aa-0123-4456-b89a-b16ddcd31e6c",["^0",["type","rule","id","999ba9aa-0123-4456-b89a-b16ddcd31e6c","properties",["^0",["field","fullName","operator","equal","value",["^2",["a"]],"valueSrc",["^2",["constant"]],"operatorOptions",null,"valueType",["^2",["constant"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","999ba9aa-0123-4456-b89a-b16ddcd31e6c"]]]],"8a99a9b9-cdef-4012-b456-716ddcd3519b",["^0",["type","rule","id","8a99a9b9-cdef-4012-b456-716ddcd3519b","properties",["^0",["field","age","operator","equal","value",["^2",[["^ ","^3",[1,1,"2019-10-18T03:05:09.172Z"],"^4","average","^5",[]]]],"valueSrc",["^2",["function"]],"operatorOptions",null,"valueType",["^2",["funtion"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","8a99a9b9-cdef-4012-b456-716ddcd3519b"]]]],"99a8abb9-89ab-4cde-b012-316ddcd3ba93",["^0",["type","rule","id","99a8abb9-89ab-4cde-b012-316ddcd3ba93","properties",["^0",["field","age","operator","equal","value",["^2",[["^ ","^3",[1,1],"^4","sum","^5",[]]]],"valueSrc",["^2",["function"]],"operatorOptions",null,"valueType",["^2",["funtion"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","99a8abb9-89ab-4cde-b012-316ddcd3ba93"]]]]]],"properties",["^0",["conjunction","AND","not",false]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8"]]]]';
}

const dummy = {
  valueDefinitions: [
    {
      groupName: "Value Definition",
      name: "#text-true#",
      code: "0b1a76a0-42ea-4fea-8edb-66f3ffd1fc51",
      dataType: "text",
      parameterTypes: null,
      isList: true
    },
    {
      groupName: "Value Definition",
      name: "#text-false#",
      code: "95c37422-8a91-4785-a4a6-ca9a3d51d556",
      dataType: "text",
      parameterTypes: null,
      isList: false
    },
    {
      groupName: "Value Definition",
      name: "#number-true#",
      code: "bd7fcd4e-4838-424f-bb31-f938fd14e3a2",
      dataType: "number",
      parameterTypes: null,
      isList: true
    },
    {
      groupName: "Value Definition",
      name: "#number-true-2#",
      code: "constant 6",
      dataType: "number",
      parameterTypes: null,
      isList: true
    },
    {
      groupName: "Value Definition",
      name: "#text-false2#",
      code: "constant1",
      dataType: "text",
      parameterTypes: null,
      isList: false
    },
    {
      groupName: "Value Definition",
      name: "#number-false-2#",
      code: "constant2",
      dataType: "number",
      parameterTypes: null,
      isList: false
    },
    {
      groupName: "Value Definition",
      name: "#number-false-3#",
      code: "constant2",
      dataType: "number",
      parameterTypes: null,
      isList: false
    },
    {
      groupName: "Value Definition",
      name: "#number-true-3#",
      code: "constant2",
      dataType: "number",
      parameterTypes: null,
      isList: true
    },
    {
      groupName: "Value Definition",
      name: "#boolean-false",
      code: "constant3",
      dataType: "boolean",
      parameterTypes: null,
      isList: false
    },
    {
      groupName: "Value Definition",
      name: "#text-true-3",
      code: "constant4",
      dataType: "text",
      parameterTypes: null,
      isList: true
    },
    {
      groupName: "Value Definition",
      name: "#number-true-3#",
      code: "constant5",
      dataType: "number",
      parameterTypes: null,
      isList: true
    }
  ],
  functions: [
    {
      groupName: "Function",
      name: "Minus",
      code: "6bfc5366-8f3e-4512-80f0-bde00b7d1a22",
      dataType: "number",
      parameterTypes: "number",
      isList: true
    },
    {
      groupName: "Function",
      name: "ReplaceText1-true",
      code: "88d71c42-55a3-4bb5-a480-a38e04955a8d",
      dataType: "text",
      parameterTypes: "text;bool;number;date",
      isList: true
    },
    {
      groupName: "Function",
      name: "ReplaceText2-false",
      code: "88d71c42-55a3-4bb5-a480-a38e04955a8a",
      dataType: "text",
      parameterTypes: "text;bool",
      isList: false
    },
    {
      groupName: "Function",
      name: "IsExist",
      code: "88d71c42-55a3-4bb5-a480-a38e04955a8c",
      dataType: "bool",
      parameterTypes: "text;bool",
      isList: false
    }
  ],
  policyInputs: [
    {
      groupName: "Policy Input",
      name: "@Text-islist-true@",
      code: "012120f8-604a-45a7-be23-2dbfce4e4efb",
      dataType: "text",
      parameterTypes: null,
      isList: true
    },
    {
      groupName: "Policy Input",
      name: "@Text-isList-false@",
      code: "27cd2b46-b05a-4540-b794-0332e728f529",
      dataType: "text",
      parameterTypes: null,
      isList: false
    },
    {
      groupName: "Policy Input",
      name: "@Boolean - islist - false@",
      code: "59dffb51-10c2-4134-ba3b-31ed3dd89088",
      dataType: "bool",
      parameterTypes: null,
      isList: false
    },
    {
      groupName: "Policy Input",
      name: "@Boolean - islist - true@",
      code: "59dffb51-10c2-4134-ba3b-31ed3dd89088",
      dataType: "bool",
      parameterTypes: null,
      isList: true
    },
    {
      groupName: "Policy Input",
      name: "@Number - islist - true@",
      code: "012120f8-604a-45a7-be23-0jkf769123fb",
      dataType: "number",
      parameterTypes: null,
      isList: true
    },
    {
      groupName: "Policy Input",
      name: "@Number-isList-false@",
      code: "27cduhj6-b05a-4540-b794-8502e728f529",
      dataType: "number",
      parameterTypes: null,
      isList: false
    },
    {
      groupName: "Policy Input",
      name: "@Datetime - islist - true@",
      code: "012120f8-604a-4ma7-be23-0jkf769123fb",
      dataType: "datetime",
      parameterTypes: null,
      isList: true
    },
    {
      groupName: "Policy Input",
      name: "@Datetime-isList-false@",
      code: "27cduhj6-b05a-4540-b794-8502e728f5l9",
      dataType: "date",
      parameterTypes: null,
      isList: false
    }
  ]
};

const convertDummy = convertCombination(dummy);
const generatorConfigFunctionInput = dataCombination => {
  const functions = {};
  dataCombination.forEach(item => {
    functions[item.code] = {
      key: item.code,
      functionName: item.name || "",
      params: item.parameterTypes.split(";") || [],
      type: item.dataType || "",
      isList: item.isList || false
    };
  });
  return functions;
};

export default class DemoQueryBuilder extends Component {
  state = {
    constant: []
  };

  getChildren(props) {
    const jsonStyle = {
      backgroundColor: "darkgrey",
      margin: "10px",
      padding: "10px"
    };
    return (
      <div style={{ padding: "10px" }}>
        <div className="query-builder">
          <Builder {...props} />
        </div>
        <br />
        {/* <div>
          stringFormat:
          <pre style={jsonStyle}>
            {stringify(queryString(props.tree, props.config), undefined, 2)}
          </pre>
        </div> */}
        <hr />
        <div>
          queryBuilderFormat:
          <pre style={jsonStyle}>
            {stringify(
              queryBuilderFormat(props.tree, props.config),
              undefined,
              2
            )}
          </pre>
        </div>
        <hr />
        <div>
          Tree:
          <pre style={jsonStyle}>{stringify(props.tree, undefined, 2)}</pre>
        </div>
        <hr />
        <div>
          Serialized Tree:
          <div style={jsonStyle}>{transit.toJSON(props.tree)}</div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        constant: [
          { key: 1, name: "#ConstantA#", value: "a", type: "text" },
          { key: 2, name: "#ConstantB#", value: "b", type: "number" },
          { key: 3, name: "#ConstantC#", value: "c", type: "boolean" },
          { key: 4, name: "#ConstantD#", value: "d", type: "datetime" }
        ]
      });
    }, 0);
  }

  render() {
    const { constant } = this.state;
    const data = { constant };
    const { tree, ...config_props } = config;
    const functions = generatorConfigFunctionInput(dummy.functions);
    const configData = { ...config_props, ...convertDummy, functions, functionInputs: convertDummy.functionInputs };
    console.log("config: ", configData);
    const fields = {};
    return (
      <div>
        <Query
          value={transit.fromJSON(initValue)}
          get_children={this.getChildren}
          {...configData}
        />
      </div>
    );
  }
}
