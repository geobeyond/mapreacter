import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as mapActions from '@boundlessgeo/sdk/actions/map';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  container: {
    position: 'absolute',
    zIndex: 1,
    top: 10,
    left: 10,
  },
});

class ZoomControl extends React.Component {
  render() {
    const { classes } = this.props;
    console.log("ZoomControl.render()");

    return (
      <div className={classes.container}>
        <Tooltip title={this.props.zoomInTitle}>
          <Button
            onClick={this.props.zoomIn}
            variant="fab"
            color="primary"
            mini={true}
            className='sdk-zoom-in'
          >
            <i className="material-icons">add</i>
          </Button>
        </Tooltip>
        <Tooltip title={this.props.zoomOutTitle}>
          <Button
            onClick={this.props.zoomOut}
            variant="fab"
            color="primary"
            mini={true}
            className='sdk-zoom-out'
          >
            <i className="material-icons">remove</i>
          </Button>
        </Tooltip>
      </div>
    );
  }
}

ZoomControl.propTypes = {
  classes: PropTypes.object.isRequired,
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

export default connect(null, mapDispatchToProps)((withStyles(styles)(ZoomControl)));
