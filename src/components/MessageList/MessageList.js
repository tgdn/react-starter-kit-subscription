import React from 'react';
import PropTypes from 'prop-types';
import { Feed } from 'semantic-ui-react';
import isEqual from 'lodash/isEqual';
import Message from 'components/Message';

export default class MessageList extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
      }).isRequired,
    ).isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
  }

  render() {
    const messages = this.props.messages;
    return (
      <Feed>
        {messages &&
          messages.map(message =>
            <Message key={message.id} message={message} />,
          )}
      </Feed>
    );
  }
}
