import React from 'react'
import styled from 'styled-components'

const Image = styled.img`
  width: 250px;
  grid-row-end: span ${props => props.gridRowEnd};
`

class ImageCard extends React.Component {
  constructor(props) {
    super(props)
    this.imageCardRef = React.createRef()
    this.state = {
      gridRowEnd: 0,
    }
  }

  componentDidMount() {
    this.imageCardRef.current.addEventListener('load', () => {
      const gridRowEnd = Math.ceil(this.imageCardRef.current.clientHeight / 10)
      this.setState({ gridRowEnd })
    })
  }

  render () {
    const { description, urls } = this.props.image
    return <Image ref={this.imageCardRef} src={urls.regular} alt={description} gridRowEnd={this.state.gridRowEnd} />
  }
}

export default ImageCard
