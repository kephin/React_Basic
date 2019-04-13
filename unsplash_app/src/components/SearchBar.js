import React, { Component } from "react"
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
})

class SearchBar extends Component {
  state = {
    term: '',
  }

  onInputChange = event => {
    this.setState({
      term: event.target.value,
    })
  }

  onFormSubmit = event => {
    event.preventDefault()
    this.props.onSubmit(this.state.term)
  }

  render() {
    const { classes } = this.props

    return (
      <form
        autoComplete="off"
        noValidate
        className={classes.container}
        onSubmit={this.onFormSubmit}
      >
        <TextField
          label="Image Search"
          margin="normal"
          className={classes.textField}
          value={this.state.term}
          onChange={this.onInputChange}
        />
      </form>
    )
  }
}

SearchBar.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(SearchBar)
