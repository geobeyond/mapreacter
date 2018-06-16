import React from 'react';
import SdkPopup from '@boundlessgeo/sdk/components/map/popup';
import FeaturesTable from './FeaturesTable';


export default class WMSPopup extends SdkPopup {
  render() {
    console.log("WMSPopup.render()", JSON.stringify(this.props.items));
    return this.renderPopup(
      <div className="sdk-popup-content">
        <FeaturesTable items={this.props.items} />
      </div>
    );
  }
}
