import React from 'react'
import { default as ReactCalendar } from 'react-calendar'
import { AvailableTimeSlotDateMap } from '../types'
import { dateToKey } from '../utils'

interface CalendarProps {
  date: Date | null
  loading: boolean
  onChangeMonth: (rangeStartDate: Date) => void
  onSelectDate: (selectedDate: Date) => void
  availableTimeSlots: AvailableTimeSlotDateMap
}

const Calendar: React.FC<CalendarProps> = ({
  date,
  loading,
  onChangeMonth,
  onSelectDate,
  availableTimeSlots
}) => {
  return (
    <div className='date_picker_container'>
      {loading && <div>Loading...</div>}
      <ReactCalendar
        minDetail='month'
        minDate={new Date()}
        showNeighboringMonth={false}
        onClickDay={(value, _) => onSelectDate(value)}
        onActiveStartDateChange={({ activeStartDate }) =>
          onChangeMonth(activeStartDate)
        }
        tileContent={(_) => {
          return <div className='react-calendar__tile-background' />
        }}
        tileDisabled={({ date }) => {
          const dateKey = dateToKey(date)

          const timeSlotsForDate = availableTimeSlots[dateKey]

          return !timeSlotsForDate || timeSlotsForDate.length === 0
        }}
        prevLabel={<i className='bi bi-chevron-left' />}
        nextLabel={<i className='bi bi-chevron-right' />}
        prev2Label={null}
        next2Label={null}
        value={date}
      />
    </div>
  )
}

export default Calendar
