import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import shallowCompare from 'react-addons-shallow-compare';
import RuleContainer from './containers/RuleContainer';
import Field from './Field';
import Operator from './Operator';
import Widget from './Widget';
import OperatorOptions from './OperatorOptions';
import { Row, Col, Menu, Dropdown, Icon, Tooltip, Button, Modal, Radio, Popover } from 'antd';
const { confirm } = Modal;
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const DropdownButton = Dropdown.Button;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import {getFieldConfig, getFieldPath, getFieldPathLabels, getOperatorConfig, getFieldWidgetConfig} from "../utils/configUtils";
import size from 'lodash/size';
var stringify = require('json-stringify-safe');
const classNames = require('classnames');
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Provider, Connector, connect} from 'react-redux';
import PopoverValueSrc from './PopoverValueSrc';
import {INPUT_SRC_FIELD} from '../constants';
import DragAndDropIcon from '../assets/DragAndDropIcon';


@RuleContainer
class Rule extends Component {
    static propTypes = {
        isForDrag: PropTypes.bool,
        selectedField: PropTypes.string,
        functionSrc: PropTypes.object,
        selectedOperator: PropTypes.string,
        selectedInputSrcField: PropTypes.string,
        operatorOptions: PropTypes.object,
        config: PropTypes.object.isRequired,
        onDragStart: PropTypes.func,
        renderType: PropTypes.string, //'dragging', 'placeholder', null
        value: PropTypes.any, //depends on widget
        valueSrc: PropTypes.any,
        //path: PropTypes.instanceOf(Immutable.List),
        //actions
        setInputSrcField: PropTypes.func,
        setField: PropTypes.func,
        setOperator: PropTypes.func,
        setOperatorOption: PropTypes.func,
        setFunctionSrc: PropTypes.func,
        removeSelf: PropTypes.func,
        setValue: PropTypes.func,
        setValueSrc: PropTypes.func,
        treeNodesCnt: PropTypes.number,
        //connected:
        dragging: PropTypes.object, //{id, x, y, w, h}
    };

    pureShouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    shouldComponentUpdate = this.pureShouldComponentUpdate;


    constructor(props) {
        super(props);
    }

    handleDraggerMouseDown = (e) => {
        var nodeId = this.props.id;
        var dom = this.refs.rule;

        if (this.props.onDragStart) {
          this.props.onDragStart(nodeId, dom, e);
        }
    }

    getRenderType (props) {
      let renderType;
      if (props.dragging && props.dragging.id == props.id) {
        renderType = props.isForDrag ? 'dragging' : 'placeholder';
      } else {
        renderType = props.isForDrag ? null : 'normal';
      }
      return renderType;
    }

    removeSelf = () => {
      const confirmOptions = this.props.config.settings.removeRuleConfirmOptions;
      const doRemove = () => {
        this.props.removeSelf();
      };
      if (confirmOptions && !this.isEmptyCurrentRule()) {
        confirm({...confirmOptions,
          onOk: doRemove,
          onCancel: null
        });
      } else {
        doRemove();
      }
    }

    onChangeSelectedInputSrcField = ({target}) => {
        const {setInputSrcField, setField } = this.props;
        const {value} = target;
        setInputSrcField(value);
    }

    isEmptyCurrentRule = () => {
        return !(
            this.props.selectedField !== null &&
            this.props.selectedOperator !== null &&
            this.props.value.filter((val) => val !== undefined).size > 0
        );
    }

