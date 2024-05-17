class AnswerIndexController < ApplicationController
  def index
    # 今日を含む過去10日間の範囲を指定
    start_date_for_day = 10.days.ago.beginning_of_day
    end_date = Time.zone.now.end_of_day
    # 1ヶ月
    start_date_for_week = 4.weeks.ago.beginning_of_day
  
    # その期間内のAnswerレコードを取得
    @answers = Answer.where(created_at: start_date_for_day..end_date).order('created_at DESC')
    @answers_weekly = Answer.where(created_at: start_date_for_week..end_date).order('created_at DESC')
  end
end
