class Booking < ApplicationRecord
  validate :booking_times_cannot_overlap

  def self.in_date_range(date_range)
    datetime_range = (date_range.first.beginning_of_day..date_range.last.end_of_day)

    where(start_time: datetime_range).or(where(end_time: datetime_range))
  end

  # Finds all bookings that overlap with a booking.
  # This is an exclusive check - the start and end of the range is ignored
  # We do this because it is perfectly okay for a one booking to end on the midnight
  # And for the next booking to start on the midnight
  def self.overlapping(booking)
    where('start_time <= :start AND end_time > :start', start: booking.start_time).or(
      where('start_time < :end AND end_time >= :end', end: booking.end_time)
    )
  end

  def start_date
    start_time.to_date
  end

  def end_date
    end_time.to_date
  end

  def starts_on_midnight?
    start_time.in_time_zone.strftime('%H:%M:%S') == '00:00:00'
  end

  def crosses_midnight?
    start_date.tomorrow == end_date
  end

  def booking_times_cannot_overlap
    return if Booking.overlapping(self).none?

    errors.add(:base, "There is an already booked time slot with overlapping time")
  end
end
