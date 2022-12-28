FactoryBot.define do
  factory :booking do
    start_time { DateTime.current.beginning_of_hour }
    end_time { DateTime.current.beginning_of_hour + 30.minutes }
  end
end