    render () {
        let renderType = this.getRenderType(this.props);
        if (!renderType)
          return null;

        const selectedFieldPartsLabels = getFieldPathLabels(this.props.selectedField, this.props.config);
        const selectedFieldConfig = getFieldConfig(this.props.selectedField, this.props.config);
        const isSelectedGroup = selectedFieldConfig && selectedFieldConfig.type == '!struct';
        const isFieldAndOpSelected = this.props.selectedField && this.props.selectedOperator && !isSelectedGroup;
        const selectedOperatorConfig = getOperatorConfig(this.props.config, this.props.selectedOperator, this.props.selectedField);
        const selectedOperatorHasOptions = selectedOperatorConfig && selectedOperatorConfig.options != null;
        const selectedFieldWidgetConfig = getFieldWidgetConfig(this.props.config, this.props.selectedField, this.props.selectedOperator) || {};
        const popoverInputSrcContent = [
            {
                key: INPUT_SRC_FIELD.POLICY_INPUT,
                value: INPUT_SRC_FIELD.POLICY_INPUT,
                label: 'Policy Input'
            },
            {
                key: INPUT_SRC_FIELD.FUNCTION_INPUT,
                value: INPUT_SRC_FIELD.FUNCTION_INPUT,
                label: 'Function input'
            },
            {
                key: INPUT_SRC_FIELD.VALUE_DEFINITION,
                value: INPUT_SRC_FIELD.VALUE_DEFINITION,
                label: 'Value defination'
            }
        ];
        let styles = {};
        if (renderType == 'dragging') {
            styles = {
                top: this.props.dragging.y,
                left: this.props.dragging.x,
                width: this.props.dragging.w
            };
        }

        return (
          <div
            className={classNames(
              "rule",
              "group-or-rule",
              renderType == "placeholder" ? "qb-placeholder" : null,
              renderType == "dragging" ? "qb-draggable" : null
            )}
            style={styles}
            ref="rule"
            data-id={this.props.id}
          >
            <div className="rule--header">
              {!this.props.config.settings.readonlyMode && (
                <Button
                  type="default"
                  icon="close"
                  onClick={this.removeSelf}
                  size={this.props.config.settings.renderSize || "small"}
                >
                  {this.props.config.settings.deleteLabel !== undefined
                    ? this.props.config.settings.deleteLabel
                    : "Delete"}
                </Button>
              )}
            </div>
            {/*<div className="rule--body">*/}
            {/*<Row>*/}
            {this.props.config.settings.canReorder &&
              this.props.treeNodesCnt > 2 && (
                <span
                  className={"qb-drag-handler"}
                  onMouseDown={this.handleDraggerMouseDown}
                >
                  <Icon component={DragAndDropIcon} />{" "}
                </span>
              )}
            {true ? (
              <Col key={"fields"} className="rule--field">
                {this.props.config.settings.showLabels && (
                  <label>
                    {this.props.config.settings.fieldLabel || "Field"}
                  </label>
                )}
                {/* <div key={"valuesrc-"+this.props.field+"-"+delta} className="widget--valuesrc">
                                    {settings.showLabels ?
                                        <label>&nbsp;</label>
                                        : null}
                                    {this.renderValueSorces(delta, valueSources, valueSrc)}
                                </div> */}

                {/* {!this.props.selectedInputSrcField && (
                  <PopoverValueSrc
                    className="padding-right-8"
                    placement="left"
                    selectedSrcField={this.props.selectedInputSrcField}
                    onChangeSelectedInputSrcField={this.onChangeSelectedInputSrcField}
                    popoverContent={popoverInputSrcContent}/>
                )} */}

                <PopoverValueSrc
                  className="padding-right-8"
                  placement="left"
                  selectedSrcField={this.props.selectedInputSrcField}
                  onChangeSelectedInputSrcField={this.onChangeSelectedInputSrcField}
                  popoverContent={popoverInputSrcContent}
                />

                <Field
                  key="field"
                  config={this.props.config}
                  selectedField={this.props.selectedField}
                  setField={this.props.setField}
                  setFunctionSrc={this.props.setFunctionSrc}
                  functionSrc={this.props.functionSrc}
                  renderAsDropdown={
                    this.props.config.settings.renderFieldAndOpAsDropdown
                  }
                  customProps={
                    this.props.config.settings.customFieldSelectProps
                  }
                  selectedInputSrcField={this.props.selectedInputSrcField}
                />
              </Col>
            ) : null}
            {this.props.selectedField &&
              !selectedFieldWidgetConfig.hideOperator && (
                <Col
                  key={
                    "operators-for-" +
                    (selectedFieldPartsLabels || []).join("_")
                  }
                  className="rule--operator"
                >
                  {this.props.config.settings.showLabels && (
                    <label>
                      {this.props.config.settings.operatorLabel || "Operator"}
                    </label>
                  )}
                  <Operator
                    key="operator"
                    config={this.props.config}
                    selectedField={this.props.selectedField}
                    selectedOperator={this.props.selectedOperator}
                    setOperator={this.props.setOperator}
                    renderAsDropdown={
                      this.props.config.settings.renderFieldAndOpAsDropdown
                    }
                  />
                </Col>
              )}
            {this.props.selectedField &&
              selectedFieldWidgetConfig.hideOperator &&
              selectedFieldWidgetConfig.operatorInlineLabel && (
                <Col
                  key={
                    "operators-for-" +
                    (selectedFieldPartsLabels || []).join("_")
                  }
                  className="rule--operator"
                >
                  <div className="rule--operator">
                    {this.props.config.settings.showLabels ? (
                      <label>&nbsp;</label>
                    ) : null}
                    <span>{selectedFieldWidgetConfig.operatorInlineLabel}</span>
                  </div>
                </Col>
              )}
            {isFieldAndOpSelected && (
              <Col
                key={"widget-for-" + this.props.selectedOperator}
                className="rule--value"
              >
                <Widget
                  key="values"
                  field={this.props.selectedField}
                  operator={this.props.selectedOperator}
                  value={this.props.value}
                  valueSrc={this.props.valueSrc}
                  config={this.props.config}
                  setValue={this.props.setValue}
                  setValueSrc={this.props.setValueSrc}
                />
              </Col>
            )}
            {isFieldAndOpSelected && selectedOperatorHasOptions && (
              <Col
                key={"op-options-for-" + this.props.selectedOperator}
                className="rule--operator-options"
              >
                <OperatorOptions
                  key="operatorOptions"
                  selectedField={this.props.selectedField}
                  selectedOperator={this.props.selectedOperator}
                  operatorOptions={this.props.operatorOptions}
                  setOperatorOption={this.props.setOperatorOption}
                  config={this.props.config}
                />
              </Col>
            )}
            {/*</Row>*/}
            {/*</div>*/}
          </div>
        );
    }

}

export default Rule;
