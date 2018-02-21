import { viewparams } from "../actions/map";

let defaultState = {
  mapConfig: {},
  viewparams: ''
};

export default function MapReducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_CONFIG':
      const newMapConfig = Object.assign({}, action.config);
      return { mapConfig: newMapConfig };

    case 'SET_VIEWPARAMS':
      state = Object.assign({}, state, {
        viewparams: action.payload['viewparams']
      });
      return state;

    default:
      return state;
  }
}
