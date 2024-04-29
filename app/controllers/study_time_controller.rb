class StudyTimeController < ApplicationController
  def index
    totals = StudyRecord.group_by_day(:created_at).sum(:duration_time)
    @daily_totals = totals.to_a.last(10).to_h
  end
end
