/**
 * Created on 21 Dec 2021 by lonmee
 */

const initState = [];

export const publicReducer = (state = initState, {type, payload}) => {
  switch (type) {
    case 'addPublicMsg':
      return [payload, ...state];
    case 'clearPublicMsg':
      return initState;
    default:
      return state;
  }
};
