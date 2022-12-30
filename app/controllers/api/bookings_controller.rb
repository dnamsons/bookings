module API
  class BookingsController < ApplicationController
    include HasTimezone

    def create
      booking = Booking.new(booking_params)
      reserver = BookingReserver.new(booking)

      if reserver.reserve
        render json: { id: booking.id }
      else
        render json: { errors: reserver.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def booking_params
      params.require(:booking).permit(:start_time, :end_time)
    end
  end
end
