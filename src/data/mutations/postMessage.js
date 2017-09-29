import { GraphQLError } from 'graphql';
import { postMessage } from '../controllers/message';

const postMessageMutation = async (_, { text, conversation }) => {
  const message = await postMessage(text);
  return message;
};

export { postMessageMutation };
