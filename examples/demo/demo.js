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
import validationQuery from './validation'
// https://github.com/ukrbublik/react-awesome-query-builder/issues/69
var seriazlieAsImmutable = false;

var serializeTree, loadTree, initValue;
if (!seriazlieAsImmutable) {
  serializeTree = function(tree) {
    return JSON.stringify(tree.toJS());
  };
  loadTree = function(serTree) {
    let tree = JSON.parse(serTree);
    return fromJS(tree, function(key, value) {
      let outValue;
      if (key == "value" && value.get(0) && value.get(0).toJS !== undefined) {
        outValue = Immutable.List.of(value.get(0).toJS());
      }
      else if (key == "functionSrc" && value) {
        outValue = value.toJS();
      }
      else {
        outValue = Immutable.Iterable.isIndexed(value)
          ? value.toList()
          : value.toOrderedMap();
      }
      return outValue;
    });
  };
  initValue =
    `{
      "type": "group",
      "id": "9a99988a-0123-4456-b89a-b1607f326fd8",
      "children1": {
        "9b9a8988-0123-4456-b89a-b171589db2e2": {
          "type": "rule",
          "id": "9b9a8988-0123-4456-b89a-b171589db2e2",
          "properties": {
            "field": "A2B8E8ABACF84755E053040514AC72DA",
            "selectedInputSrcField": "functionInput",
            "functionSrc": {
              "parameters": [],
              "functionSelected": "TotalPercentageBE",
              "valueSrc": [],
              "dataTypes": [],
              "key": "A2B8E8ABACF84755E053040514AC72DA"
            },
            "operator": "equal",
            "value": [
              {
                "parameters": null,
                "functionSelected": "TotalPercentageEDUBE",
                "valueSrc": [],
                "dataTypes": [],
                "key": "A2B8E8ABACF94755E053040514AC72DA"
              }
            ],
            "valueSrc": [
              "function"
            ],
            "operatorOptions": null,
            "valueType": [
              "function"
            ]
          },
          "path": [
            "9a99988a-0123-4456-b89a-b1607f326fd8",
            "9b9a8988-0123-4456-b89a-b171589db2e2"
          ]
        }
      },
      "properties": {
        "conjunction": "OR",
        "not": false
      },
      "path": [
        "9a99988a-0123-4456-b89a-b1607f326fd8"
      ]
    }`;
} else {
  serializeTree = transit.toJSON;
  loadTree = transit.fromJSON;
  initValue =
    '["~#iM",["type","group","id","9a99988a-0123-4456-b89a-b1607f326fd8","children1",["^0",["9b99998b-0123-4456-b89a-b17014d8d65e",["^0",["type","rule","id","9b99998b-0123-4456-b89a-b17014d8d65e","properties",["^0",["field","88d71c42-55a3-4bb5-a480-a38e04955a8d","selectedInputSrcField","functionInput","functionSrc",["^ ","parameters",["#text-false2#",true,"#number-true-2#","2020-02-06T04:51:18.724Z"],"functionSelected","ReplaceText1-true","valueSrc",["constant","value","constant","value"],"dataTypes",["text","bool","number","date"],"key","88d71c42-55a3-4bb5-a480-a38e04955a8d"],"operator","equal","value",["~#iL",[["^ ","^1",["1",false],"^2","ReplaceText2-false","^3",["value","value"],"^4",["text","bool"],"key","88d71c42-55a3-4bb5-a480-a38e04955a8a"]]],"valueSrc",["^5",["function"]],"operatorOptions",null,"valueType",["^5",["funtion"]]]],"path",["^5",["9a99988a-0123-4456-b89a-b1607f326fd8","9b99998b-0123-4456-b89a-b17014d8d65e"]]]]]],"properties",["~#iOM",["conjunction","AND","not",false]],"path",["^5",["9a99988a-0123-4456-b89a-b1607f326fd8"]]]]';
  // '["~#iM",["type","group","id","9a99988a-0123-4456-b89a-b1607f326fd8","children1",["~#iOM",["a98ab9b9-cdef-4012-b456-71607f326fd9",["^0",["type","rule","id","a98ab9b9-cdef-4012-b456-71607f326fd9","properties",["^0",["field","age","operator","equal","value",["~#iL",[["^ ","parameters",["",0,false],"functionSelected","min","valueSrc",[]]]],"valueSrc",["^2",["function"]],"operatorOptions",null,"valueType",["^2",["funtion"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","a98ab9b9-cdef-4012-b456-71607f326fd9"]]]],"999ba9aa-0123-4456-b89a-b16ddcd31e6c",["^0",["type","rule","id","999ba9aa-0123-4456-b89a-b16ddcd31e6c","properties",["^0",["field","fullName","operator","equal","value",["^2",["a"]],"valueSrc",["^2",["constant"]],"operatorOptions",null,"valueType",["^2",["constant"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","999ba9aa-0123-4456-b89a-b16ddcd31e6c"]]]],"8a99a9b9-cdef-4012-b456-716ddcd3519b",["^0",["type","rule","id","8a99a9b9-cdef-4012-b456-716ddcd3519b","properties",["^0",["field","age","operator","equal","value",["^2",[["^ ","^3",[1,1,"2019-10-18T03:05:09.172Z"],"^4","average","^5",[]]]],"valueSrc",["^2",["function"]],"operatorOptions",null,"valueType",["^2",["funtion"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","8a99a9b9-cdef-4012-b456-716ddcd3519b"]]]],"99a8abb9-89ab-4cde-b012-316ddcd3ba93",["^0",["type","rule","id","99a8abb9-89ab-4cde-b012-316ddcd3ba93","properties",["^0",["field","age","operator","equal","value",["^2",[["^ ","^3",[1,1],"^4","sum","^5",[]]]],"valueSrc",["^2",["function"]],"operatorOptions",null,"valueType",["^2",["funtion"]]]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8","99a8abb9-89ab-4cde-b012-316ddcd3ba93"]]]]]],"properties",["^0",["conjunction","AND","not",false]],"path",["^2",["9a99988a-0123-4456-b89a-b1607f326fd8"]]]]';
}

