
import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import  Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import WMSPopup from '../../components/map/wms/wmspopup';


describe('WMSPopup', () => {
  let coordinates;
  beforeEach( () => {
    coordinates = {}
  })
  it('initiates an instance', () => {
    let items = [{layer: {}, features: []}]
    shallow(<WMSPopup items={items} coordinate={coordinates}/>)
  });
});
