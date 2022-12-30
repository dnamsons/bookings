import React, { useState } from 'react'
import axios, { AxiosError, isAxiosError } from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import BookingForm from './BookingForm'
import { TimeInterval } from './types'
import { TIMEZONE } from './utils'

const BookingConfirmation: React.FC<{ bookingId: string }> = ({
  bookingId
}) => {
  return (
    <div>
      <div className='alert alert-success' role='alert'>
        Booked successfully!
      </div>
    </div>
  )
}

type CreateBookingResponse = { id: string }
type CreateBookingErrorResponse = { errors: string[] }

const BookingPage: React.FC = () => {
  const [bookingId, setBookingId] = useState<string>()

  const onConfirmReservation = (timeSlot: TimeInterval) => {
    axios
      .post<CreateBookingResponse>('/api/bookings', {
        start_time: timeSlot.start,
        end_time: timeSlot.end,
        timezone: TIMEZONE
      })
      .then(({ data: { id } }) => setBookingId(id))
      .catch((error: Error | AxiosError<CreateBookingErrorResponse>) => {
        if (isAxiosError<CreateBookingErrorResponse>(error) && error.response) {
          const { data } = error.response

          if ('errors' in data) {
            data.errors.forEach((error: string) => toast.error(error))
          }
        } else {
          toast.error('System error')
        }
      })
  }

  return (
    <>
      {bookingId ? (
        <BookingConfirmation bookingId={bookingId} />
      ) : (
        <BookingForm onConfirmReservation={onConfirmReservation} />
      )}

      <Toaster />
    </>
  )
}

export default BookingPage
