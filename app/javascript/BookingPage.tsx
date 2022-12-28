import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import dayjs from 'dayjs'
import { useTimeSlots } from './hooks/useTimeSlots'

const BookingPage: React.FC = () => {
  const [rangeStartDate, setRangeStartDate] = useState<Date>(new Date())
  const [duration, setDuration] = useState<string>('00:15')
  const [date, setDate] = useState<Date>()

  const { availableTimeSlots } = useTimeSlots(rangeStartDate, duration)

  useEffect(() => {
    console.debug('`availableTimeSlots` changed', availableTimeSlots)
  }, [availableTimeSlots])

  return (
    <div>
      <h1>Book time for warehouse access</h1>

      <div>
        <h2>Choose the time duration</h2>

        <input
          type='time'
          value={duration}
          onChange={({ target: { value } }) => setDuration(value)}
        />
      </div>

      <div>
        <h2>Select date and time</h2>

        <Calendar
          minDetail='month'
          minDate={new Date()}
          showNeighboringMonth={false}
          onClickDay={(value, _) => setDate(value)}
          onActiveStartDateChange={({ activeStartDate }) =>
            setRangeStartDate(activeStartDate)
          }
          value={date}
        />
      </div>
    </div>
  )
}

export default BookingPage
