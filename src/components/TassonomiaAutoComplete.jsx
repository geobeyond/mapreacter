import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import AutoComplete from 'material-ui/AutoComplete';
import { Menu, MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import { tassonomiastore, newDataAction } from './tassonomiaredux';

var axios = require('axios');

class TassonomiaAutoComplete extends Component {

  state = {
    dataSource: [],
    searchText: '',
  };

  constructor(props) {
    super(props);
    tassonomiastore.subscribe(() => {

      const _datasource = [];
      this.props.config.routing.forEach(routingrecord => {
        if (tassonomiastore.getState()._data[routingrecord.field]) {
          if (tassonomiastore.getState()._data[routingrecord.field].length > 0) {
            _datasource.push({ text: '', value: (<Divider />), });
            _datasource.push({ text: '', value: (<MenuItem primaryText={routingrecord.label} disabled={true} />), });
            tassonomiastore.getState()._data[routingrecord.field].forEach(element => {
              _datasource.push({
                text: routingrecord.routinglevel + element,
                value: (<MenuItem primaryText={element} />),
              });
            });            
          }
        }
      });
      
      this.setState({
        dataSource: _datasource,
      });
    });
  }

  handleUpdateInput = (value) => {
    console.log("TassonomiaAutoComplete.handleUpdateInput()");
    this.setState({
      searchText: value,
    });
    const url =  this.props.config.tassonomiaserviceurl + value;
    console.log("GET", url);
    axios.get(url)
      .then((response) => {
        console.log("response:", JSON.stringify(response.data));
        tassonomiastore.dispatch(newDataAction(response.data));
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
    return (
      <div>
        <AutoComplete
          hintText="Phylum / Famiglia ..."
          dataSource={this.state.dataSource}
          searchText={this.state.searchText}
          onUpdateInput={this.handleUpdateInput}
          onNewRequest={this.handleOnNewRequest}
          filter={AutoComplete.noFilter}
          openOnFocus={true}
          maxSearchResults={15}
          id={'tassonomiaautocomplete'}
          className={'tassonomiaautocomplete'}
        />
      </div>
    );
  }

}

export default withRouter(TassonomiaAutoComplete);