// loadTree = serTree => {
//   const tree = JSON.parse(serTree);
//   return fromJS(tree, (key, value) => {
//     let outValue;
//     if (key === 'value' && value.get(0) && value.get(0).toJS !== undefined)
//       outValue = List.of(value.get(0).toJS());
//     else outValue = Iterable.isIndexed(value) ? value.toList() : value.toOrderedMap();
//     return outValue;
//   });
// };

const du = `{
  "type": "group",
  "id": "9a99988a-0123-4456-b89a-b1607f326fd8",
  "children1": {
    "8bb9aab8-0123-4456-b89a-b1701aa9e220": {
      "type": "rule",
      "id": "8bb9aab8-0123-4456-b89a-b1701aa9e220",
      "properties": {
        "field": "@Text-islist-true@",
        "selectedInputSrcField": "policyInput",
        "functionSrc": null,
        "operator": "not_equal",
        "value": [
          {
            "parameters": [
              "1",
              false
            ],
            "functionSelected": "ReplaceText2-false",
            "valueSrc": [
              "value",
              "value"
            ],
            "dataTypes": [
              "text",
              "bool"
            ],
            "key": "88d71c42-55a3-4bb5-a480-a38e04955a8a"
          }
        ],
        "valueSrc": [
          "function"
        ],
        "operatorOptions": null,
        "valueType": [
          "funtion"
        ]
      },
      "path": [
        "9a99988a-0123-4456-b89a-b1607f326fd8",
        "8bb9aab8-0123-4456-b89a-b1701aa9e220"
      ]
    }
  },
  "properties": {
    "conjunction": "AND",
    "not": false
  },
  "path": [
    "9a99988a-0123-4456-b89a-b1607f326fd8"
  ]
}`;

