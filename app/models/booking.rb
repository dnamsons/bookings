class Booking < ApplicationRecord
  validate :booking_times_cannot_overlap

  def self.in_date_range(date_range)
    datetime_range = (date_range.first.beginning_of_day..date_range.last.end_of_day)

    where(start_time: datetime_range).or(where(end_time: datetime_range))
  end

  def self.overlaps_exclusively_with(column_name, range)
    where("#{column_name} > :start AND #{column_name} < :end", start: range.first, end: range.last)
  end

  # Finds bookings that overlap with a booking.
  # This is an exclusive check - the start and end of the range is ignored
  # We do this because it is perfectly okay for a one booking to end on the midnight
  # And for the next booking to start on the midnight
  def self.overlapping(booking)
    booking_range = booking.start_time..booking.end_time

    overlaps_exclusively_with(:start_time, booking_range).or(overlaps_exclusively_with(:end_time, booking_range))
  end

  def starts_on_midnight?
    start_time.in_time_zone.strftime("%H:%M:%S") == "00:00:00"
  end

  def crosses_midnight?
    start_time.to_date.tomorrow == end_time.to_date
  end

  def booking_times_cannot_overlap
    return if Booking.overlapping(self).none?

    errors.add(:base, "There is an already booked time slot with overlapping time")
  end
end
