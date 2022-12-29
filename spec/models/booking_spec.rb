require 'rails_helper'

RSpec.describe Booking do
  describe '.in_date_range' do
    subject { described_class.in_date_range(Date.current.beginning_of_month..Date.current.end_of_month) }

    let!(:booking_ending_at_the_beginning_of_month) do
      create :booking, start_time: DateTime.current.last_month.end_of_month, end_time: DateTime.current.beginning_of_month.end_of_hour
    end
    let!(:booking_starting_at_the_end_of_month) do
      create :booking, start_time: DateTime.current.end_of_month.beginning_of_hour, end_time: DateTime.current.next_month.beginning_of_month
    end
    let!(:booking_starting_on_the_next_month) do
      create :booking, start_time: DateTime.current.next_month, end_time: DateTime.current.next_month.end_of_hour
    end

    it 'finds bookings overlapping with the range' do
      expect(subject).to contain_exactly(
        an_object_having_attributes(id: booking_ending_at_the_beginning_of_month.id),
        an_object_having_attributes(id: booking_starting_at_the_end_of_month.id)
      )
    end
  end

  describe '#starts_on_midnight?' do
    subject { booking.starts_on_midnight? }

    let(:booking) do
      build :booking, start_time: DateTime.current.change(hour: 1), end_time: DateTime.current.change(hour: 2)
    end

    it { is_expected.to eq(false) }

    context 'with a booking starting on midnight' do
      let(:booking) { build :booking, start_time: Date.current.to_datetime, end_time: DateTime.current.change(hour: 2) }

      it { is_expected.to eq(true) }
    end
  end

  describe '#crosses_midnight?' do
    subject { booking.crosses_midnight? }

    let(:booking) { build :booking, start_time: DateTime.current.change(hour: 1), end_time: DateTime.current.change(hour: 2)}

    it { is_expected.to eq(false) }

    context 'with a booking starting yesterday and ending today' do
      let(:booking) { build :booking, start_time: DateTime.yesterday.end_of_day, end_time: DateTime.current.change(hour: 2)}

      it { is_expected.to eq(true) }
    end
  end
end
