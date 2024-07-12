
import { createStore } from 'redux';
import studentReducer from './reducers/StudentReducer/studentReduser';

const store = createStore(studentReducer);

export default store;