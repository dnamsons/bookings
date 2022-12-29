export interface AvailableTimeSlot {
  start: string
  end: string
}

export type AvailableTimeSlotDateMap = Record<string, AvailableTimeSlot[]>
