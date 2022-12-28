import React, { useEffect, useMemo, useState } from 'react'
import Calendar from 'react-calendar'
import dayjs from 'dayjs'
import { useTimeSlots } from './hooks/useTimeSlots'

const BookingPage: React.FC = () => {
  const [rangeStartDate, setRangeStartDate] = useState<Date>(new Date())
  const [duration, setDuration] = useState<string>('00:15')
  const [date, setDate] = useState<Date>()

  const { availableTimeSlots } = useTimeSlots(rangeStartDate, duration)

  const timeSlotsForDate = useMemo(() => {
    if (!date) {
      return []
    }

    const dateKey = dayjs(date).format('YYYY-MM-DD')

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
            onChangeMonth(activeStartDate)
          }
          prev2Label={null}
          next2Label={null}
          value={date}
        />

        {date &&
          timeSlotsForDate.map(({ start }) => (
            <div key={start}>{dayjs(start).format('HH:mm')}</div>
          ))}
      </div>
    </div>
  )
}

export default BookingPage
