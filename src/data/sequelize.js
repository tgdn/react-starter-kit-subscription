import Sequelize from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(config.DBURL, {
  define: {
    freezeTableName: true,
  },
});

export default sequelize;
