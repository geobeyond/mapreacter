import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import Chip from 'material-ui/Chip';
import Typography from 'material-ui/Typography';

import { mylocalizedstrings } from '../services/localizedstring';

var axios = require('axios');

const styles = theme => ({
  root: {
    margin: '15px',
    width: '400px',
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

let suggestions = [];

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

function getSuggestions(inputValue) {
  console.log("TassonomiaAutoComplete.getSuggestions()", inputValue);
  let count = 0;
  return suggestions.filter(suggestion => {
    return (count++ < 12)
  });
}

class TassonomiaAutoComplete extends React.Component {
  state = {
    inputValue: '',
    selectedItem: [],
    selectedRecord: []
  };

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
    this.setState({ _inputValue: event.target.value });

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
        suggestions = _datasource;
        this.setState({ inputValue: this.state._inputValue });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleChange = item => {
    let { selectedItem, selectedRecord } = this.state;

    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }

    this.setState({
      inputValue: '',
      selectedItem,
    });

    let _selectedRecord = suggestions.filter(_record => _record.label === item)[0];
    //this.props.history.push(_selectedRecord.routingrecord.routinglevel + _selectedRecord.label);
    selectedRecord = [...selectedRecord, _selectedRecord];
    this.setState({ selectedRecord });
    console.log("TassonomiaAutoComplete.handleChange()", selectedItem, JSON.stringify(selectedRecord));
    this.handlePermalink(selectedRecord);
  };

  handleDelete = item => () => {
    const selectedItem = [...this.state.selectedItem];
    selectedItem.splice(selectedItem.indexOf(item), 1);
    this.setState({ selectedItem });
    const selectedRecord = this.state.selectedRecord.filter(_record => _record.label !== item);
    this.setState({ selectedRecord });
    console.log("TassonomiaAutoComplete.handleDelete()", item, selectedItem, JSON.stringify(selectedRecord));
    this.handlePermalink(selectedRecord);
  };

  handlePermalink(selectedRecord) {
    console.log("TassonomiaAutoComplete.handlePermalink() selectedRecord:", JSON.stringify(selectedRecord));
    let permalink = this.props.local.mapConfig.permalink;
    console.log("TassonomiaAutoComplete.handlePermalink() permalink:", permalink);
    selectedRecord.forEach( (_record, index) => {
      permalink = permalink.replace(_record.routingrecord.mask, _record.label);
      console.log("TassonomiaAutoComplete.handlePermalink() permalink:", permalink);
    });
    //permalink = permalink.replace(/\<.*\>/, '*');
    permalink = permalink.replace(/<ORDER>/g,'*');
    permalink = permalink.replace(/<GENUS>/g,'*');
    permalink = permalink.replace(/<FAMILY>/g,'*');
    permalink = permalink.replace(/<SPECIES>/g,'*');
    console.log("TassonomiaAutoComplete.handlePermalink() permalink:", permalink);
    this.props.history.push(permalink);
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
                    {getSuggestions(inputValue2).map((suggestion, index) =>
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
    local: state.local,
    tassonomia: state.tassonomia,
  }
}

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(TassonomiaAutoComplete)));