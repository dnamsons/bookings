class BookingAvailability
  attr_reader :date_range

  def initialize(start_date:, end_date:)
    start_date = Date.parse(start_date)
    end_date = Date.parse(end_date)

    @date_range = start_date..end_date
  end

  def days
    date_range.map do |date|
      { date: date, available_times: date_availabilities(date) }
    end
  end

  private

  def date_availabilities(date)
    bookings_for_date = bookings_grouped_by_date.fetch(date, [])

    BookingDateAvailability.new(date, bookings_for_date).available_intervals
  end

  def bookings_grouped_by_date
    @bookings_grouped_by_date ||= bookings.each_with_object({}) do |booking, group|
      group[booking.start_time.to_date] ||= []
      group[booking.start_time.to_date] << booking

      if booking.start_time.to_date != booking.end_time.to_date
        group[booking.end_time.to_date] ||= []
        group[booking.end_time.to_date] << booking
      end
    end
  end

  def bookings
    Booking.in_date_range(date_range).order(:start_time)
  end
end
