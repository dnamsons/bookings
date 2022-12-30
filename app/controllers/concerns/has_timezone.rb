module HasTimezone
  extend ActiveSupport::Concern

  included do
    around_action :with_timezone
  end

  def with_timezone(&block)
    return block.call unless params[:timezone]

    Time.use_zone(params[:timezone], &block)
  end
end
