module AvailabilityCalculation
  class BookedIntervalGrouper
    attr_reader :booked_intervals, :group

    def initialize(date_range)
      @booked_intervals = Booking.in_date_range(date_range).order(:start_time)
      @group = {}
    end

    def call
      booked_intervals.each do |booking|
        add_booking_to_dates(booking)
      end

      group
    end

    private

    def add_booking_to_dates(booking)
      start_date = booking.start_time.to_date
      group[start_date] ||= []
      group[start_date] << booking

      return unless booking.crosses_midnight?

      end_date = booking.end_time.to_date
      group[end_date] ||= []
      group[end_date] << booking
    end
  end
end
