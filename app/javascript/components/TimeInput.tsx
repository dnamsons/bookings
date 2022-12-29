import React from 'react'

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange }) => {
  const onChangeTime = (value: string) => {
    if (value === '00:00') {
      value = '00:01'
    }

    onChange(value)
  }

  return (
    <div className='time_input'>
      <input
        type='time'
        value={value}
        onChange={({ target: { value } }) => onChangeTime(value)}
      />
      <i className='bi bi-clock'></i>
    </div>
  )
}

export default TimeInput
