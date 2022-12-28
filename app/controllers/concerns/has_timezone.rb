module HasTimezone
  extend ActiveSupport::Concern

  included do
    before_action :set_timezone
  end

  def set_timezone
    return unless params[:timezone]

    Time.zone = params[:timezone]
  end
end
