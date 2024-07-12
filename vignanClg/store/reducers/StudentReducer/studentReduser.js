import { SET_STUDENT_DATA } from '../../actions/StudentAction/studentActions';
import { SET_USER_DATA } from '../../actions/StudentAction/studentActions';

const initialState = {
  students: [],
  user: []
};

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STUDENT_DATA:
      return {
        ...state,
        students: action.payload,
      };
    case SET_USER_DATA:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default studentReducer;

