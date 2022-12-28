module API
  class BookingAvailabilitiesController < ::ApplicationController
    include ::HasTimezone

    def show
      availability = BookingAvailability.new(**params.permit(:start_date, :end_date).to_h.symbolize_keys)

      render json: { days: availability.days }
    end
  end
end
