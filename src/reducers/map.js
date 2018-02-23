

let defaultState = {
  mapConfig: {}
};

export default function MapReducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_CONFIG':
      //const newMapConfig = Object.assign({}, action.config);
      //return { mapConfig: newMapConfig };

      state = Object.assign({}, state, {
        mapConfig: action.config,
      });
      return state;
    default:
      return state;
  }
}
