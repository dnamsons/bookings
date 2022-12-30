export interface TimeInterval {
  start: string
  end: string
}

export type AvailableTimeSlotDateMap = Record<string, TimeInterval[]>
