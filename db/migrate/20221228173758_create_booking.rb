class CreateBooking < ActiveRecord::Migration[7.0]
  def change
    enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')

    create_table :bookings, id: :uuid do |t|
      t.datetime :start_time
      t.datetime :end_time
      t.index [:start_time, :end_time]
    end
  end
end
