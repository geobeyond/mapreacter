import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
//import LineString from 'ol/geom/linestring';
//import Polygon from 'ol/geom/polygon';
//import { mylocalizedstrings } from '../services/localizedstring';


class MeasureComponent extends Component {

    state = {
        searchText: '',
    };


    render() {
        if (this.props.feature) {
            if (this.props.feature.type === "Feature") {
                //console.log("MeasureComponent.render() coordinates=", this.props.feature.geometry.coordinates);
                if (this.props.feature.geometry.type === "LineString") {
                    //let _geom = new LineString(this.props.feature.geometry.coordinates);
                    let _length = 0;
                    if (this.props.segments) {
                        for (let i = 0; i < this.props.segments.length; i++) {
                            _length += this.props.segments[i];
                        }
                    }
                    let output;
                    if (_length > 1000) {
                        output = (Math.round(_length * 100 / 1000) / 100) + ' km';
                    } else {
                        output = (Math.round(_length * 100) / 100) + ' m';
                    }
                    console.log("MeasureComponent.render() length=", output);

                } else if (this.props.feature.geometry.type === "Polygon") {
                    //let _geom = new Polygon(this.props.feature.geometry.coordinates);
                    let _area = 0;
                    if (this.props.segments) {
                        for (let i = 0; i < this.props.segments.length; i++) {
                            _area += this.props.segments[i];
                        }
                    }
                    let output;
                    if (_area > 1000) {
                        output = (Math.round(_area * 100 / 1000) / 100) + ' kmq';
                    } else {
                        output = (Math.round(_area * 100) / 100) + ' mq';
                    }
                    console.log("MeasureComponent.render() area=", output);
                }
            }
        }
        return (<span />);
    }

}

const mapStateToProps = (state) => {
    return {
        feature: state.drawing.measureFeature,
        segments: state.drawing.measureSegments,
    }
}

export default withRouter(connect(mapStateToProps)(MeasureComponent));