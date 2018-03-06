import React from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SdkPopup from '@boundlessgeo/sdk/components/map/popup';


function TabList(props) {
  let theitems = []
  props.items.forEach(_record => {
    theitems.push(
      <Tab label={_record.layer} >
        <table>
          <tbody className="popup-table-body">
            {_generateTable(_record.features)}
          </tbody>
        </table>
      </Tab>
    );
  });

  return (
    <Tabs>
      {theitems}
    </Tabs>
  );
}

function _generateTable(features) {
  let rows = [];
  for (let i = 0, ii = features.length; i < ii; ++i) {
    const feature = features[i];
    const keys = Object.keys(feature.properties);
    for (let j = 0, jj = keys.length; j < jj; ++j) {
      const key = `${i}-${keys[j]}`;
      rows.push(
        <tr key={key}>
          <td>
            <span className="title">{keys[j]}</span>
          </td>
          <td>
            <span className="value">{feature.properties[keys[j]]}</span>
          </td>
        </tr>);
    }
  }
  return rows;
}


export default class WMSPopup extends SdkPopup {

  render() {
    console.log("WMSPopup.render()", JSON.stringify(this.props.items));
    return this.renderPopup(
      <MuiThemeProvider>
        <TabList items={this.props.items} />
      </MuiThemeProvider>
    );
  }
}
