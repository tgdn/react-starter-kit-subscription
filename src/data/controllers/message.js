/* @flow */
import pubsub from '../../pubsub';
import { Message } from '../models';

const getMessages = () =>
  new Promise(async resolve => {
    const messages = await Message.findAll();
    resolve(messages);
  });

const postMessage = (text: string): Promise =>
  new Promise((resolve, reject) => {
    (async () => {
      const msg = await Message.create({ text });

      /* publish subcription */
      console.log('about to publish');
      console.log(msg.get({ plain: true }));

      pubsub.publish('messageCreated', {
        messageCreated: msg.get({ plain: true }),
      });

      console.log('published');

      return resolve(msg);
    })().catch(reject);
  });

export { getMessages, postMessage };
