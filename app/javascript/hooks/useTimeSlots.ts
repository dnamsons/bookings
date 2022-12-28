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

export const useTimeSlots = (rangeStartDate: Date, duration: string) => {
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
  }, [availableTimeIntervals])

  return { availableTimeSlots }
}
