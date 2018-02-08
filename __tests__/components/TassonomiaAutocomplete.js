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
import TassonomiaAutoComplete from '../../src/components/TassonomiaAutoComplete';
import { tassonomiastore, newDataAction } from '../../src/components/tassonomiaredux';
import { wrap } from 'module';

configure({ adapter: new Adapter() });

const _wait = (ms) => {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

test('renders correctly', () => {
    const component = renderer.create(
        <MuiThemeProvider>
            <Provider store={createStore((state = [], action) => { return state })}>
                <HashRouter>
                    <TassonomiaAutoComplete url={'http://localhost:8080/MyRestServer/tassonomia?name='} />
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
            <Provider store={createStore((state = [], action) => { return state })}>
                <HashRouter>
                    <TassonomiaAutoComplete url={'http://localhost:8080/MyRestServer/tassonomia?name='} />
                </HashRouter>
            </Provider>
        </MuiThemeProvider>
    );

    console.log('---------------------------------------------');
    console.log(wrapper.debug());
    console.log('---------------------------------------------');

    var axios = require('axios');
    var MockAdapter = require('axios-mock-adapter');
    var mock = new MockAdapter(axios);
    mock.onGet('http://localhost:8080/MyRestServer/tassonomia?name=a').reply(200, {
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

    tassonomiastore.subscribe(() => {
        console.log('---------------------------------------------');
        expect(tassonomiastore.getState().phylumarr.length).toEqual(2);
        expect(tassonomiastore.getState().famigliaarr.length).toEqual(2);
        expect(tassonomiastore.getState().nomescientificoarr.length).toEqual(10);
        console.log('---------------------------------------------');
    });

    //wrapper.find('input').simulate('change', { target: { value: 'a' } });
    wrapper.find('#tassonomiaautocomplete').forEach((node) => {
        node.simulate('change', { target: { value: 'a' } });
    });

    _wait(60);
});
