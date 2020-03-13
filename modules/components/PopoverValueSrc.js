import React, { Component, Fragment } from "react";
import { EllipsisOutlined } from '@ant-design/icons';
import { Row, Col, Button, Radio, Popover } from "antd";
import { INPUT_SRC_FIELD } from "../constants";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export default class PopoverValueSrc extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    valueSrcSelected:
      this.props.selectedSrcField || INPUT_SRC_FIELD.POLICY_INPUT,
    visible: false
  };

  onChangeValueSrc = ({ target }) => {
    const { value } = target;
    this.setState({ valueSrcSelected: value });
  };

  onConfirmValueSrc = () => {
    const { valueSrcSelected } = this.state;
    const { onChangeSelectedInputSrcField, popoverIndex, isWidget } = this.props;
    if (isWidget) {
      onChangeSelectedInputSrcField();
    } else {
      onChangeSelectedInputSrcField({
        target: { value: valueSrcSelected }
      }, popoverIndex);
      this.onVisibleChange(false);
    }

  };

  onVisibleChange = visible => {
    this.setState({ visible });
  };

  render() {
    const { visible } = this.state;
    const { popoverContent = [], className, placement = "top" } = this.props;

    return (
      <Popover
        className={className}
        placement={placement}
        onVisibleChange={this.onVisibleChange}
        visible={visible}
        content={
          visible && (
            <Fragment>
              <RadioGroup
                key="dataSrc"
                defaultValue={
                  this.props.selectedSrcField || INPUT_SRC_FIELD.POLICY_INPUT
                }
                size="small"
                onChange={this.onChangeValueSrc}
                className="radio-button-inner-center"
              >
                {popoverContent.map(item => (
                  <Radio key={item.key} value={item.value}>
                    {item.label}
                  </Radio>
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
                    onClick={this.onConfirmValueSrc}
                  >
                    Confirm
                  </Button>
                </Col>
              </Row>
            </Fragment>
          )
        }
      >
        <EllipsisOutlined />
      </Popover>
    );
  }
}
