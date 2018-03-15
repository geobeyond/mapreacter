let defaultState = {
  mapConfig: {},
  viewparams: '',
  refreshIndicator: { status: 'hide' }
};

export default function MapReducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_CONFIG':
      state = Object.assign({}, state, {
        mapConfig: action.config,
      });
      return state;

    case 'SET_VIEWPARAMS':
      state = Object.assign({}, state, {
        viewparams: action.payload['viewparams'],
      });
      return state;

    case 'LOCAL.CHANGEREFRESHINDICATOR':
      state = Object.assign({}, state, {
        refreshIndicator: action.payload['refreshIndicator']
      });
      return state;

    default:
      return state;
  }
}
