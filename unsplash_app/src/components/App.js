import React, { Component, Fragment } from 'react'
import unsplash from '../api/unsplash'

import SearchBar from './SearchBar'
import ImageList from './ImageList'

class App extends Component {
  state = { images: [] }

  onSearchSubmit = async term => {
    const response = await unsplash.get('/search/photos', {
      params: { query: term },
    })
    this.setState({ images: response.data.results })
  }

  render() {
    return (
      <Fragment>
        <SearchBar onSubmit={this.onSearchSubmit} />
        <ImageList images={this.state.images}/>
      </Fragment>
    )
  }
}

export default App
