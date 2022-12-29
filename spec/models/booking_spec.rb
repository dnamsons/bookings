require 'rails_helper'

RSpec.describe Booking do
  let(:midnight) { DateTime.current.beginning_of_day }

  describe '.in_date_range' do
    subject { described_class.in_date_range(beginning_of_month..end_of_month) }

    let(:beginning_of_month) { DateTime.current.beginning_of_month }
    let(:end_of_month) { DateTime.current.end_of_month }
    let(:next_month) { DateTime.current.next_month.beginning_of_month }

    let!(:booking_ending_at_the_beginning_of_month) do
      create :booking, start_time: DateTime.current.last_month.end_of_month, end_time: beginning_of_month.end_of_hour
    end
    let!(:booking_starting_at_the_end_of_month) do
      create :booking, start_time: end_of_month.beginning_of_hour, end_time: next_month
    end
    let!(:booking_starting_on_the_next_month) do
      create :booking, start_time: next_month, end_time: next_month + 1.hour
    end

    it 'finds bookings overlapping with the range' do
      expect(subject).to contain_exactly(
        an_object_having_attributes(id: booking_ending_at_the_beginning_of_month.id),
        an_object_having_attributes(id: booking_starting_at_the_end_of_month.id)
      )
    end
  end

  describe 'booking_times_cannot_overlap validation' do
    subject { booking.valid? }

    let!(:booking_from_midnight) { create :booking, start_time: midnight, end_time: midnight + 1.hour }

    let(:booking) { build :booking, start_time: midnight + 3.hours, end_time: midnight + 4.hours }

    it { is_expected.to eq(true) }

    context 'with the booking starting yesterday and ending today' do
      let(:booking) { build :booking, start_time: midnight - 1.hour, end_time: midnight + 30.minutes }

      it { is_expected.to eq(false) }
    end

    context 'with the booking starting on the midnight' do
      let(:booking) { build :booking, start_time: midnight, end_time: midnight + 30.minutes }

      it { is_expected.to eq(true) }
    end
  end

  describe '#starts_on_midnight?' do
    subject { booking.starts_on_midnight? }

    let(:booking) do
      build :booking, start_time: midnight + 1.hour, end_time: midnight + 2.hours
    end

    it { is_expected.to eq(false) }

    context 'with a booking starting on midnight' do
      let(:booking) { build :booking, start_time: midnight, end_time: midnight + 2.hours }

      it { is_expected.to eq(true) }
    end
  end

  describe '#crosses_midnight?' do
    subject { booking.crosses_midnight? }

    let(:booking) { build :booking, start_time: midnight + 1.hour, end_time: midnight + 2.hours }

    it { is_expected.to eq(false) }

    context 'with a booking starting yesterday and ending today' do
      let(:booking) { build :booking, start_time: midnight - 1.hour, end_time: midnight + 2.hours }

      it { is_expected.to eq(true) }
    end
  end
end
