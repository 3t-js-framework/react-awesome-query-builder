import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';
import {getFieldConfig, getFieldPath, getFieldPathLabels} from "../utils/configUtils";
import {calcTextWidth, truncateString, BUILT_IN_PLACEMENTS} from "../utils/stuff";
import { Menu, Dropdown, Icon, Tooltip, Button, Select } from 'antd';
import moment from 'moment';
const { Option, OptGroup } = Select;
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const DropdownButton = Dropdown.Button;
import map from 'lodash/map';
import last from 'lodash/last';
import keys from 'lodash/keys';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {INPUT_SRC_FIELD, DATA_TYPE} from '../constants';
import InputFunctionWidget from './widgets/InputFunction';

export default class Field extends Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    selectedField: PropTypes.string,
    selectedInputSrcField: PropTypes.string,
    renderAsDropdown: PropTypes.bool,
    customProps: PropTypes.object,
    //actions
    setField: PropTypes.func.isRequired,
  };

  constructor(props) {
      super(props);
  }

  componentWillReceiveProps (nextProps) {
    //let prevProps = this.props;
  }

  shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  curField() {
      return this.props.selectedField ? getFieldConfig(this.props.selectedField, this.props.config) : null;
  }

  curFieldOpts() {
      return Object.assign({}, {
          label: this.props.selectedField,
        },
        this.curField() || {}
      );
  }

  handleFieldMenuSelect = ({key, keyPath}) => {
    this.props.setField(key);
  }

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

    handleFieldSelect = (key) => {
        const selectedInputSrcField = this.props.selectedInputSrcField || INPUT_SRC_FIELD.POLICY_INPUT;
        if(this.props.selectedInputSrcField === INPUT_SRC_FIELD.FUNCTION_INPUT){
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
        this.props.setField(key);
    }

  filterOption = (input, option) => {
    const { value, groupLabel, children } = option.props;

    let isInChildren = false;
    if (typeof children === 'string') {
        isInChildren = children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    let isInValue = false;
    if (typeof value === 'string') {
        isInValue = value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    let isInGroupLabel = false;
    if (typeof groupLabel === 'string') {
        isInGroupLabel = groupLabel.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }

    return isInChildren || isInValue || isInGroupLabel;
  }

  getFieldDisplayLabel(field, fieldKey) {
      let fieldSeparator = this.props.config.settings.fieldSeparator;
      let maxLabelsLength = this.props.config.settings.maxLabelsLength || 100;
      let label = field.label || last(fieldKey.split(fieldSeparator));
      label = truncateString(label, maxLabelsLength);
      return label;
  }

  buildMenuItems(fields, path = null) {
      let fieldSeparator = this.props.config.settings.fieldSeparator;
      if (!fields)
          return null;
      let prefix = path ? path.join(fieldSeparator) + fieldSeparator : '';
        
      return keys(fields).map(fieldKey => {
          
          let field = fields[fieldKey];
          let label = this.getFieldDisplayLabel(field, fieldKey);
          if (field.type == "!struct") {
              let subpath = (path ? path : []).concat(fieldKey);
              return <SubMenu
                  key={prefix+fieldKey}
                  title={<span>{label} &nbsp;&nbsp;&nbsp;&nbsp;</span>}
              >
                  {this.buildMenuItems(field.subfields, subpath)}
              </SubMenu>
          } else {
              return <MenuItem key={prefix+fieldKey}>{label}</MenuItem>;
          }
      });
  }

  buildSelectItems(fields, path = null, optGroupLabel = null) {
      let fieldSeparator = this.props.config.settings.fieldSeparator;
      if (!fields)
          return null;
      let prefix = path ? path.join(fieldSeparator) + fieldSeparator : '';
      const selectedInputSrcField = this.props.selectedInputSrcField || INPUT_SRC_FIELD.POLICY_INPUT;
      return keys(fields).map(fieldKey => {
          let field = fields[fieldKey];
          if(selectedInputSrcField !== field.inputSrc) return null;

          let label = this.getFieldDisplayLabel(field, fieldKey);
          if (field.type == "!struct") {
              let subpath = (path ? path : []).concat(fieldKey);
              return <OptGroup
                  key={prefix+fieldKey}
                  label={label}
              >
                  {this.buildSelectItems(field.subfields, subpath, label)}
              </OptGroup>
          } else {
              return <Option
                key={prefix+fieldKey}
                value={prefix+fieldKey}
                grouplabel={optGroupLabel}
              >
                {label}
              </Option>;
          }
      });
  }

  buildMenuToggler(label, fullLabel, customLabel) {
      let btnLabel = customLabel ? customLabel : label;
      let maxLabelsLength = this.props.config.settings.maxLabelsLength || 100;
      btnLabel = truncateString(btnLabel, maxLabelsLength);
      var toggler =
          <Button
              size={this.props.config.settings.renderSize || "small"}
          >
              {btnLabel} <Icon type="down" />
          </Button>;

      if (fullLabel && fullLabel != label) {
          toggler = <Tooltip
                  placement="top"
                  title={fullLabel}
              >
              {toggler}
              </Tooltip>;
      }

      return toggler;
  }
  

  render() {
    if(this.props.selectedInputSrcField === INPUT_SRC_FIELD.FUNCTION_INPUT) {
        return this.renderAsSelect();
    }
    else if (this.props.renderAsDropdown)
        return this.renderAsDropdown();
    else
        return this.renderAsSelect();
  }

  renderAsSelect() {
    let isFieldSelected = !!this.props.selectedField;
    let dropdownPlacement = this.props.config.settings.dropdownPlacement;
    let maxLabelsLength = this.props.config.settings.maxLabelsLength || 100;
    //TODO: add 4 value src in prefix
    let fieldOptions = this.props.config.fields;
    let functionInputOptions = this.props.config.functionInputs;

    let selectedFieldPartsLabels = getFieldPathLabels(this.props.selectedField, this.props.config);
    let selectedFieldFullLabel = selectedFieldPartsLabels ? selectedFieldPartsLabels.join(this.props.config.settings.fieldSeparatorDisplay) : null;
    let placeholder = !isFieldSelected ? this.props.config.settings.fieldPlaceholder : null;
    let fieldDisplayLabel = isFieldSelected ? this.getFieldDisplayLabel(this.curField(), this.props.selectedField) : null;
    let selectText = isFieldSelected ? fieldDisplayLabel : placeholder;
    selectText = truncateString(selectText, maxLabelsLength);
    let selectWidth = calcTextWidth(selectText, '14px');
    //let tooltip = this.curFieldOpts().label2 || selectedFieldFullLabel || this.curFieldOpts().label;
    const selectedInputSrcField = this.props.selectedInputSrcField;
    let fieldSelectItems = this.buildSelectItems(fieldOptions);
    // if (selectedInputSrcField === INPUT_SRC_FIELD.POLICY_INPUT ) {
    //     fieldSelectItems = this.buildSelectItems(fieldOptions);
    // } else if (selectedInputSrcField === INPUT_SRC_FIELD.FUNCTION_INPUT) {
    //     fieldSelectItems = this.buildSelectItems(functionInputOptions);
    // } else if (selectedInputSrcField === INPUT_SRC_FIELD.VALUE_DEFINITION) {
    //     fieldSelectItems = this.buildSelectItems(fieldOptions);
    // } else {
    //     fieldSelectItems = this.buildSelectItems(fieldOptions);
    // }
    
    let customProps = this.props.customProps || {};
    const { config, value, operator, field } = this.props;

    const fieldSelected = fieldOptions[this.props.selectedField];
    let fieldSelect = (
        <Fragment>
             <Select
                dropdownAlign={dropdownPlacement ? BUILT_IN_PLACEMENTS[dropdownPlacement] : undefined}
                dropdownMatchSelectWidth={false}
                style={{ width: isFieldSelected && !customProps.showSearch ? null : selectWidth + 48 }}
                ref="field"
                placeholder={placeholder}
                size={this.props.config.settings.renderSize || "small"}
                onChange={this.handleFieldSelect}
                value={this.props.selectedField || undefined}
                filterOption={this.filterOption}
                {...customProps}
            >{fieldSelectItems}</Select>
            {selectedInputSrcField === INPUT_SRC_FIELD.FUNCTION_INPUT && fieldSelected &&
                <InputFunctionWidget field={this.props.selectedField} value={fieldSelected} {...this.props}/>
            }
        </Fragment>
       

    );

    return fieldSelect;
  }

 

  renderAsDropdown() {
    let fieldOptions = this.props.config.fields;
    let selectedFieldKeys = getFieldPath(this.props.selectedField, this.props.config);
    let selectedFieldPartsLabels = getFieldPathLabels(this.props.selectedField, this.props.config);
    let selectedFieldFullLabel = selectedFieldPartsLabels ? selectedFieldPartsLabels.join(this.props.config.settings.fieldSeparatorDisplay) : null;
    let placeholder = this.curFieldOpts().label || this.props.config.settings.fieldPlaceholder;
    let customProps = this.props.customProps || {};

    let fieldMenuItems = this.buildMenuItems(fieldOptions);
    let fieldMenu = (
        <Menu
            //size={this.props.config.settings.renderSize || "small"}
            selectedKeys={selectedFieldKeys}
            onClick={this.handleFieldMenuSelect}
            {...customProps}
        >{fieldMenuItems}</Menu>
    );
    let fieldToggler = this.buildMenuToggler(placeholder, selectedFieldFullLabel, this.curFieldOpts().label2);

    return (
      <Dropdown
          overlay={fieldMenu}
          trigger={['click']}
          placement={this.props.config.settings.dropdownPlacement}
      >
          {fieldToggler}
      </Dropdown>
    );
  }
}
