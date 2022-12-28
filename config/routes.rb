Rails.application.routes.draw do
  root "booking#index"

  namespace :api do
    resource :booking_availabilities, only: :show
  end
end
