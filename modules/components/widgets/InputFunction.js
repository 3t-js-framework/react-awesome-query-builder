import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  InputNumber,
  Input,
  Radio,
  Popover,
  Icon,
  Switch,
  DatePicker
} from 'antd';
import last from 'lodash/last';
import keys from 'lodash/keys';
import _cloneDeep from 'lodash/cloneDeep';
import moment from 'moment';
import shallowCompare from 'react-addons-shallow-compare';

import {
  getFieldConfig,
  getValueSourcesForFieldOp,
  parseLabelPopover
} from '../../utils/configUtils';
import { truncateString, } from '../../utils/stuff';
import FieldFunctionValueSrc from '../FieldFunctionValueSrc';
import FieldConstantValueSrc from '../FieldConstantValueSrc';
import PopoverValueSrc from '../PopoverValueSrc';
import { DATA_TYPE, VALUE_SOURCE_FUNCTION, } from '../../constants';

const { Option, } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class InputFunction extends Component {
  static propTypes = {
    setValue: PropTypes.func,
    config: PropTypes.object.isRequired,
    field: PropTypes.string.isRequired,
    value: PropTypes.any,
    operator: PropTypes.string,
    customProps: PropTypes.object
  };

  shouldComponentUpdate = shallowCompare;

  initDataForParams = (functionSelected) => {
    const { params } = functionSelected;
    return params.map(item => {
      switch (item) {
        case DATA_TYPE.TEXT:
          return '';
        case DATA_TYPE.NUMBER:
          return 0;
        case DATA_TYPE.BOOL:
          return false;
        case DATA_TYPE.DATE:
          return moment().toISOString();
        default:
          return null;
      }
    });
  }

  /**
   * @key key function
   * Handle change select
   */
  handleFieldSelect = (key) => {
    const functionSelected = this.props.config.functions[key];
    const functionSrc = {
      parameters: this.initDataForParams(functionSelected),
      functionSelected: functionSelected.functionName,
      valueSrc: functionSelected.params.map(() => 'value'),
      dataTypes: functionSelected.params,
      key
    };

    this.props.setFunctionSrc({ functionSrc });
  }

  /**
   * @functions info of functions (type, key, params,...)
   * Render list function in select
   */
  buildOptionItems = (functions, path = null) => {
    const functionSeparator = this.props.config.settings.fieldSeparator;
    const maxLabelsLength = this.props.config.settings.maxLabelsLength || 100;
    const prefix = path ? path.join(functionSeparator) + functionSeparator : '';

    if (!functions) { return null; }

    return keys(functions).map(functionKey => {
      const functionSelect = functions[functionKey];
      let label = functionSelect.functionName || last(functionKey.split(functionSeparator));
      label = truncateString(label, maxLabelsLength);
      return (
        <Option
          key={prefix + functions[functionKey].key}
          value={prefix + functions[functionKey].key}
        >
          {label}
        </Option>
      );
    });
  }

  /**
   * @value onchange field input
   * @index position of field input
   * @dataType data type of field input
   */
  handleChange = (value, index, dataType) => {
    let valueChange = value;
    const valueFunctionSelect = _cloneDeep(this.props.functionSrc);
    if (dataType === DATA_TYPE.TEXT) { valueChange = value.target.value; }
    if (dataType === DATA_TYPE.DATE && valueChange) { valueChange = value.toISOString(); }
    valueFunctionSelect.parameters[index] = valueChange;
    this.props.setFunctionSrc({ functionSrc: valueFunctionSelect });
  }

  /**
   * @value value of group button
   * @index position of popover
   * Handle change popover value source
   */
  handleChangePopover = ({ target }, index) => {
    const valueFunctionSelect = _cloneDeep(this.props.functionSrc);
    valueFunctionSelect.valueSrc[index] = target.value;
    valueFunctionSelect.parameters[index] = '';
    this.props.setFunctionSrc({ functionSrc: valueFunctionSelect });
  }

  /**
   * @index position of radio group button
   * Render popover
   */
  renderValueSources = (index) => {
    const { config, field, operator, value, functionSrc } = this.props;
    const valueSourcesInfo = config.settings.valueSourcesInfo;
    const valueSourcesPopupTitle = config.settings.valueSourcesPopupTitle;
    // const valueSources = getValueSourcesForFieldOp(config, field, operator);
    const valueSourcesPopover = value.valueSources;
    let valueSrc = (functionSrc && functionSrc.valueSrc && functionSrc.valueSrc[index]) || null;
    if (!valueSourcesPopover) { return null; }
    const popoverContent = valueSourcesPopover.filter((valueSource) => valueSource !== 'function' && valueSource !== 'expression').map(srcKey => ({key: `${srcKey + index}`, value: srcKey, label: parseLabelPopover(valueSourcesInfo[srcKey].label) }));
    // let content = (
    //   <RadioGroup
    //     key={valueSrc + '--' + index}
    //     value={valueSrc || 'value'}
    //     size={this.props.config.settings.renderSize || 'small'}
    //     onChange={(value) => this.handleChangePopover(value, index)}
    //   >
    //     {valueSourcesPopover.filter((valueSource) => valueSource !== 'function').map(srcKey => (
    //       <RadioButton
    //         key={srcKey + index}
    //         value={srcKey}
    //       >{parseLabelPopover(valueSourcesInfo[srcKey].label)}
    //       </RadioButton>
    //     ))}
    //   </RadioGroup>
    // );

    return (
      // <Popover
      //   className="popover-function"
      //   title={valueSourcesPopupTitle}
      //   content={content}
      // >
      //   <Icon type="ellipsis" />
      // </Popover>
      <PopoverValueSrc
        className="popover-function"
        selectedSrcField={valueSrc}
        onChangeSelectedInputSrcField={this.handleChangePopover}
        popoverContent={popoverContent}
        popoverIndex={index}
      />
    );
  }

  /**
   * @index position index of params, valueSrc
   * @dataTypeOfParam data type of param
   * Render control antd by valueSrc
   */
  renderValueSourceParam = (index, dataTypeOfParam) => {
    const { config, value, operator, field, functionSrc } = this.props;
    const valueSource = functionSrc && functionSrc.valueSrc[index] || 'value';
    const paramDataType = functionSrc && functionSrc.dataTypes[index] || 'text';
    switch (valueSource) {
      case VALUE_SOURCE_FUNCTION.FIELD:
        return (
          <FieldFunctionValueSrc
            value={value}
            field={field}
            config={config}
            operator={operator}
            dataTypeOfParam={dataTypeOfParam}
            valueSelected={this.props.functionSrc.parameters[index]}
            handleChangeValue={(value) => this.handleChange(value, index, VALUE_SOURCE_FUNCTION.FIELD)}
          />
        );
      case VALUE_SOURCE_FUNCTION.CONSTANT:
        return (
          <FieldConstantValueSrc
            field={field}
            paramDataType={paramDataType} 
            config={config}
            value={this.props.functionSrc.parameters[index]}
            handleChangeValueConstant={(value) => this.handleChange(value, index, VALUE_SOURCE_FUNCTION.CONSTANT)}
          />
        );
      case VALUE_SOURCE_FUNCTION.VALUE:
        return this.filterUIForValueSource(dataTypeOfParam, index);
      default:
        return this.filterUIForValueSource(dataTypeOfParam, index);
    }
  }

  /**
   * @dataType Data type of parameter
   * @index Position of parameter
   * Return UI of parameter
   */
  filterUIForValueSource = (dataType, index) => {
    switch (dataType) {
      case DATA_TYPE.TEXT:
        return (
          <Input
            value={this.props.functionSrc && this.props.functionSrc.parameters[index] || ''}
            size={this.props.config.settings.renderSize || 'small'}
            onChange={(value) => this.handleChange(value, index, dataType)}
            style={{ marginLeft: '8px', width: '150px' }}
            placeholder="Input value"
            maxLength={150}
          />
        );
      case DATA_TYPE.NUMBER:
        return (
          <InputNumber
            key={index}
            value={this.props.functionSrc && this.props.functionSrc.parameters[index] || 0}
            size={this.props.config.settings.renderSize || 'small'}
            onChange={(value) => this.handleChange(value, index, dataType)}
            placeholder="Input value"
          />
        );
      case DATA_TYPE.BOOL:
        return (
          <Switch
            checked={this.props.functionSrc && this.props.functionSrc.parameters[index] || false}
            defaultChecked={false}
            style={{ marginLeft: '8px' }}
            onChange={(value) => this.handleChange(value, index, dataType)}
          />
        );
      case DATA_TYPE.DATE:
        return (
          <DatePicker
            style={{ marginLeft: '8px', width: '128px' }}
            value={this.props.functionSrc && moment(this.props.functionSrc.parameters[index]) || undefined}
            onChange={(value) => this.handleChange(value, index, dataType)}
            allowClear={true}
          />
        );
      default:
        return (
          <Input
            value={this.props.value && this.props.value.params[index] || ''}
            size={this.props.config.settings.renderSize || 'small'}
            onChange={(value) => this.handleChange(value, index, dataType)}
            style={{ marginLeft: '8px', width: '150px' }}
            placeholder="Input value"
            maxLength={150}
          />
        );
    }
  }

  renderFunctionParams = (functionSelected, valueSrc) => {
    if (!functionSelected) { return; }
    const { key, params } = functionSelected;

    return params.map((dataTypeOfParam, index) => (
      <div className="widget-input-function" key={key + '--' + (valueSrc && valueSrc[index] || 'value') + '--' + index}>
        {this.renderValueSources(index)}
        {this.renderValueSourceParam(index, dataTypeOfParam)}
      </div>
    ));
  }

  /**
   * @config in file config
   * @leftFieldFullkey info of field
   * @operator operator of field
   * Filter function by type
   */
  filterFunctions = (config, leftFieldFullkey, operator) => {
    const leftFieldConfig = getFieldConfig(leftFieldFullkey, config);
    const { functions } = config;

    // Get functions of field config
    const { type } = leftFieldConfig;
    const functionsOfField = Object.keys(functions).map(key => {
      if (operator === 'select_any_in' || operator === 'select_not_any_in') {
        return (functions[key].type === type && functions[key].isList === true) ? functions[key] : undefined;
      }
      return (functions[key].type === type && functions[key].isList === false) ? functions[key] : undefined;
    }).filter(func => func);

    if (!functionsOfField.length) { return []; }
    return functionsOfField;
  }

  /**
   * @input value search
   * @option element select
   */
  filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  /**
   * @functionKey key of function selected
   * @config info in file config
   */
  getFunctionInit = (value, config) => {
    const { key, valueSources } = value;
    const { functions } = config;
    const result = functions[key] ? functions[key] : null;
    const renderParams = this.renderFunctionParams(result, valueSources);
    // this.handleFieldSelect(key);
    return renderParams;
  }

  testChange = (value) => {
    this.props.setValue(value);
  }

  renderFunctionParameters = (value, config) => {
    const { key, valueSrc } = value;
    const { functions } = config;
    const result = functions[key] ? functions[key] : null;
    return result.params.map((dataTypeOfParam, index) => (
      <div className="widget--function" key={key + '--' + (valueSrc && valueSrc[index] || 'value') + '--' + index}>
        {this.renderValueSources(index)}
        {this.renderValueSourceParam(index, dataTypeOfParam)}
      </div>
    ));
  }

  /**
   * Render select functions
   */
  renderAsSelect = () => {
    const { value, config, field, operator } = this.props;
    // const placeholder = this.props.config.settings.functionPlaceholder;
    // let fieldOptions = this.filterFunctions(config, field, operator);
    const customProps = this.props.customProps || {};
    // const buildOptionItems = this.buildOptionItems(fieldOptions);
    const initParamsInput = this.props.value && this.getFunctionInit(value, config);

    return (
      <Fragment>
        {/* <Select
          value={value && value.key || undefined}
          style={{ width: '200px' }}
          ref="function"
          placeholder={placeholder}
          size={this.props.config.settings.renderSize || 'small'}
          onChange={this.handleFieldSelect}
          filterOption={this.filterOption}
          {...customProps}
        >
          {buildOptionItems}
        </Select> */}
        {initParamsInput}
      </Fragment>
    );
  }

  render() {
    return this.renderAsSelect();
  }
}

export default InputFunction;
