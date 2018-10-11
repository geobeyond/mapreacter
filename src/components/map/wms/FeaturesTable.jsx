import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#00601d',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'hidden',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.common.white,
      color: '#00601d',
    },
  },
});

function featuresTableBody(classes, layer, features) {
  let rows = [];
  for (let i = 0, ii = features.length; i < ii; ++i) {
    const feature = features[i];
    const keys = Object.keys(feature.properties);
    for (let j = 0, jj = keys.length; j < jj; ++j) {
      const key = `${i}-${keys[j]}`;
      rows.push(
        <TableRow className={classes.row} key={key}>
          <CustomTableCell>{j===0?layer:''}</CustomTableCell>
          <CustomTableCell>{keys[j]}</CustomTableCell>
          <CustomTableCell dangerouslySetInnerHTML={{__html: feature.properties[keys[j]]}} />
        </TableRow>
      );
    }
  }
  return rows;
}

function FeaturesTable(props) {
  const { classes, items } = props;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>Layer</CustomTableCell>
            <CustomTableCell>feature id</CustomTableCell>
            <CustomTableCell>feature value</CustomTableCell>
          </TableRow>
        </TableHead>
        {items.map(n => {
          return (
            <TableBody>
              {featuresTableBody(classes, n.layer, n.features)}
            </TableBody>
          );
        })}
      </Table>
    </Paper>
  );
}

FeaturesTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FeaturesTable);
