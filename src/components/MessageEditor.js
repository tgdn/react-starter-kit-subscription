import React from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea, Button } from 'semantic-ui-react';
import isEqual from 'lodash/isEqual';

export default class MessageEditor extends React.Component {
  static propTypes = {
    postMessage: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      messageText: '',
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return !isEqual(this.props, nextProps) && !isEqual(this.state, nextState);
  // }

  handleSubmit() {
    const v = this.state.messageText;
    if (v) {
      this.props.postMessage(v);
      this.setState({ messageText: '' });
    }
  }

  render() {
    return (
      <Form>
        <TextArea
          ref={c => {
            this.textarea = c;
          }}
          onChange={e => {
            this.setState({ messageText: e.target.value });
          }}
          value={this.state.messageText}
          autoHeight
          placeholder="Aa"
          rows={1}
          style={{ maxHeight: 100 }}
        />
        <Form.Field
          size="mini"
          as={Button}
          color="blue"
          onClick={this.handleSubmit}
        >
          Send
        </Form.Field>
      </Form>
    )
  }
}
