import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import { mylocalizedstrings } from '../services/localizedstring';
//import * as actions from '../actions/map';

var axios = require('axios');

const styles = theme => ({
  root: {
    margin: '15px',
    width: 'calc(40% - 100px)',
    color: 'currentColor'
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  chip: {
    height: '25px',
    margin: '2px',
  },
  inputRoot: {
    flexWrap: 'wrap',
    color: 'currentColor'
  },
});



function renderInput(inputProps) {
  const { InputProps, classes, ref, ...other } = inputProps;
  console.log("TassonomiaAutoComplete.renderInput()");
  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
        },
        ...InputProps,
      }}
      {...other}
    />
  );
}

function renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
  console.log("TassonomiaAutoComplete.renderSuggestion()", JSON.stringify(suggestion));
  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={mylocalizedstrings.getString(suggestion.routingrecord.label, mylocalizedstrings.getLanguage()) + ' ' + suggestion.label}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
    >
      <Typography variant="subheading">
        {suggestion.label}
      </Typography>
      &nbsp;
      <Typography variant="caption" style={{ fontStyle: 'italic', }}>
        {mylocalizedstrings.getString(suggestion.routingrecord.label, mylocalizedstrings.getLanguage())}
      </Typography>
    </MenuItem>
  );
}
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired,
};



class TassonomiaAutoComplete extends React.Component {


