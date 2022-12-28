import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import BookingPage from './BookingPage'

const domContainer = document.getElementById('booking-container')

if (domContainer) {
  const root = createRoot(domContainer)

  root.render(createElement(BookingPage))
}
