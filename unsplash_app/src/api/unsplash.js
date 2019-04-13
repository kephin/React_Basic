import axios from 'axios'

export default axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization: 'Client-ID d3bf95e6adc7bc93f6f6f726ce53a449c659f2c07be7b6abe85e1ffd7f19177d',
  },
})
