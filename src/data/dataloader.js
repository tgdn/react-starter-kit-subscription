import DataLoader from 'dataloader';
import { /* User, */Message } from './models';

const resolveIdsForCollection = model => ids =>
  Promise.all(ids.map(id => model.findById(id)));

const getMessages = resolveIdsForCollection(Message);
// const getUsers = resolveIdsForCollection(User);

const cacheKeyFn = key => key.toString();
const options = { cacheKeyFn };

const createDataLoaders = request => ({
  MessageLoader: new DataLoader(getMessages, options),
  // UserLoader: new DataLoader(getUsers, options),
});

export default createDataLoaders;
