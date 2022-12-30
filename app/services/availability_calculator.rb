class AvailabilityCalculator
  attr_reader :date_range, :booked_intervals_grouped_by_date

  def initialize(start_date:, end_date:)
    @date_range = start_date..end_date
    @booked_intervals_grouped_by_date = AvailabilityCalculation::BookedIntervalGrouper.new(date_range).call
  end

  def days
    date_range.flat_map { |date| available_intervals_in(date) }
  end

  private

  def available_intervals_in(date)
    bookings_for_date = booked_intervals_grouped_by_date.fetch(date, [])

    AvailabilityCalculation::DateAvailabilityCalculator.new(date, bookings_for_date).available_intervals
  end
end
