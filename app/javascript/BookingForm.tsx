import React, { useEffect, useMemo, useState } from 'react'
import Calendar from 'react-calendar'
import dayjs from 'dayjs'
import { AvailableTimeSlot, useTimeSlots } from './hooks/useTimeSlots'

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
    <div className='h-100 w-100 d-block text-center'>
      <h1>Book time for warehouse access</h1>

      <div className='row'>
        <div className='col-8'>
          <div className='date_picker_container'>
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
        </div>

        <div className='col'>
          <h2>Choose the time duration</h2>

          <input
            type='time'
            value={duration}
            onChange={({ target: { value } }) => setDuration(value)}
          />

          <div className='time_slot_picker'>
            {date &&
              timeSlotsForDate.map((timeSlot) => (
                <button
                  className='time_slot'
                  key={timeSlot.start}
                  onClick={() => onConfirmReservation(timeSlot)}
                >
                  {dayjs(timeSlot.start).format('HH:mm')}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingForm
