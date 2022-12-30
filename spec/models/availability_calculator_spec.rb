require 'rails_helper'

RSpec.describe AvailabilityCalculator do
  describe '#days' do
    subject { described_class.new(start_date: Date.current, end_date: Date.tomorrow).days }

    it 'returns whole day intervals' do
      expect(subject).to contain_exactly(
        { start: Date.current.to_datetime, end: Date.current.end_of_day },
        { start: Date.tomorrow.to_datetime, end: Date.tomorrow.end_of_day }
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
        let(:booking_start_time) { Date.current.to_datetime.change(hour: 11) }
        let(:booking_end_time) { Date.current.to_datetime.change(hour: 13) }

        it 'returns two intervals for one day' do
          expect(subject).to include(
            { start: Date.current.beginning_of_day, end: booking_start_time },
            { start: booking_end_time, end: Date.current.end_of_day }
          )
        end
      end

      context 'starting yesterday and ending today' do
        let(:booking_start_time) { Date.yesterday.to_datetime.change(hour: 22) }
        let(:booking_end_time) { Date.current.to_datetime.change(hour: 2) }

        it 'returns an offset interval' do
          expect(subject).to include(
            { start: booking_end_time, end: Date.current.end_of_day }
          )
        end
      end

      context 'starting today and ending tomorrow' do
        let(:booking_start_time) { Date.current.to_datetime.change(hour: 22) }
        let(:booking_end_time) { Date.tomorrow.to_datetime.change(hour: 2) }

        it 'returns intervals with booking slot time removed' do
          expect(subject).to contain_exactly(
            { start: Date.current.beginning_of_day, end: booking_start_time },
            { start: booking_end_time, end: Date.tomorrow.end_of_day }
          )
        end
      end
    end
  end
end
