import { useEffect, useState } from 'react'
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

interface DayjsInterval {
  start: dayjs.Dayjs
  end: dayjs.Dayjs
}

const timeSlotsFromInterval = (
  { start, end }: DayjsInterval,
  durationMinutes: number
): AvailableTimeSlot[] => {
  const slotEnd = start.add(durationMinutes, 'minutes')

  let timeSlots = []

  if (slotEnd.isBefore(end) || slotEnd.isSame(end)) {
    timeSlots.push({
      start: start.toISOString(),
      end: slotEnd.toISOString()
    })
  }

  if (slotEnd.isBefore(end)) {
    return timeSlots.concat(
      timeSlotsFromInterval(
        {
          start: slotEnd,
          end
        },
        durationMinutes
      )
    )
  } else {
    return timeSlots
  }
}

const calculateTimeSlots = (
  availableIntervalsByDate: AvailableTimeSlotDateMap,
  timeSlotDuration: string
): AvailableTimeSlotDateMap => {
  let [timeSlotDurationHours, timeSlotDurationMinutes] = timeSlotDuration
    .split(':')
    .map(Number)

  timeSlotDurationMinutes += timeSlotDurationHours * 60

  const intervalEntries = Object.entries(availableIntervalsByDate)
  const slotsByDateEntries = intervalEntries.map(([date, intervals]) => {
    let slotsForDate: AvailableTimeSlot[] = []

    intervals.forEach((interval) => {
      const start = dayjs(interval.start)
      const end = dayjs(interval.end)

      slotsForDate = slotsForDate.concat(
        timeSlotsFromInterval({ start, end }, timeSlotDurationMinutes)
      )
    })
    return [date, slotsForDate]
  })

  return Object.fromEntries(slotsByDateEntries)
}

export const useTimeSlots = (
  rangeStartDate: Date,
  requiredTimeSlotDuration: string
) => {
  const [availableTimeIntervals, setAvailableTimeIntervals] =
    useState<AvailableTimeSlotDateMap>({})

  const [availableTimeSlots, setAvailableTimeSlots] =
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

    const timeSlots = calculateTimeSlots(
      availableTimeIntervals,
      requiredTimeSlotDuration
    )

    setAvailableTimeSlots(timeSlots)
  }, [availableTimeIntervals, requiredTimeSlotDuration])

  return { availableTimeSlots }
}
