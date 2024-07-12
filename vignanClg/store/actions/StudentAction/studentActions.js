export const SET_STUDENT_DATA = 'SET_STUDENT_DATA';
export const SET_USER_DATA = 'SET_USER_DATA';

export const setStudentData = (students) => ({
  type: SET_STUDENT_DATA,
  payload: students,
});
export const setUserData = (user) => ({
  type: SET_USER_DATA,
  payload: user,
});