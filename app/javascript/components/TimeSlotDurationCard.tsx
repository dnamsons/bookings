import React from 'react'
import TimeInput from './TimeInput'

const TimeSlotDurationCard: React.FC<{
  duration: string
  setDuration: React.Dispatch<React.SetStateAction<string>>
}> = ({ duration, setDuration }) => (
  <div className='time_slot_duration'>
    <p>Choose the time duration</p>

    <div className='time_slot_duration__field_container'>
      <TimeInput value={duration} onChange={setDuration} />
    </div>
  </div>
)

export default TimeSlotDurationCard
