class BookingAvailabilitiesChannel < ApplicationCable::Channel
  def subscribed
    stream_from "booking_#{params[:month]}"
  end
end
