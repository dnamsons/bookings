import React, { useEffect, useMemo, useState } from 'react'
import Calendar from 'react-calendar'
import dayjs from 'dayjs'
import { AvailableTimeSlot, useTimeSlots } from './hooks/useTimeSlots'
import axios, { AxiosError, isAxiosError } from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const dateToKey = (date: Date) => dayjs(date).format('YYYY-MM-DD')

interface BookingFormProps {
  onConfirmReservation: (timeSlot: AvailableTimeSlot) => void
}

const BookingForm: React.FC<BookingFormProps> = ({ onConfirmReservation }) => {
  const [rangeStartDate, setRangeStartDate] = useState<Date>(new Date())
  const [duration, setDuration] = useState<string>('00:15')
  const [date, setDate] = useState<Date>()

  const { availableTimeSlots } = useTimeSlots(rangeStartDate, duration)

  const timeSlotsForDate = useMemo(() => {
    if (!date) {
      return []
    }

    const dateKey = dateToKey(date)

    return availableTimeSlots[dateKey]
  }, [date, availableTimeSlots])

  console.log(timeSlotsForDate)

  useEffect(() => {
    console.debug('`availableTimeSlots` changed', availableTimeSlots)
  }, [availableTimeSlots])

  const onChangeMonth = (startDate: Date) => {
    setDate(undefined)

    if (startDate.getMonth() === new Date().getMonth()) {
      setRangeStartDate(new Date())
    } else {
      setRangeStartDate(startDate)
    }
  }

  return (
    <div className='h-100 w-100 d-inline-block text-center'>
      <h1>Book time for warehouse access</h1>

      <div className='row'>
        <div className='col'>
          <h2>Choose the time duration</h2>

          <input
            type='time'
            value={duration}
            onChange={({ target: { value } }) => setDuration(value)}
          />
        </div>

        <div className='col-8'>
          <h2>Select date and time</h2>

          <div className='container text-center'>
            <div className='row'>
              <div className='col'>
                <Calendar
                  minDetail='month'
                  minDate={new Date()}
                  showNeighboringMonth={false}
                  onClickDay={(value, _) => setDate(value)}
                  onActiveStartDateChange={({ activeStartDate }) =>
                    onChangeMonth(activeStartDate)
                  }
                  tileDisabled={({ date }) => {
                    const dateKey = dateToKey(date)

                    const timeSlotsForDate = availableTimeSlots[dateKey]

                    return !timeSlotsForDate || timeSlotsForDate.length === 0
                  }}
                  prev2Label={null}
                  next2Label={null}
                  value={date}
                />
              </div>

              <div className='col'>
                {date &&
                  timeSlotsForDate.map((timeSlot) => (
                    <div
                      key={timeSlot.start}
                      onClick={() => onConfirmReservation(timeSlot)}
                    >
                      {dayjs(timeSlot.start).format('HH:mm')}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

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

  const onConfirmReservation = (timeSlot: AvailableTimeSlot) => {
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
