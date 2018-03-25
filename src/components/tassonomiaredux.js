const initialState = { dataSource: [] };

const NEWDATASOURCE = "NEWDATASOURCE";

export const newDataSourceAction = (dataSource) => {
    return {
        type: NEWDATASOURCE,
        payload: { dataSource: dataSource }
    };
}

export default function TassonomiaReducer(state = initialState, action) {
    switch (action.type) {
        case NEWDATASOURCE:
            state = Object.assign({}, state, {
                dataSource: action.payload.dataSource,
            });
            return state;
        default:
            return state;
    }
}
