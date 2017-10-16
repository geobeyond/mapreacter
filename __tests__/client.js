import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import  Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import Client from '../src/client';


describe('Client', () => {
  beforeEach( () => {
    let div = document.createElement('div');
    document.body.appendChild(div)
    div.setAttribute('id', 'map');
    let controls = document.createElement('div');
    controls.setAttribute('id', 'controls');
    document.body.appendChild(controls)
  })
  it('initiates an instance', () => {
    let client = new Client('map');
    expect(client).toBeInstanceOf(Client);
  });
});
