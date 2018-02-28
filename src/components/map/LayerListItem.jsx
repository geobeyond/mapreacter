import React from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import { types, layerListItemSource, layerListItemTarget, collect, collectDrop } from '@boundlessgeo/sdk/components/layer-list-item';
import SdkLayerListItem from '@boundlessgeo/sdk/components/layer-list-item';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { isLayerVisible } from '@boundlessgeo/sdk/util';
import { fitextent } from '../../actions/map';


class LayerListItem extends SdkLayerListItem {
  render() {
    const layer = this.props.layer;
    //const checkbox = this.getVisibilityControl(layer);
    const checkbox = (<i className={isLayerVisible(this.props.layer) ? 'fa fa-eye fa-lg' : 'fa fa-eye-slash fa-lg'} onClick={() => { this.toggleVisibility(); }} />);

    let fitextentbutton = null;
    if (layer.id === 'osm' || layer.id === 'mapbox') {
      fitextentbutton = (<span />);
    } else {
      fitextentbutton = (
        <IconButton
          onClick={() => {
            this.props.dispatch(fitextent(this.props.layer.id));
          }}>
          <FontIcon className="material-icons">fullscreen</FontIcon>
        </IconButton>
      );
    }

    let moveButtons = (
      <span>
        <IconButton
          onClick={() => {
            this.moveLayerUp();
          }}>
          <FontIcon className="material-icons">arrow_upward</FontIcon>
        </IconButton>
        <IconButton
          onClick={() => {
            this.moveLayerDown();
          }}>
          <FontIcon className="material-icons">arrow_downward</FontIcon>
        </IconButton>
        {fitextentbutton}
      </span>
    );

    return this.props.connectDragSource(this.props.connectDropTarget((
      <li className="layer">
        <span className="checkbox">{checkbox}</span>
        <span className="btn-container">{moveButtons}</span>
        <span className="name">{layer.id}</span>
      </li>
    )));
  }
}

LayerListItem = DropTarget(types, layerListItemTarget, collectDrop)(DragSource(types, layerListItemSource, collect)(LayerListItem));

export default LayerListItem;