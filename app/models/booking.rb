class Booking < ApplicationRecord
  def self.in_date_range(date_range)
    datetime_range = (date_range.first.beginning_of_day..date_range.last.end_of_day)

    where(start_time: datetime_range).or(where(end_time: datetime_range))
  end

  def starts_on_midnight?
    start_time.in_time_zone.strftime("%H:%M:%S") == "00:00:00"
  end

  def crosses_midnight?
    start_time.to_date.tomorrow == end_time.to_date
  end
end
