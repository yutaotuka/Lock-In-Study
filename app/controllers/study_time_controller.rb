class StudyTimeController < ApplicationController
  def index
    totals = StudyRecord.group_by_day(:created_at).sum(:duration_time)
    @daily_totals = totals.to_a.last(10).to_h

    # 週ごとの合計、最新の週のみ
    weekly_totals = StudyRecord.group_by_week(:created_at, week_start: :monday).sum(:duration_time)
    @weekly_totals = weekly_totals.to_a.last(7).to_h
  end
end
