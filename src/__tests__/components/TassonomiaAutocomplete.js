import 'jsdom-global/register'; //at the top of file , even  , before importing react
import React from 'react';
import renderer from 'react-test-renderer';
import { HashRouter, Switch, Route, Link } from 'react-router-dom'
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Menu, MenuItem } from 'material-ui/Menu';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TassonomiaAutoComplete from '../../components/TassonomiaAutoComplete';
import { tassonomiastore, newDataAction } from '../../components/tassonomiaredux';
import { wrap } from 'module';
import jsdom from 'jsdom';
import MapReducer from '../../reducers/map';
import TassonomiaReducer from '../../components/tassonomiaredux';


configure({ adapter: new Adapter() });

const _wait = (ms) => {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

const config = {
    tassonomiaserviceurl: 'http://localhost:8080/MyRestServer/tassonomia?name=',
    routing: [
        { field: 'phylum', label: 'Phylum', routinglevel: '/' },
        { field: 'famiglia', label: 'Famiglia', routinglevel: '/*/' },
        { field: 'nome_scientifico', label: 'Specie', routinglevel: '/*/*/' },
    ],
};

export const store = createStore(
    combineReducers({
      //map: SdkMapReducer,
      //mapinfo: SdkMapInfoReducer,
      //print: SdkPrintReducer,
      local: MapReducer,
      tassonomia: TassonomiaReducer,
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

test('renders correctly', () => {
    const component = renderer.create(
        <MuiThemeProvider>
            <Provider store={store}>
                <HashRouter>
                    <TassonomiaAutoComplete config={config} />
                </HashRouter>
            </Provider>
        </MuiThemeProvider>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});

test('component changes the after click', () => {

    const wrapper = mount(
        <MuiThemeProvider>
            <Provider store={store}>
                <HashRouter>
                    <TassonomiaAutoComplete config={config} />
                </HashRouter>
            </Provider>
        </MuiThemeProvider>
    );

    //console.log('---------------------------------------------');
    //console.log(wrapper.debug());
    //console.log('---------------------------------------------');

    var axios = require('axios');
    var MockAdapter = require('axios-mock-adapter');
    var mock = new MockAdapter(axios);
    mock.onGet(config.tassonomiaserviceurl + 'a').reply(200, {
        "phylum": [
            "Chordata",
            "Arthropoda"
        ],
        "famiglia": [
            "Emberizidae",
            "Mutillidae"
        ],
        "nome_scientifico": [
            "Asparagus acutifolius L.",
            "Crataegus monogyna Jacq.",
            "Ruscus aculeatus L.",
            "Fraxinus ornus L. subsp. ornus",
            "Tamus communis L.",
            "Bythinella schmidtii",
            "Turdus merula",
            "Sylvia atricapilla",
            "Hedera helix L. s.l.",
            "Smilax aspera L."
        ]
    });

    store.subscribe(() => {
        //console.log('---------------------------------------------');
        expect(store.getState().tassonomia.dataSource.length).toBeGreaterThan(1);
        //console.log('---------------------------------------------');
    });

    //wrapper.find('input').simulate('change', { target: { value: 'a' } });
    wrapper.find('#tassonomiaautocomplete').forEach((node) => {
        node.simulate('change', { target: { value: 'a' } });
    });

    _wait(60);
});
