import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as mapActions from '@boundlessgeo/sdk/actions/map';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

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
    console.log("ZoomControl.render()", classes);

    /*let className = 'sdk-zoom-control';
    if (this.props.className) {
      className += ' ' + this.props.className;
    }*/
    return (
      <div className={classes.container}>
        <Button
          onClick={this.props.zoomIn}
          variant="fab"
          color="primary"
          //aria-label="add"
          label={this.props.zoomInTitle}
          //mini={true}
          className='sdk-zoom-in'
        >
          <i className="material-icons">add</i>
        </Button>
        <Button
          onClick={this.props.zoomOut}
          variant="fab"
          color="primary"
          //aria-label="remove"
          label={this.props.zoomOutTitle}
          //mini={true}
          className='sdk-zoom-out'
        >
          <i className="material-icons">remove</i>
        </Button>
      </div>
    );
  }
}

ZoomControl.propTypes = {
  classes: PropTypes.object.isRequired,
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

export default connect(null, mapDispatchToProps)((withStyles(styles)(ZoomControl)));
