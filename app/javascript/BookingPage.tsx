import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import dayjs from 'dayjs'

type AvailableTimeSlotDateMap = Record<string, AvailableTimeSlot[]>

interface AvailableTimeSlot {
  start: string
  end: string
}

interface BookingAvailabilitiesDay {
  date: string
  available_times: AvailableTimeSlot[]
}

interface BookingAvailabilitiesResponse {
  days: BookingAvailabilitiesDay[]
}

const BookingPage: React.FC = () => {
  const [rangeStartDate, setRangeStartDate] = useState<Date>(new Date())
  const [duration, setDuration] = useState<string>('00:15')
  const [date, setDate] = useState<Date>()
  const [availableTimeIntervals, setAvailableTimeIntervals] =
    useState<AvailableTimeSlotDateMap>({})

  useEffect(() => {
    console.debug('`rangeStartDate` changed', rangeStartDate)

    const startDate = dayjs(rangeStartDate).format('DD-MM-YYYY')
    const endDate = dayjs(rangeStartDate).endOf('month').format('DD-MM-YYYY')

    fetch(
      `/api/booking_availabilities?start_date=${startDate}&end_date=${endDate}`
    )
      .then((res) => res.json() as Promise<BookingAvailabilitiesResponse>)
      .then(({ days }) => {
        const timeIntervals = Object.fromEntries(
          days.map((day) => [day.date, day.available_times])
        )

        setAvailableTimeIntervals(timeIntervals)
      })
  }, [rangeStartDate])

  useEffect(() => {
    console.debug('`availableTimeIntervals` changed', availableTimeIntervals)
  }, [availableTimeIntervals])

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
