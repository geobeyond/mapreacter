import { createStore } from 'redux';

const initialState = {
    phylumarr: [],
    famigliaarr: [],
    nomescientificoarr: [],
};

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
                phylumarr: action.payload._data.phylum,
                famigliaarr: action.payload._data.famiglia,
                nomescientificoarr: action.payload._data.nome_scientifico,
            });
            break;
    }
    return state;
}

export const tassonomiastore = createStore(tassonomiareducer, initialState);

tassonomiastore.subscribe(() => {
    console.log(JSON.stringify(tassonomiastore.getState()))
});

