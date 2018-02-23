import React from 'react';
import SdkPopup from '@boundlessgeo/sdk/components/map/popup';


/**
 * Show the WMS GetFeatureInfo feature in a popup.
 */
export default class WMSPopup extends SdkPopup {
  _generateTable(features) {
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
  render() {
    console.log("WMSPopup.render()", JSON.stringify(this.props.items));
    let content = '';
    if (this.props.items.length > 0) {
      content = (
        <table>
          <thead className="popup-table-header">
            <tr>
              <th colSpan="2">
                {this.props.items[0].layer}
              </th>
            </tr>
          </thead>
          <tbody className="popup-table-body">
            {this._generateTable(this.props.items[0].features)}
          </tbody>
        </table>
      );
    }
    console.log("WMSPopup.render() content:", content);
    return this.renderPopup((
      <div className="sdk-popup-content">
        <div className="popup-content">
          <div className="popup-body">
            {content}
          </div>
        </div>
      </div>
    ));
  }
}
