import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as mapActions from '@boundlessgeo/sdk/actions/map';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';

class ZoomControl extends React.Component {
  render() {
    let className = 'sdk-zoom-control';
    if (this.props.className) {
      className += ' ' + this.props.className;
    }
    return (
      <div className={className} style={this.props.style}>
        <FloatingActionButton className='sdk-zoom-in' onClick={this.props.zoomIn} title={this.props.zoomInTitle} mini={true} ><ContentAdd /></FloatingActionButton>
        <FloatingActionButton className='sdk-zoom-out' onClick={this.props.zoomOut} title={this.props.zoomOutTitle} mini={true} ><ContentRemove /></FloatingActionButton>
      </div>
    );
  }
}

ZoomControl.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  zoomInTitle: PropTypes.string,
  zoomOutTitle: PropTypes.string,
};

ZoomControl.defaultProps = {
  zoomInTitle: 'Zoom in',
  zoomOutTitle: 'Zoom out',
};

function mapDispatchToProps(dispatch) {
  return {
    zoomIn: () => {
      dispatch(mapActions.zoomIn());
    },
    zoomOut: () => {
      dispatch(mapActions.zoomOut());
    },
  };
};

export default connect(null, mapDispatchToProps)(ZoomControl);
