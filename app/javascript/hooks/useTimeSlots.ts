import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { AvailableTimeSlot, AvailableTimeSlotDateMap } from '../types'
import { dateToKey } from '../utils'
import axios from 'axios'
import toast from 'react-hot-toast'

type BookingAvailabilitiesResponse = AvailableTimeSlot[]

interface DayjsInterval {
  start: dayjs.Dayjs
  end: dayjs.Dayjs
}

const timeSlotsFromInterval = (
  { start, end }: DayjsInterval,
  durationMinutes: number,
  requiredAligmentInMinutes: number
): AvailableTimeSlot[] => {
  const slotEnd = start.add(durationMinutes, 'minutes')

  let timeSlots = []

  if (slotEnd.isBefore(end) || slotEnd.isSame(end)) {
    timeSlots.push({
      start: start.toISOString(),
      end: slotEnd.toISOString()
    })
  }

  const nextStart = slotEnd.add(requiredAligmentInMinutes, 'minutes')
  // Ensure that there is some time remaining after adding the slot
  // and that we haven't crossed midnight
  if (nextStart.isBefore(end) && nextStart.date() === start.date()) {
    return timeSlots.concat(
      timeSlotsFromInterval(
        {
          start: nextStart,
          end
        },
        durationMinutes,
        requiredAligmentInMinutes
      )
    )
  } else {
    return timeSlots
  }
}

const isBeginningOfDay = (interval: string) =>
  dayjs(interval).isSame(dayjs(interval).startOf('date'))

const isEndOfDay = (interval: string) =>
  dayjs(interval).isSame(dayjs(interval).endOf('date'))

const calculateNecessaryAligment = (slotMinutes: number) => {
  const remainder = slotMinutes % 15

  if (remainder === 0) {
    return 0
  }

  return 15 - remainder
}

const calculateTimeSlots = (
  availableIntervalsByDate: AvailableTimeSlotDateMap,
  timeSlotDuration: string
): AvailableTimeSlotDateMap => {
  let [timeSlotDurationHours, timeSlotDurationMinutes] = timeSlotDuration
    .split(':')
    .map(Number)

  timeSlotDurationMinutes += timeSlotDurationHours * 60
  const aligment = calculateNecessaryAligment(timeSlotDurationMinutes)

  const intervalEntries = Object.entries(availableIntervalsByDate)
  const slotsByDateEntries = intervalEntries.map(([date, intervals], index) => {
    // Last entry is the first date of the next month
    if (index === intervalEntries.length - 1) {
      return [date, []]
    }

    let slotsForDate: AvailableTimeSlot[] = []

    intervals.forEach((interval) => {
      let intervalEnd = interval.end

      // If the interval ends at the end of current date(i.e. 23:59:59)
      // And the first interval of the next date starts at the beginning of the date(i.e. 00:00:00)
      // We may be able to book a time slot that crosses midnight
      if (isEndOfDay(intervalEnd) && !!intervalEntries[index + 1]) {
        const [_date, nextDateIntervals] = intervalEntries[index + 1]
        const [firstIntervalForNextDate, _] = nextDateIntervals

        if (!!interval && isBeginningOfDay(firstIntervalForNextDate.start)) {
          intervalEnd = firstIntervalForNextDate.end
        }
      }

      const start = dayjs(interval.start)
      const end = dayjs(intervalEnd)

      slotsForDate = slotsForDate.concat(
        timeSlotsFromInterval({ start, end }, timeSlotDurationMinutes, aligment)
      )
    })
    return [date, slotsForDate]
  })

  return Object.fromEntries(slotsByDateEntries)
}

const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone

const groupAvailableIntervalsByDate = (intervals: AvailableTimeSlot[]) => {
  return intervals.reduce((acc, interval) => {
    const dateKey = dateToKey(new Date(interval.start))

    acc[dateKey] ??= []
    acc[dateKey].push(interval)

    return acc
  }, {} as AvailableTimeSlotDateMap)
}

export const useTimeSlots = (
  rangeStartDate: Date,
  requiredTimeSlotDuration: string
) => {
  const [availableTimeIntervals, setAvailableTimeIntervals] =
    useState<AvailableTimeSlotDateMap>({})

  const [availableTimeSlots, setAvailableTimeSlots] =
    useState<AvailableTimeSlotDateMap>({})

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const startDate = dayjs(rangeStartDate).format('DD-MM-YYYY')
    const endDate = dayjs(rangeStartDate)
      .endOf('month')
      .add(1, 'day')
      .format('DD-MM-YYYY')

    axios
      .get<BookingAvailabilitiesResponse>('/api/availability', {
        params: { start_date: startDate, end_date: endDate, timezone: TIMEZONE }
      })
      .then(({ data: intervals }) => {
        const timeIntervalsByDay = groupAvailableIntervalsByDate(intervals)

        setAvailableTimeIntervals(timeIntervalsByDay)
      })
      .catch((_) => {
        toast.error('System error')
      })
      .finally(() => setLoading(false))
  }, [rangeStartDate])

  useEffect(() => {
    const timeSlots = calculateTimeSlots(
      availableTimeIntervals,
      requiredTimeSlotDuration
    )

    setAvailableTimeSlots(timeSlots)
  }, [availableTimeIntervals, requiredTimeSlotDuration])

  return { availableTimeSlots, loading }
}
