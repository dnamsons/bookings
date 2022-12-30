module API
  class AvailabilityController < ::ApplicationController
    include ::HasTimezone

    def index
      start_date = Date.parse(params[:start_date])
      end_date = Date.parse(params[:end_date])

      availabilities = AvailabilityCalculator.new(start_date: start_date, end_date: end_date).days

      render json: availabilities
    end
  end
end
