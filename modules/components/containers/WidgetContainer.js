import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import shallowCompare from 'react-addons-shallow-compare';
import range from 'lodash/range';
import map from 'lodash/map';
import {
    getFieldConfig, getValueLabel, getOperatorConfig, getValueSourcesForFieldOp,
    getWidgetForFieldOp, getFieldWidgetConfig, getWidgetsForFieldOp, parseLabelPopover
} from "../../utils/configUtils";
import {defaultValue} from "../../utils/stuff";
import { Icon, Popover, Button, Radio, Row, Col } from 'antd';
import PopoverValueSrc from '../PopoverValueSrc';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default (Widget) => {
    return class WidgetContainer extends Component {
        static propTypes = {
            config: PropTypes.object.isRequired,
            value: PropTypes.any.isRequired, //instanceOf(Immutable.List)
            valueSrc: PropTypes.any.isRequired, //instanceOf(Immutable.List)
            field: PropTypes.string.isRequired,
            operator: PropTypes.string.isRequired,
            //actions
            setValue: PropTypes.func,
            setValueSrc: PropTypes.func,
        };

        constructor(props) {
            super(props);

            this._setValueHandlers = {};
            this._setValueSrcHandlers = {};
        }

        state = {
            valueSrcSelected: 'value',
            visible: false
        }

        _getSetValueHandler = (isSpecialRange, delta, widgetType) => {
            const k = ''+widgetType+'#'+(isSpecialRange ? 'r' : delta);
            let h = this._setValueHandlers[k];
            if (!h) {
                h = this._setValue.bind(this, isSpecialRange, delta, widgetType);
                this._setValueHandlers[k] = h;
            }
            return h;
        }

        _getSetValueSrcHandler = (delta) => {
            const k = ''+delta;
            let h = this._setValueSrcHandlers[k];
            if (!h) {
                h = this._onChangeValueSrc.bind(this, delta);
                this._setValueSrcHandlers[k] = h;
            }
            return h;
        }

        _setValue = (isSpecialRange, delta, widgetType, value) => {
            if (isSpecialRange && Array.isArray(value)) {
                const oldRange = [this.props.value.get(0), this.props.value.get(1)];
                if (oldRange[0] != value[0])
                    this.props.setValue(0, value[0], widgetType);
                if (oldRange[1] != value[1])
                    this.props.setValue(1, value[1], widgetType);
            } else {
                this.props.setValue(delta, value, widgetType);
            }
        }

        _onChangeValueSrc = (delta, e) => {
            let srcKey = e.target.value;
            const {valueSrcSelected} = this.state;
            this.props.setValueSrc(delta, valueSrcSelected);
            this.onVisibleChange(false);
        }

        _onChangeTempValueSrc = ({target}) => {
            const {value} = target;
            this.setState({valueSrcSelected: value});
        }

        onVisibleChange = visible => {
            this.setState({ visible });
        };

        shouldComponentUpdate = shallowCompare;

        renderWidget = (isSpecialRange, delta, valueSrc, widget, operatorDefinition) => {
            const fieldDefinition = getFieldConfig(this.props.field, this.props.config);
            const widgetDefinition = getFieldWidgetConfig(this.props.config, this.props.field, this.props.operator, widget, valueSrc);
            const valueLabel = getValueLabel(this.props.config, this.props.field, this.props.operator, delta, null, isSpecialRange);
            let valueLabels = null;
            let textSeparators = null;
            if (isSpecialRange) {
                valueLabels = [
                    getValueLabel(this.props.config, this.props.field, this.props.operator, 0),
                    getValueLabel(this.props.config, this.props.field, this.props.operator, 1)
                ];
                valueLabels = {
                    placeholder: [ valueLabels[0].placeholder, valueLabels[1].placeholder ],
                    label: [ valueLabels[0].label, valueLabels[1].label ],
                };
                textSeparators = operatorDefinition.textSeparators;
            }
            const {factory: widgetFactory, ...fieldWidgetProps} = widgetDefinition;
            const widgetType = widgetDefinition.type;

            if (!widgetFactory)
                return '?';
            
            let value = isSpecialRange ? 
                [this.props.value.get(0), this.props.value.get(1)] 
                : this.props.value.get(delta)
            ;
            if (isSpecialRange && value[0] === undefined && value[1] === undefined)
                value = undefined;
            let widgetProps = Object.assign({}, fieldWidgetProps, {
                config: this.props.config,
                field: this.props.field,
                operator: this.props.operator,
                delta: delta,
                isSpecialRange: isSpecialRange,
                value: value,
                label: valueLabel.label,
                placeholder: valueLabel.placeholder,
                placeholders: valueLabels ? valueLabels.placeholder : null,
                textSeparators: textSeparators,
                setValue: this._getSetValueHandler(isSpecialRange, delta, widgetType),
            });
            
            if (widget == 'field') {
                //
            }

            return widgetFactory(widgetProps);
        }

        renderValueSorces = (delta, valueSources, valueSrc) => {
            const {visible} = this.state;
            const fieldDefinition = getFieldConfig(this.props.field, this.props.config);
            const valueSourcesInfo = this.props.config.settings.valueSourcesInfo;
            const valueSourcesPopupTitle = this.props.config.settings.valueSourcesPopupTitle;
            //let valueSources = fieldDefinition.valueSources;
            //let valueSources = getValueSourcesForFieldOp(this.props.config, this.props.field, this.props.operator);

            if (!valueSources || Object.keys(valueSources).length == 1)
                return null;
            const popoverContent = valueSources.map(srcKey => ({key: srcKey, value: srcKey, label: parseLabelPopover(valueSourcesInfo[srcKey].label) }));
            let content = (
                <Fragment>
                    <RadioGroup
                        key={'valuesrc-'+delta}
                        defaultValue={valueSrc || "value"}
                        size={this.props.config.settings.renderSize || "small"}
                        onChange={this._onChangeTempValueSrc}
                        className="radio-button-inner-center"
                    >
                        {valueSources.map(srcKey => (
                            <Radio
                                key={srcKey}
                                value={srcKey}
                            >{parseLabelPopover(valueSourcesInfo[srcKey].label)}</Radio>
                        ))}
                    </RadioGroup>
                    <Row type="flex" justify="center">
                        <Col span={12} align="center">
                            <Button type="default" size="small" onClick={() => this.onVisibleChange(false)}>
                                Cancel
                            </Button>
                        </Col>
                        <Col span={12} align="center">
                            <Button
                                type="primary"
                                size="small"
                                onClick={this._getSetValueSrcHandler(delta)}
                            >
                                Confirm
                            </Button>
                        </Col>
                    </Row>
               </Fragment>
            );

            return (
                    <Popover content={visible && content} onVisibleChange={this.onVisibleChange} visible={visible}>
                        <Icon type="ellipsis" />
                    </Popover>
            );
        }

        render() {
            const settings = this.props.config.settings;
            const defaultWidget = getWidgetForFieldOp(this.props.config, this.props.field, this.props.operator);
            const widgets = getWidgetsForFieldOp(this.props.config, this.props.field, this.props.operator);
            const fieldDefinition = getFieldConfig(this.props.field, this.props.config);
            const operatorDefinition = getOperatorConfig(this.props.config, this.props.operator, this.props.field);
            if (typeof fieldDefinition === 'undefined' || typeof operatorDefinition === 'undefined') {
                return null;
            }
            const isSpecialRange = operatorDefinition.isSpecialRange;
            const isSpecialRangeForSrcField = isSpecialRange && (this.props.valueSrc.get(0) == 'field' || this.props.valueSrc.get(1) == 'field');
            const isTrueSpecialRange = isSpecialRange && !isSpecialRangeForSrcField;
            const cardinality = isTrueSpecialRange ? 1 : defaultValue(operatorDefinition.cardinality, 1);
            if (cardinality === 0) {
                return null;
            }

            return (
                <Widget name={defaultWidget} config={this.props.config}>
                    {range(0, cardinality).map(delta => {
                        const valueSources = getValueSourcesForFieldOp(this.props.config, this.props.field, this.props.operator);
                        let valueSrc = this.props.valueSrc.get(delta) || null;
                        //if (!valueSrc && valueSources.length == 1) {
                        //    this.props.setValueSrc(delta, valueSources[0]);
                        //}
                        let widget = getWidgetForFieldOp(this.props.config, this.props.field, this.props.operator, valueSrc);
                        let widgetDefinition = getFieldWidgetConfig(this.props.config, this.props.field, this.props.operator, widget, valueSrc);
                        if (isSpecialRangeForSrcField) {
                            widget = widgetDefinition.singleWidget;
                            widgetDefinition = getFieldWidgetConfig(this.props.config, this.props.field, this.props.operator, widget, valueSrc);
                        }
                        const valueLabel = getValueLabel(this.props.config, this.props.field, this.props.operator, delta, valueSrc, isTrueSpecialRange);
                        let parts = [];
                        if (operatorDefinition.textSeparators) {
                            let sep = operatorDefinition.textSeparators[delta];
                            if (sep) {
                                parts.push((
                                    <div key={"widget-separators-"+delta} className="widget--sep" >
                                        {settings.showLabels ?
                                            <label>&nbsp;</label>
                                            : null}
                                        <span>{sep}</span>
                                    </div>
                                ));
                            }
                        }

                        if (valueSources.length > 1)
                            parts.push((
                                <Fragment>
                                    {settings.showLabels ?
                                        <label>&nbsp;</label>
                                        : null}
                                    {this.renderValueSorces(delta, valueSources, valueSrc)}
                                </Fragment>
                            ));

                        parts.push((
                            <Fragment>
                                {settings.showLabels ?
                                    <label>{valueLabel.label}</label>
                                    : null}
                                {this.renderWidget(isTrueSpecialRange, delta, valueSrc, widget, operatorDefinition)}
                            </Fragment>
                        ));

                        return parts;
                    })}
                </Widget>
            );
        }
    };
};
