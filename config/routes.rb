Rails.application.routes.draw do
  root "booking#index"

  namespace :api do
    resources :availability, only: :index
    resource :bookings, only: :create
  end
end
