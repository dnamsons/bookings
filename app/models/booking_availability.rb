class BookingAvailability
  attr_reader :date_range

  def initialize(start_date:, end_date:)
    start_date = Date.parse(start_date)
    end_date = Date.parse(end_date)

    @date_range = start_date..end_date
  end

  def days
    date_range.map do |date|
      { date: date, available_times: [{ start: date.in_time_zone, end: date.in_time_zone.end_of_day }] }
    end
  end
end
