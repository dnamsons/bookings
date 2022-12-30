require 'rails_helper'

RSpec.describe AvailabilityCalculator do
  describe '#available_intervals' do
    subject { described_class.new(start_date: Date.current, end_date: Date.tomorrow).available_intervals }

    let(:yesterday_at_midnight) { Date.yesterday.to_datetime }
    let(:today_at_midnight) { Date.current.to_datetime }
    let(:tomorrow_at_midnight) { Date.tomorrow.to_datetime }

    it 'returns whole day intervals' do
      expect(subject).to contain_exactly(
        { start: today_at_midnight, end: tomorrow_at_midnight },
        { start: tomorrow_at_midnight, end: tomorrow_at_midnight + 1.day }
      )
    end

    context 'with a booking' do
      before do
        create(
          :booking,
          start_time: booking_start_time,
          end_time: booking_end_time
        )
      end

      context 'in the middle of the day' do
        let(:booking_start_time) { today_at_midnight + 11.hours }
        let(:booking_end_time) { today_at_midnight + 13.hours }

        it 'returns two intervals for one day' do
          expect(subject).to include(
            { start: today_at_midnight, end: booking_start_time },
            { start: booking_end_time, end: tomorrow_at_midnight }
          )
        end
      end

      context 'starting yesterday and ending today' do
        let(:booking_start_time) { yesterday_at_midnight + 22.hours }
        let(:booking_end_time) { today_at_midnight + 2.hours }

        it 'returns an offset interval' do
          expect(subject).to include(
            { start: booking_end_time, end: tomorrow_at_midnight }
          )
        end
      end

      context 'starting today and ending tomorrow' do
        let(:booking_start_time) { today_at_midnight + 22.hours }
        let(:booking_end_time) { tomorrow_at_midnight + 2.hours }

        it 'returns intervals with booking slot time removed' do
          expect(subject).to contain_exactly(
            { start: today_at_midnight, end: booking_start_time },
            { start: booking_end_time, end: tomorrow_at_midnight + 1.day }
          )
        end
      end
    end
  end
end
