import * as bootstrap from 'bootstrap'
import axios from 'axios'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import BookingPage from './BookingPage'

document.addEventListener('DOMContentLoaded', () => {
  const metaTag = document.querySelector(`meta[name='csrf-token']`)
  const crsfToken = metaTag ? metaTag.getAttribute('content') : null

  axios.defaults.headers.common['X-CSRF-Token'] = crsfToken

  const domContainer = document.getElementById('booking-container')

  if (domContainer) {
    const root = createRoot(domContainer)

    root.render(createElement(BookingPage))
  }
})
