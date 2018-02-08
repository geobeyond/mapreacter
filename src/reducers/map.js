

let defaultState = {
  mapConfig: {}
};

export default function MapReducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_CONFIG':
      const newMapConfig = Object.assign({}, action.config);
      return { mapConfig: newMapConfig};
    default:
      return state;
  }
}
