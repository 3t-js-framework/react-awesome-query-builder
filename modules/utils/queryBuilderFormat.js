'use strict';
import Immutable from 'immutable';
import uuid from "./uuid";
import isArray from 'lodash/isArray'
import {defaultValue} from "./stuff";
import {
    getFieldConfig, getWidgetForFieldOp, getValueSourcesForFieldOp, getOperatorConfig, getFieldWidgetConfig, 
    getFieldPath, getFieldPathLabels, fieldWidgetDefinition
} from './configUtils';
import omit from 'lodash/omit';
import isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';
import {INPUT_SRC_FIELD} from '../constants';
import { func } from 'prop-types';

/*
 Build tree to http://querybuilder.js.org/ like format

 Example:
 {
 "condition": "AND",
 "rules": [
 {
 "id": "price",
 "field": "price",
 "type": "double",
 "input": "text",
 "operator": "less",
 "value": "10.25"
 },
 {
 "condition": "OR",
 "rules": [
 {
 "id": "category",
 "field": "category",
 "type": "integer",
 "input": "select",
 "operator": "equal",
 "value": "2"
 },
 {
 "id": "category",
 "field": "category",
 "type": "integer",
 "input": "select",
 "operator": "equal",
 "value": "1"
 }
 ]}
 ]
 }
 */
export const queryBuilderFormat = (item, config, rootQuery = null) => {
    const type = item.get('type');
    const properties = item.get('properties');
    const children = item.get('children1');
    const id = item.get('id');
    var resultQuery = {};
    var isRoot = (rootQuery === null);
    if (isRoot) {
        rootQuery = resultQuery;
        rootQuery.usedFields = [];
        rootQuery.usedFieldConfigs = [];
    }

    if (type === 'group' && children && children.size) {
        const conjunction = properties.get('conjunction');
        const not = properties.get('not');
        const conjunctionDefinition = config.conjunctions[conjunction];

        const list = children
            .map((currentChild) => {
                return queryBuilderFormat(currentChild, config, rootQuery)
            })
            .filter((currentChild) => typeof currentChild !== 'undefined')
        if (!list.size)
            return undefined;
        resultQuery['rules'] = list.toList();
        resultQuery['condition'] = conjunction.toUpperCase();
        resultQuery['not'] = not;

        return resultQuery;
    } else if (type === 'rule') {
        const operator = properties.get('operator');
        const options = properties.get('operatorOptions');
        let field = properties.get('field');
        let value = properties.get('value');
        let valueSrc = properties.get('valueSrc');
        let valueType = properties.get('valueType');
        const selectedInputSrcField = properties.get('selectedInputSrcField');
        const functionSrc = properties.get('functionSrc');
        let hasUndefinedValues = false;
        value.map((currentValue, ind) => {
            if (currentValue === undefined) {
                hasUndefinedValues = true;
                return undefined;
            }
        });

        if (field == null || operator == null || hasUndefinedValues)
            return undefined;

        const fieldDefinition = getFieldConfig(field, config) || {};
        const operatorDefinition = getOperatorConfig(config, operator, field) || {};
        //const reversedOp = operatorDefinition.reversedOp;
        //const revOperatorDefinition = getOperatorConfig(config, reversedOp, field) || {};
        const fieldType = fieldDefinition.type || "undefined";
        const cardinality = defaultValue(operatorDefinition.cardinality, 1);
        const widget = getWidgetForFieldOp(config, field, operator);
        const fieldWidgetDefinition = omit(getFieldWidgetConfig(config, field, operator, widget), ['factory']);
        const typeConfig = config.types[fieldDefinition.type] || {};
        //format field
        if (fieldDefinition.tableName) {
          const regex = new RegExp(field.split(config.settings.fieldSeparator)[0])
          field = field.replace(regex, fieldDefinition.tableName)
        }

        if (value.size < cardinality)
            return undefined;

        if (rootQuery.usedFields.indexOf(field) == -1)
            rootQuery.usedFields.push(field);
        if (selectedInputSrcField === INPUT_SRC_FIELD.POLICY_INPUT){
            rootQuery.usedFieldConfigs.push(field);
            rootQuery.usedFieldConfigs = [...new Set(rootQuery.usedFieldConfigs)];
        }else if( selectedInputSrcField === INPUT_SRC_FIELD.FUNCTION_INPUT && functionSrc){
            const valueFunc = functionSrc.valueSrc;
            const parmFunc = functionSrc.parameters;
            for(let j = 0; j < valueFunc.length; j++){
                if(valueFunc[j] === 'field' && !!parmFunc[j]){
                    rootQuery.usedFieldConfigs.push(parmFunc[j])
                    // rootQuery.usedFieldConfigs = [...new Set(rootQuery.usedFieldConfigs)];
                }
            }
        }
        value = value.toArray();
        valueSrc = valueSrc.toArray();
        valueType = valueType.toArray();
        let values = [];
        for (let i = 0 ; i < value.length ; i++) {
            
            const valueSrcParse = valueSrc[i];
            let val = {
                type: valueType[i],
                value: value[i],
                valueSrc: valueSrcParse
            };
            values.push(val);
            if (valueSrc[i] == 'field') {
                let secondField = value[i];
                if (rootQuery.usedFields.indexOf(secondField) == -1)
                    rootQuery.usedFields.push(secondField);
                rootQuery.usedFieldConfigs.push(secondField)
            } else if (valueSrc[i] === 'function' && value[i]) {
                const functionField = value[i];
                const functionValueSrc = functionField.valueSrc;
                const functionParameters = functionField.parameters;
                for(let j = 0; j < functionValueSrc.length; j++){
                    if(functionValueSrc[j] === 'field' && !!functionParameters[j]){
                        rootQuery.usedFieldConfigs.push(functionParameters[j])
                        // rootQuery.usedFieldConfigs = [...new Set(rootQuery.usedFieldConfigs)];
                    }
                }
                if(isEmpty(functionParameters)){
                    value[i].parameters = null;
                }
            }
        }
        rootQuery.usedFieldConfigs = [...new Set(rootQuery.usedFieldConfigs)];
        let operatorOptions = options ? options.toJS() : null;
        if (operatorOptions && !Object.keys(operatorOptions).length)
            operatorOptions = null;

        const parseSelectedInput = selectedInputSrcField === INPUT_SRC_FIELD.POLICY_INPUT ? 'field' : (selectedInputSrcField === INPUT_SRC_FIELD.FUNCTION_INPUT ? 'function': 'constant')
        const clonefunctionSrc = _cloneDeep(functionSrc);
        const parseFunctionSrc = clonefunctionSrc ? Object.assign(clonefunctionSrc, {parameters: isEmpty(clonefunctionSrc.parameters) ? null : clonefunctionSrc.parameters }) : null
     
        var ruleQuery = {
            id,
            field,
            type: fieldType,
            input: typeConfig.mainWidget,
            selectedInputSrcField: parseSelectedInput,
            functionSrc: parseFunctionSrc,
            operator
        };
        if (operatorOptions)
            ruleQuery.operatorOptions = operatorOptions;
        ruleQuery.values = values;
        return ruleQuery
    }
    return undefined;
};

