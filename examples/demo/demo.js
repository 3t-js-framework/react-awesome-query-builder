import React, { Component } from "react";
import { Query, Builder, Preview, Utils } from "query-builder-lib";
const { queryBuilderFormat, queryString, mongodbFormat } = Utils;
import config from "./config";
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
  // '["~#iM",["type","group","id","9a99988a-0123-4456-b89a-b1607f326fd8","children1",["~#iOM",["a98ab9b9-cdef-4012-b456-71607f326fd9",["^0",["type","rule","id","a98ab9b9-cdef-4012-b456-71607f326fd9","properties",["^0",["field","fullName","operator","equal","value",["~#iL",[["^ ","parameters",["a","a"],"functionSelected","replaceText"]]],"valueSrc",["^2",["function"]],"operatorOptions",null,"valueType",["^2",["funtion"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","a98ab9b9-cdef-4012-b456-71607f326fd9"]]]],"9a89baaa-0123-4456-b89a-b16dcdac4a02",["^0",["type","rule","id","9a89baaa-0123-4456-b89a-b16dcdac4a02","properties",["^0",["field","age","operator","equal","value",["^2",[["^ ","^3",[1,1,1,1],"^4","min"]]],"valueSrc",["^2",["function"]],"operatorOptions",null,"valueType",["^2",["funtion"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","9a89baaa-0123-4456-b89a-b16dcdac4a02"]]]],"899b898a-cdef-4012-b456-716dcdac86c7",["^0",["type","rule","id","899b898a-cdef-4012-b456-716dcdac86c7","properties",["^0",["field","age","operator","equal","value",["^2",[["^ ","^3",[2,2],"^4","max"]]],"valueSrc",["^2",["function"]],"operatorOptions",null,"valueType",["^2",["funtion"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","899b898a-cdef-4012-b456-716dcdac86c7"]]]],"b9b89ba9-89ab-4cde-b012-316dcdacc268",["^0",["type","rule","id","b9b89ba9-89ab-4cde-b012-316dcdacc268","properties",["^0",["field","age","operator","equal","value",["^2",["num"]],"valueSrc",["^2",["field"]],"operatorOptions",null,"valueType",["^2",["number"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","b9b89ba9-89ab-4cde-b012-316dcdacc268"]]]]]],"properties",["^0",["conjunction","AND","not",false]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8"]]]]'
    '["~#iM",["type","group","id","9a99988a-0123-4456-b89a-b1607f326fd8","children1",["~#iOM",["a98ab9b9-cdef-4012-b456-71607f326fd9",["^0",["type","rule","id","a98ab9b9-cdef-4012-b456-71607f326fd9","properties",["^0",["field","age","operator","equal","value",["~#iL",[["^ ","parameters",["",0,false],"functionSelected","min","valueSrc",[]]]],"valueSrc",["^2",["function"]],"operatorOptions",null,"valueType",["^2",["funtion"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","a98ab9b9-cdef-4012-b456-71607f326fd9"]]]],"999ba9aa-0123-4456-b89a-b16ddcd31e6c",["^0",["type","rule","id","999ba9aa-0123-4456-b89a-b16ddcd31e6c","properties",["^0",["field","fullName","operator","equal","value",["^2",["a"]],"valueSrc",["^2",["constant"]],"operatorOptions",null,"valueType",["^2",["constant"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","999ba9aa-0123-4456-b89a-b16ddcd31e6c"]]]],"8a99a9b9-cdef-4012-b456-716ddcd3519b",["^0",["type","rule","id","8a99a9b9-cdef-4012-b456-716ddcd3519b","properties",["^0",["field","age","operator","equal","value",["^2",[["^ ","^3",[1,1,"2019-10-18T03:05:09.172Z"],"^4","average","^5",[]]]],"valueSrc",["^2",["function"]],"operatorOptions",null,"valueType",["^2",["funtion"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","8a99a9b9-cdef-4012-b456-716ddcd3519b"]]]],"99a8abb9-89ab-4cde-b012-316ddcd3ba93",["^0",["type","rule","id","99a8abb9-89ab-4cde-b012-316ddcd3ba93","properties",["^0",["field","age","operator","equal","value",["^2",[["^ ","^3",[1,1],"^4","sum","^5",[]]]],"valueSrc",["^2",["function"]],"operatorOptions",null,"valueType",["^2",["funtion"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","99a8abb9-89ab-4cde-b012-316ddcd3ba93"]]]]]],"properties",["^0",["conjunction","AND","not",false]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8"]]]]';
}

/*
let ruleset = {
    "condition": "AND",
    "rules": [
        {
            "id": "name",
            "field": "name",
            "type": "string",
            "input": "text",
            "operator": "less",
            "value": "test name"
        },
        {
            "condition": "OR",
            "rules": [
                {
                    "id": "category",
                    "field": "date",
                    "type": "date",
                    "input": "date",
                    "operator": "equal",
                    "value": "2012-01-12"
                },
                {
                    "id": "category",
                    "field": "name",
                    "type": "string",
                    "input": "text",
                    "operator": "equal",
                    "value": "1"
                }
            ]
        }
    ]
}
*/

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
        <div>
          stringFormat:
          <pre style={jsonStyle}>
            {stringify(queryString(props.tree, props.config), undefined, 2)}
          </pre>
        </div>
        <hr />
        <div>
          humanStringFormat:
          <pre style={jsonStyle}>
            {stringify(
              queryString(props.tree, props.config, true),
              undefined,
              2
            )}
          </pre>
        </div>
        <hr />
        <div>
          mongodbFormat:
          <pre style={jsonStyle}>
            {stringify(mongodbFormat(props.tree, props.config), undefined, 2)}
          </pre>
        </div>
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
          <div style={jsonStyle}>{serializeTree(props.tree)}</div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        constant: [
          { key: 1, name: "Constant A", value: "a" },
          { key: 2, name: "Constant B", value: "b" },
          { key: 4, name: "Constant C", value: "c" },
          { key: 4, name: "Constant D", value: "d" }
        ]
      });
    }, 0);
  }

  render() {
    const { constant } = this.state;
    const data = { constant };
    const { tree, ...config_props } = config;
    console.log("config: ", config_props);
    console.log("config: ", constant);

    return (
      <div>
        <Query
          value={loadTree(initValue)}
          {...config_props}
          data={data}
          get_children={this.getChildren}
        >
          {" "}
        </Query>
      </div>
    );
  }
}
