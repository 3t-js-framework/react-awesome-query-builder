import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import map from "lodash/map";
import { getFieldConfig } from "../../utils/configUtils";
import { calcTextWidth } from "../../utils/stuff";
import { Select, Spin } from "antd";
const Option = Select.Option;
import shallowCompare from "react-addons-shallow-compare";
import {INPUT_SRC_FIELD} from '../../constants'

export default class ConstantWidget extends Component {
  static propTypes = {
    setValue: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired,
    field: PropTypes.string.isRequired,
    value: PropTypes.string, //key in listValues
    customProps: PropTypes.object
  };

  shouldComponentUpdate = shallowCompare;

  handleChange = val => {
    this.props.setValue(val);
  };

  filterOption = (input, option) => {
    return (
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    );
  };

  render() {
    // const {  data } = this.state;

    let size = this.props.config.settings.renderSize || "small";
    let placeholder = this.props.placeholder || "Select option";

    const fieldDefinition = getFieldConfig(this.props.field, this.props.config);
    let listConstants = fieldDefinition.listConstants || [];
    const { operator } = this.props;
    if(fieldDefinition.inputSrc === INPUT_SRC_FIELD.FUNCTION_INPUT) {
      listConstants = listConstants.filter(x => x.dataType === fieldDefinition.type);
    }
    if (operator === "select_any_in" || operator === "select_not_any_in") {
      listConstants = listConstants.filter(x => x.isList === true);
    } else {
      listConstants = listConstants.filter(x => x.isList === false);
    }

    const options = map(listConstants, value => {
      return (
        <Option key={value.code} value={value.name}>
          {value.name}
        </Option>
      );
    });

    let placeholderWidth = calcTextWidth(placeholder, "14px");
    let customProps = this.props.customProps || {};

    return (
      <Select
        showSearch
        style={{ width: this.props.value ? null : placeholderWidth + 48 }}
        key={"widget-select"}
        dropdownMatchSelectWidth={false}
        ref="val"
        placeholder={placeholder}
        size={size}
        value={this.props.value || undefined} //note: (bug?) null forces placeholder to hide
        onChange={this.handleChange}
        filterOption={this.filterOption}
        {...customProps}
      >
        {options}
      </Select>
    );
  }
}
