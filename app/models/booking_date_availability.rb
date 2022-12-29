class BookingDateAvailability
  attr_accessor :previous_end_time
  attr_reader :date, :bookings, :intervals

  def initialize(date, bookings)
    @date = date
    @bookings = bookings
    @intervals = []
    @previous_end_time = nil
  end

  def available_intervals
    bookings.each_with_index do |booking, index|
      handle_booking_slot(booking, index)

      @previous_end_time = booking.end_time
    end

    add_date_end_interval

    intervals
  end

  private

  def handle_booking_slot(booking, index)
    if index.zero? && !crosses_beginning_of_date?(booking)
      add_date_start_interval(booking)
    elsif booking.start_time == previous_end_time
      update_latest_interval(booking)
    elsif previous_end_time.present?
      add_enclosed_interval(booking)
    end
  end

  def crosses_beginning_of_date?(booking)
    booking.starts_on_midnight? || (booking.crosses_midnight? && booking.start_time.to_date != date)
  end

  def add_date_start_interval(booking)
    @intervals << { start: date.in_time_zone, end: booking.start_time }
  end

  def update_latest_interval(booking)
    return if @intervals.blank?

    @intervals.last[:end] = booking.start_time
  end

  def add_enclosed_interval(booking)
    @intervals << { start: previous_end_time, end: booking.start_time }
  end

  def add_date_end_interval
    @previous_end_time ||= date.in_time_zone

    return if @previous_end_time.to_date != date

    @intervals << { start: previous_end_time, end: date.in_time_zone.end_of_day }
  end
end
