import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';

import MessageList from './MessageList';
import MessageEditor from './MessageEditor';

import ConversationMessagesQuery from '../routes/home/messages.graphql';
import PostMessageMutation from '../routes/home/postMessage.graphql';
import MessagesSubscription from '../routes/home/messagesSubscription.graphql';

const isDuplicateMessage = (newMessage, existingMessages) =>
  newMessage.id !== null &&
  existingMessages.some(message => newMessage.id === message.id);

class Messages extends React.Component {
  static propTypes = {
    postMessage: PropTypes.func.isRequired,
    data: PropTypes.shape({
      subscribeToMore: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      messages: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
          createdAt: PropTypes.string.isRequired,
        }).isRequired,
      ),
    }).isRequired,
  };

  constructor(props) {
    super(props);

    /* keep track of subscription handle to not subscribe twice
    which also handles unsubscribe */
    this.subscription = null;
  }

  componentWillReceiveProps(nextProps) {
    if (!this.subscription && !nextProps.data.loading) {
      this.subscription = this.props.data.subscribeToMore({
        document: MessagesSubscription,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) {
            return prev;
          }

          const newMessage = subscriptionData.data.messageCreated;
          /* check this is not the result of our mutation */
          if (isDuplicateMessage(newMessage, prev.messages)) {
            return prev;
          }

          return {
            ...prev,
            messages: [...prev.messages, newMessage],
          };
        },
      });
    }
  }

  componentWillUnmount() {
    if (this.subscription && typeof this.subscription === 'function') {
      this.subscription(); // unsubscribe
    }
  }

  render() {
    const { postMessage, data: { messages } } = this.props;
    return (
      <div>
        <MessageList messages={messages} />
        <MessageEditor postMessage={postMessage} />
      </div>
    );
  }
}

export default compose(
  graphql(ConversationMessagesQuery, {
    options: () => ({
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }),
  }),
  graphql(PostMessageMutation, {
    props: ({ ownProps, mutate }) => ({
      postMessage: messageText =>
        mutate({
          variables: {
            text: messageText,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            postMessage: {
              __typename: 'Message',
              id: null,
              text: messageText,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          updateQueries: {
            Message: (prev, { mutationResult }) => {
              const newMessage = mutationResult.data.postMessage;
              if (isDuplicateMessage(newMessage, prev.messages)) {
                return prev;
              }
              return {
                ...prev,
                messages: [...prev.messages, newMessage],
              };
            },
          },
        }),
    }),
  }),
)(Messages);
