import React from 'react';
import { SdkLayerListItem } from '@boundlessgeo/sdk/components/layer-list';
import SdkLegend from '@boundlessgeo/sdk/components/legend';
import {isLayerVisible} from '@boundlessgeo/sdk/util';

import {ListItem} from 'material-ui/List';

class LayerListItem extends SdkLayerListItem {
  render() {
    var flexContainer = {
      display: 'flex',
      padding: '16px'
    };
    const layer = this.props.layer;

    let legend;
    if(layer.type != "background") {
      legend = (<SdkLegend key={layer.id} layerId={layer.id} />);
    }
    let visibleIcon = isLayerVisible(layer) ? 'fa fa-eye' : 'fa fa-eye-slash';
    let visibility = (<i className={visibleIcon} />);
    return (
      <ListItem onClick={() => { this.toggleVisibility(); }} innerDivStyle={flexContainer} insetChildren={true} primaryText={<span>{visibility}{layer.id}{legend}</span>} >
      </ListItem>
    );
  }
}
export default LayerListItem;
