class BookingReserver
  attr_reader :booking

  delegate :errors, to: :booking

  def initialize(booking)
    @booking = booking
  end

  def reserve
    successfully_saved = false
    with_lock_on_booking_dates do
      successfully_saved = booking.save
    end

    notify_users if successfully_saved

    successfully_saved
  end

  private

  # Lock the booking dates to ensure consistency - multiple users won't be able to create the same booking.
  # Alternatively, we could use locks, but with the current database structure it is not feasible.
  def with_lock_on_booking_dates
    Booking.with_advisory_lock(booking.start_date.to_s) do
      if booking.crosses_midnight?
        Booking.with_advisory_lock(booking.end_date.to_s) do
          yield
        end
      else
        yield
      end
    end
  end

  def notify_users
    AvailabilityChangeNotifier.new(booking).notify
  end
end
