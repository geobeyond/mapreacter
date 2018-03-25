let defaultState = {
  mapConfig: {},
  viewparams: '',
  refreshIndicator: { status: 'hide' },
  measureComponent: { open: false }
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

    case 'LOCAL.CHANGEMEASURECOMPONENT':
      state = Object.assign({}, state, {
        measureComponent: action.payload['measureComponent']
      });
      return state;

    default:
      return state;
  }
}
