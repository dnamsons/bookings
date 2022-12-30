class AvailabilityChangeNotifier
  attr_reader :booking

  def initialize(booking)
    @booking = booking
  end

  def notify
    Time.use_zone(nil) do
      ActionCable.server.broadcast("booking_#{booking.start_time.strftime("%m-%Y")}", notification_message)
    end
  end

  private

  def notification_message
    { relevant_interval: interval_impacted_by_booking, available_intervals: available_intervals }
  end

  def interval_impacted_by_booking
    { start: booking.start_time, end: booking.end_time }
  end

  # Since the users we'll be broadcasting to could potentially have multiple time zones
  # We need to add a day to the start and end interval of data we're sending
  def available_intervals
    availabilities = AvailabilityCalculator.new(
      start_date: booking.start_date.yesterday,
      end_date: booking.end_date.tomorrow
    )

    availabilities.available_intervals
  end
end
