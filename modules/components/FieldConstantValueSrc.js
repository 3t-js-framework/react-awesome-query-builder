import React, { Component } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import { Select, } from 'antd';
import { calcTextWidth } from '../utils/stuff';
import { getFieldConfig } from '../utils/configUtils';
const Option = Select.Option;


export default class FieldConstantValueSrc extends Component {
    static propTypes = {
        config: PropTypes.object.isRequired,
        field: PropTypes.string.isRequired,
        value: PropTypes.string,
        customProps: PropTypes.object,
        handleChangeValueConstant: PropTypes.func.isRequired
    };


    filterOption = (input, option) => {
        return (
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
    };

    render() {
        let size = this.props.config.settings.renderSize || 'small';
        let placeholder = this.props.placeholder || 'Select option';
        const fieldDefinition = getFieldConfig(this.props.field, this.props.config);

        const options = map(fieldDefinition.listConstants, value => {
            return (
                <Option key={value.code} value={value.name}>
                    {value.name}
                </Option>
            );
        });
        let placeholderWidth = calcTextWidth(placeholder, '14px');
        let customProps = this.props.customProps || {};

        return (
            <div className="valuesrc--function">
                <Select
                    showSearch
                    style={{ width: 200 }}
                    key={"widget-select"}
                    dropdownMatchSelectWidth={false}
                    ref="val"
                    placeholder={placeholder}
                    size={size}
                    value={this.props.value || undefined}
                    onChange={this.props.handleChangeValueConstant}
                    filterOption={this.filterOption}
                    {...customProps}
                >
                    {options}
                </Select>
            </div>
        );
    }
}
