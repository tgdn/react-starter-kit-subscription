/* @flow */

import { getMessages } from '../controllers/message';

const messagesQuery = async () => {
  const messages = await getMessages();
  return messages;
};

export default messagesQuery;
