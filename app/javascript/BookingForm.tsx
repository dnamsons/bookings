import React, { useMemo, useState } from 'react'
import { useTimeSlots } from './hooks/useTimeSlots'
import { TimeInterval } from './types'
import TimeSlotDurationCard from './components/TimeSlotDurationCard'
import TimeSlotsCard from './components/TimeSlotsCard'
import Calendar from './components/Calendar'
import { dateToKey } from './utils'

interface BookingFormProps {
  onConfirmReservation: (timeSlot: TimeInterval) => void
}

const BookingForm: React.FC<BookingFormProps> = ({ onConfirmReservation }) => {
  const [rangeStartDate, setRangeStartDate] = useState<Date>(new Date())
  const [duration, setDuration] = useState<string>('00:15')
  const [date, setDate] = useState<Date | null>(new Date())

  const { availableTimeSlots, loading } = useTimeSlots(rangeStartDate, duration)

  const timeSlotsForDate = useMemo(() => {
    if (!date) {
      return []
    }

    const dateKey = dateToKey(date)

    return availableTimeSlots[dateKey] || []
  }, [date, availableTimeSlots])

  const onChangeMonth = (startDate: Date) => {
    setDate(null)

    if (startDate.getMonth() === new Date().getMonth()) {
      setRangeStartDate(new Date())
    } else {
      setRangeStartDate(startDate)
    }
  }

  return (
    <div className='h-100 w-100 d-block text-center'>
      <h1>Book time for warehouse access</h1>

      <div className='booking_form'>
        <div className='row'>
          <div className='col-8'>
            <Calendar
              date={date}
              loading={loading}
              onChangeMonth={onChangeMonth}
              onSelectDate={setDate}
              availableTimeSlots={availableTimeSlots}
            />
          </div>

          <div className='col right_side_container'>
            <TimeSlotDurationCard
              duration={duration}
              setDuration={setDuration}
            />

            {date && (
              <TimeSlotsCard
                date={date}
                timeSlots={timeSlotsForDate}
                onConfirmReservation={onConfirmReservation}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingForm
