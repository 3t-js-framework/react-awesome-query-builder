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
        "a9a899a9-89ab-4cde-b012-31702e7372c8": {
          "type": "rule",
          "id": "a9a899a9-89ab-4cde-b012-31702e7372c8",
          "properties": {
            "field": "@Boolean - islist - false@",
            "selectedInputSrcField": "policyInput",
            "functionSrc": null,
            "operator": "equal",
            "value": [
              {
                "parameters": [
                  "",
                  true
                ],
                "functionSelected": "IsExist",
                "valueSrc": [
                  "field",
                  "value"
                ],
                "dataTypes": [
                  "text",
                  "bool"
                ],
                "key": "88d71c42-55a3-4bb5-a480-a38e04955a8c"
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
            "a9a899a9-89ab-4cde-b012-31702e7372c8"
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
         "dataType":"number",
         "parameterTypes":null,
         "isList":true
      },
      { 
         "groupName":"Value Definition",
         "name":"a",
         "code":"a",
         "dataType":"number",
         "parameterTypes":null,
         "isList":true
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
         "dataType":"String",
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
         "dataType":"Number",
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
         "name":"wwww",
         "code":"wwww",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      }
   ],
   "functions":[ 
      { 
         "groupName":"Function",
         "name":"CheckDuplicatePhoneCust",
         "code":"536cb40a-9521-4c72-8eb3-6bc64f17bd77",
         "dataType":"number",
         "parameterTypes":"text;text;date;text;text",
         "isList":false
      },
      { 
         "groupName":"Function",
         "name":"functionA",
         "code":"5ad62a8d-85ca-4312-9197-ea9fe31f5d5c",
         "dataType":"text",
         "parameterTypes":"number",
         "isList":true
      },
      { 
         "groupName":"Function",
         "name":"TextFunction",
         "code":"5f9cd890-bf53-455b-a1cc-fe956b3b37ff",
         "dataType":"text",
         "parameterTypes":"bool;number",
         "isList":false
      },
      { 
         "groupName":"Function",
         "name":"Minus",
         "code":"6bfc5366-8f3e-4512-80f0-bde00b7d1a22",
         "dataType":"number",
         "parameterTypes":"number",
         "isList":true
      },
      { 
         "groupName":"Function",
         "name":"Gender",
         "code":"759bb9ea-fa9a-47b6-a6d3-4b6d94167910",
         "dataType":"bool",
         "parameterTypes":"text;bool;number;date",
         "isList":false
      },
      { 
         "groupName":"Function",
         "name":"ReplaceText",
         "code":"88d71c42-55a3-4bb5-a480-a38e04955a8a",
         "dataType":"bool",
         "parameterTypes":"text;number",
         "isList":true
      },
      { 
         "groupName":"Function",
         "name":"Subtraction",
         "code":"d201db15-2673-41f0-a56e-81ae9acfa01a",
         "dataType":"number",
         "parameterTypes":"number;number",
         "isList":false
      },
      { 
         "groupName":"Function",
         "name":"CheckBMIJuvenile",
         "code":"fce529e4-1b56-48fb-9a34-f925ee92b75e",
         "dataType":"number",
         "parameterTypes":"number;number;number",
         "isList":false
      }
   ],
   "policyInputs":[ 
      { 
         "groupName":"Policy Input",
         "name":"Case_Pre_BasicAnnual",
         "code":"Case_Pre_BasicAnnual",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"Case_Pre_Require",
         "code":"Case_Pre_Require",
         "dataType":"number",
         "parameterTypes":null,
         "isList":true
      },
      { 
         "groupName":"Policy Input",
         "name":"Case_Pre_Submit",
         "code":"Case_Pre_Submit",
         "dataType":"text",
         "parameterTypes":null,
         "isList":true
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
         "name":"GLA_Contact_MaritalStatus",
         "code":"GLA_Contact_MaritalStatus",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA_Contact_Age",
         "code":"LA_Contact_Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA_Contact_AgeDay",
         "code":"LA_Contact_AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA_Contact_DOB",
         "code":"LA_Contact_DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA_Contact_DocType",
         "code":"LA_Contact_DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA_Contact_Gender",
         "code":"LA_Contact_Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA_Contact_Height",
         "code":"LA_Contact_Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA_Contact_IDNo",
         "code":"LA_Contact_IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA_Contact_Name",
         "code":"LA_Contact_Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA_Contact_Phone1",
         "code":"LA_Contact_Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA_Contact_RelationshipWithLA",
         "code":"LA_Contact_RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA_Contact_RelationshipWithPO",
         "code":"LA_Contact_RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA_Contact_Type",
         "code":"LA_Contact_Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA_Contact_Weight",
         "code":"LA_Contact_Weight",
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
         "name":"LA1_Contact_Age",
         "code":"LA1_Contact_Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA1_Contact_AgeDay",
         "code":"LA1_Contact_AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA1_Contact_DOB",
         "code":"LA1_Contact_DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA1_Contact_DocType",
         "code":"LA1_Contact_DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA1_Contact_Gender",
         "code":"LA1_Contact_Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA1_Contact_Height",
         "code":"LA1_Contact_Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA1_Contact_IDNo",
         "code":"LA1_Contact_IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA1_Contact_Name",
         "code":"LA1_Contact_Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA1_Contact_Phone1",
         "code":"LA1_Contact_Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA1_Contact_RelationshipWithLA",
         "code":"LA1_Contact_RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA1_Contact_RelationshipWithPO",
         "code":"LA1_Contact_RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA1_Contact_Type",
         "code":"LA1_Contact_Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA1_Contact_Weight",
         "code":"LA1_Contact_Weight",
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
         "name":"LA2_Contact_Age",
         "code":"LA2_Contact_Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA2_Contact_AgeDay",
         "code":"LA2_Contact_AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA2_Contact_DOB",
         "code":"LA2_Contact_DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA2_Contact_DocType",
         "code":"LA2_Contact_DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA2_Contact_Gender",
         "code":"LA2_Contact_Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA2_Contact_Height",
         "code":"LA2_Contact_Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA2_Contact_IDNo",
         "code":"LA2_Contact_IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA2_Contact_Name",
         "code":"LA2_Contact_Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA2_Contact_Phone1",
         "code":"LA2_Contact_Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA2_Contact_RelationshipWithLA",
         "code":"LA2_Contact_RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA2_Contact_RelationshipWithPO",
         "code":"LA2_Contact_RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA2_Contact_Type",
         "code":"LA2_Contact_Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA2_Contact_Weight",
         "code":"LA2_Contact_Weight",
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
         "name":"LA3_Contact_Age",
         "code":"LA3_Contact_Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA3_Contact_AgeDay",
         "code":"LA3_Contact_AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA3_Contact_DOB",
         "code":"LA3_Contact_DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA3_Contact_DocType",
         "code":"LA3_Contact_DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA3_Contact_Gender",
         "code":"LA3_Contact_Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA3_Contact_Height",
         "code":"LA3_Contact_Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA3_Contact_IDNo",
         "code":"LA3_Contact_IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA3_Contact_Name",
         "code":"LA3_Contact_Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA3_Contact_Phone1",
         "code":"LA3_Contact_Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA3_Contact_RelationshipWithLA",
         "code":"LA3_Contact_RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA3_Contact_RelationshipWithPO",
         "code":"LA3_Contact_RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA3_Contact_Type",
         "code":"LA3_Contact_Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA3_Contact_Weight",
         "code":"LA3_Contact_Weight",
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
         "name":"LA4_Contact_Age",
         "code":"LA4_Contact_Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA4_Contact_AgeDay",
         "code":"LA4_Contact_AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA4_Contact_DOB",
         "code":"LA4_Contact_DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA4_Contact_DocType",
         "code":"LA4_Contact_DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA4_Contact_Gender",
         "code":"LA4_Contact_Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA4_Contact_Height",
         "code":"LA4_Contact_Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA4_Contact_IDNo",
         "code":"LA4_Contact_IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA4_Contact_Name",
         "code":"LA4_Contact_Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA4_Contact_Phone1",
         "code":"LA4_Contact_Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA4_Contact_RelationshipWithLA",
         "code":"LA4_Contact_RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA4_Contact_RelationshipWithPO",
         "code":"LA4_Contact_RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA4_Contact_Type",
         "code":"LA4_Contact_Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA4_Contact_Weight",
         "code":"LA4_Contact_Weight",
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
         "name":"LA5_Contact_Age",
         "code":"LA5_Contact_Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA5_Contact_AgeDay",
         "code":"LA5_Contact_AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA5_Contact_DOB",
         "code":"LA5_Contact_DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA5_Contact_DocType",
         "code":"LA5_Contact_DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA5_Contact_Gender",
         "code":"LA5_Contact_Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA5_Contact_Height",
         "code":"LA5_Contact_Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA5_Contact_IDNo",
         "code":"LA5_Contact_IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA5_Contact_Name",
         "code":"LA5_Contact_Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA5_Contact_Phone1",
         "code":"LA5_Contact_Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA5_Contact_RelationshipWithLA",
         "code":"LA5_Contact_RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA5_Contact_RelationshipWithPO",
         "code":"LA5_Contact_RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA5_Contact_Type",
         "code":"LA5_Contact_Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA5_Contact_Weight",
         "code":"LA5_Contact_Weight",
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
         "name":"LA6_Contact_Age",
         "code":"LA6_Contact_Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA6_Contact_AgeDay",
         "code":"LA6_Contact_AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA6_Contact_DOB",
         "code":"LA6_Contact_DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA6_Contact_DocType",
         "code":"LA6_Contact_DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA6_Contact_Gender",
         "code":"LA6_Contact_Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA6_Contact_Height",
         "code":"LA6_Contact_Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA6_Contact_IDNo",
         "code":"LA6_Contact_IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA6_Contact_Name",
         "code":"LA6_Contact_Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA6_Contact_Phone1",
         "code":"LA6_Contact_Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA6_Contact_RelationshipWithLA",
         "code":"LA6_Contact_RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA6_Contact_RelationshipWithPO",
         "code":"LA6_Contact_RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA6_Contact_Type",
         "code":"LA6_Contact_Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA6_Contact_Weight",
         "code":"LA6_Contact_Weight",
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
         "name":"LA7_Contact_Age",
         "code":"LA7_Contact_Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA7_Contact_AgeDay",
         "code":"LA7_Contact_AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA7_Contact_DOB",
         "code":"LA7_Contact_DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA7_Contact_DocType",
         "code":"LA7_Contact_DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA7_Contact_Gender",
         "code":"LA7_Contact_Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA7_Contact_Height",
         "code":"LA7_Contact_Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA7_Contact_IDNo",
         "code":"LA7_Contact_IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA7_Contact_Name",
         "code":"LA7_Contact_Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA7_Contact_Phone1",
         "code":"LA7_Contact_Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA7_Contact_RelationshipWithLA",
         "code":"LA7_Contact_RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA7_Contact_RelationshipWithPO",
         "code":"LA7_Contact_RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA7_Contact_Type",
         "code":"LA7_Contact_Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"LA7_Contact_Weight",
         "code":"LA7_Contact_Weight",
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
         "name":"PO_Contact_Age",
         "code":"PO_Contact_Age",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"PO_Contact_AgeDay",
         "code":"PO_Contact_AgeDay",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"PO_Contact_DOB",
         "code":"PO_Contact_DOB",
         "dataType":"date",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"PO_Contact_DocType",
         "code":"PO_Contact_DocType",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"PO_Contact_Gender",
         "code":"PO_Contact_Gender",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"PO_Contact_Height",
         "code":"PO_Contact_Height",
         "dataType":"number",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"PO_Contact_IDNo",
         "code":"PO_Contact_IDNo",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"PO_Contact_Name",
         "code":"PO_Contact_Name",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"PO_Contact_Phone1",
         "code":"PO_Contact_Phone1",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"PO_Contact_RelationshipWithLA",
         "code":"PO_Contact_RelationshipWithLA",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"PO_Contact_RelationshipWithPO",
         "code":"PO_Contact_RelationshipWithPO",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"PO_Contact_Type",
         "code":"PO_Contact_Type",
         "dataType":"text",
         "parameterTypes":null,
         "isList":false
      },
      { 
         "groupName":"Policy Input",
         "name":"PO_Contact_Weight",
         "code":"PO_Contact_Weight",
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
