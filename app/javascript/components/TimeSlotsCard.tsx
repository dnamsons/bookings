import dayjs from 'dayjs'
import React from 'react'
import { TimeInterval } from '../types'

const TimeSlotsCard: React.FC<{
  date: Date
  timeSlots: TimeInterval[]
  onConfirmReservation: (timeSlot: TimeInterval) => void
}> = ({ date, timeSlots, onConfirmReservation }) => {
  return (
    <div className='time_slots'>
      <p>{dayjs(date).format('LL')}</p>

      <div className='time_slots__list'>
        {timeSlots.map((timeSlot) => (
          <button
            className='time_slots__slot'
            key={timeSlot.start}
            onClick={() => onConfirmReservation(timeSlot)}
          >
            {dayjs(timeSlot.start).format('HH:mm')}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TimeSlotsCard
