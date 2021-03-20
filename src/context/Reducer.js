function reducer(state, action) {
  switch (action.type) {
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.payload,
      };
    default:
      return state;
  }
}
export default reducer;