  constructor(props) {
    super(props);
    let selectedItem = [];
    let selectedRecord = [];
    let thehash = decodeURIComponent(window.location.hash).replace(/#\//, '');
    let _array = thehash.split('/');
    console.log("TassonomiaAutoComplete()", thehash, JSON.stringify(_array));
    _array.forEach((_record, index) => {
      if (index < 8) {
        if (_record !== '*' && _record !== '') {
          selectedItem = [...selectedItem, _record];
          let _selectedRecord = {
            routingrecord: this.props.local.mapConfig.routing[index % 4],
            label: _record,
          };
          console.log("TassonomiaAutoComplete() -> ", JSON.stringify(_selectedRecord));
          selectedRecord = [...selectedRecord, _selectedRecord];
        }
      }
    });
    this.state = {
      inputValue: '',
      selectedItem: selectedItem,
      selectedRecord: selectedRecord,
      suggestions: []
    };
    console.log("TassonomiaAutoComplete() this.state:", JSON.stringify(this.state));
  }

  handleKeyDown = event => {
    console.log("TassonomiaAutoComplete.handleKeyDown()");
    const { inputValue, selectedItem } = this.state;
    if (selectedItem.length && !inputValue.length && keycode(event) === 'backspace') {
      this.setState({
        selectedItem: selectedItem.slice(0, selectedItem.length - 1),
      });
    }
  };

  handleInputChange = event => {
    console.log("TassonomiaAutoComplete.handleInputChange()", event.target.value);
    this.setState({ inputValue: event.target.value });

    const url = this.props.local.mapConfig.tassonomiaserviceurl + event.target.value;
    console.log("GET", url);
    axios.get(url)
      .then((response) => {
        console.log("response:", JSON.stringify(response.data));
        const _datasource = [];
        this.props.local.mapConfig.routing.forEach(routingrecord => {
          if (response.data[routingrecord.field]) {
            if (response.data[routingrecord.field].length > 0) {
              response.data[routingrecord.field].forEach(element => {
                _datasource.push({
                  routingrecord: routingrecord,
                  label: element,
                });
              });
            }
          }
        });
        this.setState({ suggestions: _datasource });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleChange = item => {
    let { selectedItem, selectedRecord, suggestions } = this.state;

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }

    if (selectedItem.length > 2) {
      selectedItem = selectedItem.slice(1, 3);
    }

    this.setState({
      inputValue: '',
      selectedItem,
    });

    let _selectedRecord = suggestions.filter(_record => _record.label === item)[0];
    //this.props.history.push(_selectedRecord.routingrecord.routinglevel + _selectedRecord.label);
    selectedRecord = [...selectedRecord, _selectedRecord];
    if (selectedRecord.length > 2) {
      selectedRecord = selectedRecord.slice(1, 3);
    }
    this.setState({ selectedRecord });
    console.log("TassonomiaAutoComplete.handleChange()", JSON.stringify(selectedRecord));
    this.handlePermalinkMask(selectedRecord);
  };

  handleDelete = item => () => {
    const selectedItem = [...this.state.selectedItem];
    selectedItem.splice(selectedItem.indexOf(item), 1);
    this.setState({ selectedItem });
    const selectedRecord = this.state.selectedRecord.filter(_record => _record.label !== item);
    this.setState({ selectedRecord });
    console.log("TassonomiaAutoComplete.handleDelete()", item);
    this.handlePermalinkMask(selectedRecord);
  };

  handlePermalinkMask(selectedRecord) {
    console.log("TassonomiaAutoComplete.handlePermalinkMask()", JSON.stringify(selectedRecord));
    let permalinkmask = this.props.local.mapConfig.permalinkmask.replace(/^\//, '');
    let thehash = decodeURIComponent(window.location.hash).replace(/^#\//, '');
    console.log("TassonomiaAutoComplete.handlePermalinkMask() permalinkmask:", permalinkmask, "window.location.hash:", thehash);

    let _permalinkmaskarray = permalinkmask.split("/");
    const _locationarray = thehash.split("/");

    _permalinkmaskarray = _permalinkmaskarray.map((_record, _index) => {
      let returnvalue = '*';
      if (_record === '<HABITAT>') {
        returnvalue = _locationarray[_index];
      } else if (_record === '<REGPROV>') {
        returnvalue = _locationarray[_index];
      }

      selectedRecord.forEach((_selectedRecord, _selectedRecordIndex) => {
        let _mask = _selectedRecord.routingrecord.mask.replace(/xx/g, '' + (_selectedRecordIndex + 1));
        if (_record === _mask) {
          returnvalue = _selectedRecord.label ? _selectedRecord.label : '*';
        }
      });

      console.log("TassonomiaAutoComplete.handlePermalinkMask() sostituisco", _record, "con", returnvalue);
      return returnvalue;
    });

    permalinkmask = '/' + _permalinkmaskarray.join('/');
    console.log("TassonomiaAutoComplete.handlePermalinkMask() permalinkmask:", permalinkmask);

    try {
      let _array = [
        this.props.map.zoom,
        '' + Math.round(this.props.map.center[0] * 100) / 100,
        '' + Math.round(this.props.map.center[1] * 100) / 100,
        this.props.map.bearing
      ];
      permalinkmask += '/' + _array.join('/');
      console.log("TassonomiaAutoComplete.handlePermalinkMask() permalinkmask:", permalinkmask);
    } catch (error) {
      console.error(error);
    }

    this.props.history.push(permalinkmask);
  }

  getSuggestions(inputValue) {
    console.log("TassonomiaAutoComplete.getSuggestions()", inputValue);
    let count = 0;
    return this.state.suggestions.filter(suggestion => {
      return (count++ < 12)
    });
  }



  render() {
    console.log("TassonomiaAutoComplete.render()");
    const { classes } = this.props;
    const { inputValue, selectedItem } = this.state;

    return (
      <div className={classes.root}>
        <Downshift inputValue={inputValue} onChange={this.handleChange} selectedItem={selectedItem} classes={classes}>
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue: inputValue2,
            selectedItem: selectedItem2,
            highlightedIndex,
          }) => (
              <div className={classes.container}>
                {renderInput({
                  fullWidth: true,
                  classes,
                  InputProps: getInputProps({
                    startAdornment: selectedItem.map(item => (
                      <Chip
                        key={item}
                        tabIndex={-1}
                        label={item}
                        className={classes.chip}
                        onDelete={this.handleDelete(item)}
                      />
                    )),
                    onChange: this.handleInputChange,
                    onKeyDown: this.handleKeyDown,
                    placeholder: `${mylocalizedstrings.tassonomialabel}`,
                    id: 'integration-downshift-multiple',
                  }),
                })}
                {isOpen ? (
                  <Paper className={classes.paper} square>
                    {this.getSuggestions(inputValue2).map((suggestion, index) =>
                      renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({ item: suggestion.label }),
                        highlightedIndex,
                        selectedItem: selectedItem2,
                      }),
                    )}
                  </Paper>
                ) : null}
              </div>
            )}
        </Downshift>
      </div>
    );
  }
}

TassonomiaAutoComplete.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  //console.log("TassonomiaAutoComplete.mapStateToProps()");
  return {
    map: state.map,
    local: state.local,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TassonomiaAutoComplete)));