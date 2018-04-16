import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { CircularProgress } from 'material-ui/Progress';

class RefreshIndicatorComponent extends Component {

    componentDidMount() {
        console.log("RefreshIndicatorComponent.componentDidMount() this.props=", JSON.stringify(this.props));
    }

    componentWillReceiveProps(nextProps) {
        console.log("RefreshIndicatorComponent.componentWillReceiveProps() props=", JSON.stringify(nextProps));
    }

    render() {
        console.log("RefreshIndicatorComponent.render()", this.props.refreshIndicator.status);
        if (this.props.refreshIndicator.status === "hide") {
            return null;
        }
        return (
            <CircularProgress
                size={90}
                style={{ position: 'absolute', top: 10, left: 40, zIndex: 1, color: '#ffffff' }}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        refreshIndicator: state.local.refreshIndicator,
    }
}

export default withRouter(connect(mapStateToProps)(RefreshIndicatorComponent));