const dummy = { 
   "valueDefinitions":[
      {
         "groupName":"Value Definition",
         "name":"CreateTestHistory",
         "code":"CreateTestHistory",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"DinhLT3",
         "code":"DinhLT3",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Dinh_A2",
         "code":"Dinh_A2",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"LA_AgedddddTest22",
         "code":"LA_AgedddddTest22",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"test3",
         "code":"test3",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"1",
         "code":"1",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"1212",
         "code":"1212",
         "dataType":"text",
         "parameterTypes":null,
         "isList":true
      },
      {
         "groupName":"Value Definition",
         "name":"a",
         "code":"a",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"ABC",
         "code":"ABC",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"abc12121",
         "code":"abc12121",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"asdf",
         "code":"asdf",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Cá nhân",
         "code":"Cá nhân",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"dev-test",
         "code":"dev-test",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"DinhLT3 - test",
         "code":"DinhLT3 - test",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"file",
         "code":"file",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"File5",
         "code":"File5",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"File-đúng",
         "code":"File-đúng",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"LA_Age",
         "code":"LA_Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"LA_Ageddddd",
         "code":"LA_Ageddddd",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Mã sản phẩm HIRB",
         "code":"Mã sản phẩm HIRB",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"newTAbs",
         "code":"newTAbs",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"PhucVo",
         "code":"PhucVo",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"PO_Age",
         "code":"PO_Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Quý đây",
         "code":"Quý đây",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Request ổ cắm điện",
         "code":"Request ổ cắm điện",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Rule Là Gì",
         "code":"Rule Là Gì",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"test 1",
         "code":"test 1",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Test113131",
         "code":"Test113131",
         "dataType":"text",
         "parameterTypes":null,
         "isList":true
      },
      {
         "groupName":"Value Definition",
         "name":"Test35252",
         "code":"Test35252",
         "dataType":"bool",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Test35555",
         "code":"Test35555",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"testAccount13",
         "code":"testAccount13",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"TestDate",
         "code":"TestDate",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"TestForm",
         "code":"TestForm",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Testtstt252352352",
         "code":"Testtstt252352352",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"text value 3",
         "code":"text value 2",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"text value",
         "code":"text1",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"thuan value definition",
         "code":"thuan value definition",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"TuoiTT",
         "code":"TuoiTT",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"value_test111",
         "code":"value_test111",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"wwww",
         "code":"wwww",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Dinh_Test",
         "code":"Dinh_Test",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"3dd9d10d1da2cf72d34449e353cd9e1449c22907f7fc5f104a1295e2ac46d5ebfa9f87fc549ad9904987061b87ab045ff5dcb7d96f238a39ba17f9cd110bf962253856a06df49375291c3a",
         "code":"3dd9d10d1da2cf72d34449e353cd9e1449c22907f7fc5f104a1295e2ac46d5ebfa9f87fc549ad9904987061b87ab045ff5dcb7d96f238a39ba17f9cd110bf962253856a06df49375291c3a",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"c99bcdb5f9292c034f8fb5de94824ece00b3b953b2accbd987ee4e8c8aba6b3877685e3abe6c05844ec0b1cbb326b433c40856bcbb7989d71ad2e92164f5356022359bfdc74455ba5ed433",
         "code":"c99bcdb5f9292c034f8fb5de94824ece00b3b953b2accbd987ee4e8c8aba6b3877685e3abe6c05844ec0b1cbb326b433c40856bcbb7989d71ad2e92164f5356022359bfdc74455ba5ed433",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"DP_A",
         "code":"DP_A",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Test",
         "code":"Test",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Dinh_A3",
         "code":"Dinh_A3",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Dinh_A13",
         "code":"Dinh_A13",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"NGA_B",
         "code":"NGA_B",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Phuc",
         "code":"Phuc",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"Dinh_A1",
         "code":"Dinh_A1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"LA_Ageddddddwadw",
         "code":"LA_Ageddddddwadw",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Value Definition",
         "name":"B",
         "code":"B",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      }
   ],
   "functions":[
      {
         "groupName":"Function",
         "name":"CountTextLength",
         "code":"A016C83ABF49D2FEE053040514AC3ADE",
         "dataType":"number",
         "parameterTypes":"text",
         "isList":false
      },
      {
         "groupName":"Function",
         "name":"DateAdd",
         "code":"A016C83ABF4AD2FEE053040514AC3ADE",
         "dataType":"date",
         "parameterTypes":"text;date;number",
         "isList":false
      },
      {
         "groupName":"Function",
         "name":"CheckDocSubmitted",
         "code":"A21F3A2D6A40D5A8E053040514ACDFE4",
         "dataType":"bool",
         "parameterTypes":"text;text",
         "isList":false
      },
      {
         "groupName":"Function",
         "name":"TotalPercentageBE",
         "code":"A2B8E8ABACF84755E053040514AC72DA",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Function",
         "name":"TotalPercentageEDUBE",
         "code":"A2B8E8ABACF94755E053040514AC72DA",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      
   ],
   "policyInputs":[
      {
         "groupName":"Policy Input",
         "name":"LA6.DocType",
         "code":"LA6.DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6.Gender",
         "code":"LA6.Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6.Height",
         "code":"LA6.Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6.IDNo",
         "code":"LA6.IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6.Name",
         "code":"LA6.Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6.Phone1",
         "code":"LA6.Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6.RelationshipWithLA",
         "code":"LA6.RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6.RelationshipWithPO",
         "code":"LA6.RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6.Type",
         "code":"LA6.Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6.Weight",
         "code":"LA6.Weight",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6_Doc_CCCD",
         "code":"LA6_Doc_CCCD",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6_Doc_CMND",
         "code":"LA6_Doc_CMND",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6_Doc_DangKyKetHon",
         "code":"LA6_Doc_DangKyKetHon",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6_Doc_KhaiSinh",
         "code":"LA6_Doc_KhaiSinh",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6_ProdList",
         "code":"LA6_ProdList",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6_SA_HIRB",
         "code":"LA6_SA_HIRB",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7.Age",
         "code":"LA7.Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7.AgeDay",
         "code":"LA7.AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7.DOB",
         "code":"LA7.DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7.DocType",
         "code":"LA7.DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7.Gender",
         "code":"LA7.Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7.Height",
         "code":"LA7.Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7.IDNo",
         "code":"LA7.IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7.Name",
         "code":"LA7.Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7.Phone1",
         "code":"LA7.Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7.RelationshipWithLA",
         "code":"LA7.RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7.RelationshipWithPO",
         "code":"LA7.RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7.Type",
         "code":"LA7.Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7.Weight",
         "code":"LA7.Weight",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7_Doc_CCCD",
         "code":"LA7_Doc_CCCD",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"Case.BasicAnnual",
         "code":"Case.BasicAnnual",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"Case.ModePremium",
         "code":"Case.ModePremium",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"Case.SubmitPremium",
         "code":"Case.SubmitPremium",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"Case_ProdList",
         "code":"Case_ProdList",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"Case_SA_HIRB",
         "code":"Case_SA_HIRB",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"GLA.MaritalStatus",
         "code":"GLA.MaritalStatus",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA.Age",
         "code":"LA.Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA.AgeDay",
         "code":"LA.AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA.DOB",
         "code":"LA.DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA.DocType",
         "code":"LA.DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA.Gender",
         "code":"LA.Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA.Height",
         "code":"LA.Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA.IDNo",
         "code":"LA.IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA.Name",
         "code":"LA.Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA.Phone1",
         "code":"LA.Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA.RelationshipWithLA",
         "code":"LA.RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA.RelationshipWithPO",
         "code":"LA.RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA.Type",
         "code":"LA.Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA.Weight",
         "code":"LA.Weight",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA_Doc_CCCD",
         "code":"LA_Doc_CCCD",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA_Doc_CMND",
         "code":"LA_Doc_CMND",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA_Doc_DangKyKetHon",
         "code":"LA_Doc_DangKyKetHon",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA_Doc_KhaiSinh",
         "code":"LA_Doc_KhaiSinh",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA_ProdList",
         "code":"LA_ProdList",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA_SA_HIRB",
         "code":"LA_SA_HIRB",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1.Age",
         "code":"LA1.Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1.AgeDay",
         "code":"LA1.AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1.DOB",
         "code":"LA1.DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1.DocType",
         "code":"LA1.DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1.Gender",
         "code":"LA1.Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1.Height",
         "code":"LA1.Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1.IDNo",
         "code":"LA1.IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1.Name",
         "code":"LA1.Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1.Phone1",
         "code":"LA1.Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1.RelationshipWithLA",
         "code":"LA1.RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1.RelationshipWithPO",
         "code":"LA1.RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1.Type",
         "code":"LA1.Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1.Weight",
         "code":"LA1.Weight",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1_Doc_CCCD",
         "code":"LA1_Doc_CCCD",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1_Doc_CMND",
         "code":"LA1_Doc_CMND",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1_Doc_DangKyKetHon",
         "code":"LA1_Doc_DangKyKetHon",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1_Doc_KhaiSinh",
         "code":"LA1_Doc_KhaiSinh",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1_ProdList",
         "code":"LA1_ProdList",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA1_SA_HIRB",
         "code":"LA1_SA_HIRB",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2.Age",
         "code":"LA2.Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2.AgeDay",
         "code":"LA2.AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2.DOB",
         "code":"LA2.DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2.DocType",
         "code":"LA2.DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2.Gender",
         "code":"LA2.Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2.Height",
         "code":"LA2.Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2.IDNo",
         "code":"LA2.IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2.Name",
         "code":"LA2.Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2.Phone1",
         "code":"LA2.Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2.RelationshipWithLA",
         "code":"LA2.RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2.RelationshipWithPO",
         "code":"LA2.RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2.Type",
         "code":"LA2.Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2.Weight",
         "code":"LA2.Weight",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2_Doc_CCCD",
         "code":"LA2_Doc_CCCD",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2_Doc_CMND",
         "code":"LA2_Doc_CMND",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2_Doc_DangKyKetHon",
         "code":"LA2_Doc_DangKyKetHon",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2_Doc_KhaiSinh",
         "code":"LA2_Doc_KhaiSinh",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2_ProdList",
         "code":"LA2_ProdList",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA2_SA_HIRB",
         "code":"LA2_SA_HIRB",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3.Age",
         "code":"LA3.Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3.AgeDay",
         "code":"LA3.AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3.DOB",
         "code":"LA3.DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3.DocType",
         "code":"LA3.DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3.Gender",
         "code":"LA3.Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3.Height",
         "code":"LA3.Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3.IDNo",
         "code":"LA3.IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3.Name",
         "code":"LA3.Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3.Phone1",
         "code":"LA3.Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3.RelationshipWithLA",
         "code":"LA3.RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3.RelationshipWithPO",
         "code":"LA3.RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3.Type",
         "code":"LA3.Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3.Weight",
         "code":"LA3.Weight",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3_Doc_CCCD",
         "code":"LA3_Doc_CCCD",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3_Doc_CMND",
         "code":"LA3_Doc_CMND",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3_Doc_DangKyKetHon",
         "code":"LA3_Doc_DangKyKetHon",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3_Doc_KhaiSinh",
         "code":"LA3_Doc_KhaiSinh",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3_ProdList",
         "code":"LA3_ProdList",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA3_SA_HIRB",
         "code":"LA3_SA_HIRB",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4.Age",
         "code":"LA4.Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4.AgeDay",
         "code":"LA4.AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4.DOB",
         "code":"LA4.DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4.DocType",
         "code":"LA4.DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4.Gender",
         "code":"LA4.Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4.Height",
         "code":"LA4.Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4.IDNo",
         "code":"LA4.IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4.Name",
         "code":"LA4.Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4.Phone1",
         "code":"LA4.Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4.RelationshipWithLA",
         "code":"LA4.RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4.RelationshipWithPO",
         "code":"LA4.RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4.Type",
         "code":"LA4.Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4.Weight",
         "code":"LA4.Weight",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4_Doc_CCCD",
         "code":"LA4_Doc_CCCD",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4_Doc_CMND",
         "code":"LA4_Doc_CMND",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4_Doc_DangKyKetHon",
         "code":"LA4_Doc_DangKyKetHon",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4_Doc_KhaiSinh",
         "code":"LA4_Doc_KhaiSinh",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4_ProdList",
         "code":"LA4_ProdList",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA4_SA_HIRB",
         "code":"LA4_SA_HIRB",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5.Age",
         "code":"LA5.Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5.AgeDay",
         "code":"LA5.AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5.DOB",
         "code":"LA5.DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5.DocType",
         "code":"LA5.DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5.Gender",
         "code":"LA5.Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5.Height",
         "code":"LA5.Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5.IDNo",
         "code":"LA5.IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5.Name",
         "code":"LA5.Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5.Phone1",
         "code":"LA5.Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5.RelationshipWithLA",
         "code":"LA5.RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5.RelationshipWithPO",
         "code":"LA5.RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5.Type",
         "code":"LA5.Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5.Weight",
         "code":"LA5.Weight",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5_Doc_CCCD",
         "code":"LA5_Doc_CCCD",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5_Doc_CMND",
         "code":"LA5_Doc_CMND",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5_Doc_DangKyKetHon",
         "code":"LA5_Doc_DangKyKetHon",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5_Doc_KhaiSinh",
         "code":"LA5_Doc_KhaiSinh",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5_ProdList",
         "code":"LA5_ProdList",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA5_SA_HIRB",
         "code":"LA5_SA_HIRB",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6.Age",
         "code":"LA6.Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6.AgeDay",
         "code":"LA6.AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA6.DOB",
         "code":"LA6.DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7_Doc_CMND",
         "code":"LA7_Doc_CMND",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7_Doc_DangKyKetHon",
         "code":"LA7_Doc_DangKyKetHon",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7_Doc_KhaiSinh",
         "code":"LA7_Doc_KhaiSinh",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7_ProdList",
         "code":"LA7_ProdList",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"LA7_SA_HIRB",
         "code":"LA7_SA_HIRB",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO.Age",
         "code":"PO.Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO.AgeDay",
         "code":"PO.AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO.DOB",
         "code":"PO.DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO.DocType",
         "code":"PO.DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO.Gender",
         "code":"PO.Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO.Height",
         "code":"PO.Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO.IDNo",
         "code":"PO.IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO.Name",
         "code":"PO.Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO.Phone1",
         "code":"PO.Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO.RelationshipWithLA",
         "code":"PO.RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO.RelationshipWithPO",
         "code":"PO.RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO.Type",
         "code":"PO.Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO.Weight",
         "code":"PO.Weight",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO_Doc_CCCD",
         "code":"PO_Doc_CCCD",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO_Doc_CMND",
         "code":"PO_Doc_CMND",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO_Doc_DangKyKetHon",
         "code":"PO_Doc_DangKyKetHon",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      {
         "groupName":"Policy Input",
         "name":"PO_Doc_KhaiSinh",
         "code":"PO_Doc_KhaiSinh",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
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
      params: item.parameterTypes ? item.parameterTypes.split(";") || [] : [],
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
    const validate = function (tree) {
      const data = validationQuery(tree);
      console.log(data);
      
     }
    return (
      <div style={{ padding: "10px" }}>
          <button onClick={() => validate(props.tree.toJS())} >aaaaaaaa</button>
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
    // const loadInit = loadTree(du);
    const loadInit = loadTree(initValue);
    return (
      <div>
        <Query
          value={loadInit}
          get_children={this.getChildren}
          {...configData}
        />
       
      </div>
    );
  }
}
