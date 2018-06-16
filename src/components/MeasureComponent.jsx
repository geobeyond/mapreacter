import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
//import LineString from 'ol/geom/linestring';
//import Polygon from 'ol/geom/polygon';
//import { mylocalizedstrings } from '../services/localizedstring';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const style = {
    zIndex: 1,
    display: 'inline-block',
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 20,
    textAlign: 'center',
};

class MeasureComponent extends Component {

    state = {
        output: '',
    };

    componentWillReceiveProps(nextProps) {
        console.log("MeasureComponent.componentWillReceiveProps() props=", JSON.stringify(nextProps));
        let output = '';
        if (nextProps.feature) {
            if (nextProps.feature.type === "Feature") {
                if (nextProps.feature.geometry.type === "LineString") {
                    let _length = 0;
                    if (nextProps.segments) {
                        for (let i = 0; i < nextProps.segments.length; i++) {
                            _length += nextProps.segments[i];
                        }
                    }
                    if (_length > 1000) {
                        output = <Typography component="p">{new Intl.NumberFormat().format(Math.round(_length * 100 / 1000) / 100) + ' km'}</Typography>;
                    } else {
                        output = <Typography component="p">{new Intl.NumberFormat().format(Math.round(_length * 100) / 100) + ' m'}</Typography>;
                    }

                } else if (nextProps.feature.geometry.type === "Polygon") {
                    let _area = 0;
                    if (nextProps.segments) {
                        for (let i = 0; i < nextProps.segments.length; i++) {
                            _area += nextProps.segments[i];
                        }
                    }
                    if (_area > 1000) {
                        output = <Typography component="p">{new Intl.NumberFormat().format(Math.round(_area * 100 / 1000) / 100) + ' km'}<sup>2</sup></Typography>;
                    } else {
                        output = <Typography component="p">{new Intl.NumberFormat().format(Math.round(_area * 100) / 100) + ' m'}<sup>2</sup></Typography>;
                    }
                }
            }
            this.setState({ output: output });
        }
    }

    render() {
        console.log("MeasureComponent.render()", JSON.stringify(this.props.measureComponent));
        if (!this.props.measureComponent.open) {
            return null;
        }
        return (
            <Paper
                style={style}
                elevation={3}
                square={true}
            >
                {this.state.output}
            </Paper>
        );
    }

}

const mapStateToProps = (state) => {
    return {
        feature: state.drawing.measureFeature,
        segments: state.drawing.measureSegments,
        measureComponent: state.local.measureComponent,
    }
}

export default withRouter(connect(mapStateToProps)(MeasureComponent));