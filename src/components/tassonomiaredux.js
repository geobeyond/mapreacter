import { createStore } from 'redux';

const initialState = {};

const NEWDATA = "NEWDATA";

export const newDataAction = (_data) => {
  return {
    type: NEWDATA,
    payload: { _data: _data }
  };
}

const tassonomiareducer = (state = initialState, action) => {
    switch (action.type) {
        case NEWDATA:
            state = Object.assign({}, state, {
                _data: action.payload._data,
            });
            break;
        default:
            return state;
}

export const tassonomiastore = createStore(tassonomiareducer, initialState);

tassonomiastore.subscribe(() => {
    console.log("tassonomiastore.getState():", JSON.stringify(tassonomiastore.getState()))
});

