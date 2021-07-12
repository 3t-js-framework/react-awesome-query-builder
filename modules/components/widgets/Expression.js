import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Input, Col } from 'antd';
import shallowCompare from 'react-addons-shallow-compare';

const {TextArea} = Input;
export default class ExpressionWidget extends Component {
  static propTypes = {
    setValue: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    config: PropTypes.object.isRequired,
    value: PropTypes.string,
    field: PropTypes.string.isRequired,
    customProps: PropTypes.object,
  };

  shouldComponentUpdate = shallowCompare;

  handleChange = (e) => {
    this.props.setValue(e.target.value);
  }

  render() {
    let customProps = this.props.customProps || {};
    return (
      <Col className="expression-wrapper">
        <TextArea
          value={this.props.value || null}
          placeholder="Expression"
          allowClear
          onChange={this.handleChange}
          rows={1}
          key="widget-expression"
          className="expression"
          {...customProps}
        />
      </Col>
    );
  }
}
