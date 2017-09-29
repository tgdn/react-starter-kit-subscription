/* @flow */
import DataType from 'sequelize';
import Model from '../sequelize';

const Message = Model.define('message', {
  text: {
    type: DataType.TEXT,
  },
  createdAt: {
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  },
});

export { Message };
