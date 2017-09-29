import sequelize from '../sequelize';
import { Message } from './Message';

/* conversation */
// User.belongsToMany(Conversation, { through: 'members' });
// Conversation.belongsToMany(User, { through: 'members' });

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { Message };
