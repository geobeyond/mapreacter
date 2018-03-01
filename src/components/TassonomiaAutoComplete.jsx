import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import AutoComplete from 'material-ui/AutoComplete';
import { MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import { newDataSourceAction } from './tassonomiaredux';
import { mylocalizedstrings } from '../services/localizedstring';

var axios = require('axios');

class TassonomiaAutoComplete extends Component {

  state = {
    searchText: '',
  };

  handleUpdateInput = (value) => {
    console.log("TassonomiaAutoComplete.handleUpdateInput()");
    this.setState({
      searchText: value,
    });
    const url = this.props.config.tassonomiaserviceurl + value;
    console.log("GET", url);
    axios.get(url)
      .then((response) => {
        console.log("response:", JSON.stringify(response.data));
        const _datasource = [];
        this.props.config.routing.forEach(routingrecord => {
          if (response.data[routingrecord.field]) {
            if (response.data[routingrecord.field].length > 0) {
              if (_datasource.length > 0) {
                _datasource.push({ text: '', value: (<Divider />), });
              }
              _datasource.push({
                text: '', value: (
                  <MenuItem primaryText={mylocalizedstrings.getString(routingrecord.label, mylocalizedstrings.getLanguage())} disabled={true} />
                ),
              });
              response.data[routingrecord.field].forEach(element => {
                _datasource.push({
                  text: routingrecord.routinglevel + element,
                  value: (<MenuItem primaryText={element} />),
                });
              });
            }
          }
        });
        this.props.newDataSourceAction(_datasource);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleOnNewRequest = (chosenRequest, index) => {
    console.log("TassonomiaAutoComplete.handleOnNewRequest()", chosenRequest, index);
    this.setState({
      searchText: '',
    });
    this.props.history.push(chosenRequest.text);
  }

  render() {
    console.log("TassonomiaAutoComplete.render()");
    return (
      <AutoComplete
        style={this.props['style'] ? this.props.style : {}}
        hintText={mylocalizedstrings.tassonomialabel}
        dataSource={this.props.tassonomia.dataSource}
        searchText={this.state.searchText}
        onUpdateInput={this.handleUpdateInput}
        onNewRequest={this.handleOnNewRequest}
        filter={AutoComplete.noFilter}
        openOnFocus={true}
        maxSearchResults={15}
        id={'tassonomiaautocomplete'}
        className={'tassonomiaautocomplete'}
      />
    );
  }

}

const mapStateToProps = (state) => {
  //console.log("TassonomiaAutoComplete.mapStateToProps()");
  return {
    tassonomia: state.tassonomia
  }
}

const mapDispatchToProps = {
  newDataSourceAction
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TassonomiaAutoComplete));
