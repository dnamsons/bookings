import React from 'react'

const BookingConfirmationCard: React.FC<{ onClose: () => void }> = ({
  onClose
}) => {
  return (
    <div className='booking_confirmation'>
      <div className='booking_confirmation__card'>
        <div className='booking_confirmation__card_button_row'>
          <i
            onClick={onClose}
            className='bi bi-arrow-left booking_confirmation__back'
          />
        </div>

        <div className='booking_confirmation__title_row'>
          <h3 className='booking_confirmation__title'>
            <i className='bi bi-building-fill-check' />
            Booked successfully!
          </h3>
        </div>
      </div>
    </div>
  )
}

export default BookingConfirmationCard
