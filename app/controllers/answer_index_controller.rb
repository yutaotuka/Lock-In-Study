class AnswerIndexController < ApplicationController
  def index
    start_date_for_day = 10.days.ago.beginning_of_day
    end_date = Time.zone.now.end_of_day
    start_date_for_week = 4.weeks.ago.beginning_of_day

    # 10日間の回答を取得
    daily_answers = Answer.where(created_at: start_date_for_day..end_date)
    # 4週間の回答を取得
    weekly_answers = Answer.where(created_at: start_date_for_week..end_date).order(created_at: :desc)

    @answers = daily_answers.order(created_at: :desc)
    @answers_weekly = weekly_answers

    # 過去10日間の日付の配列を生成
    dates = (start_date_for_day.to_date..end_date.to_date).to_a

    # 初期値を持つ日付ごとのデータを生成
    @daily_data = dates.each_with_object({}) do |date, hash|
      hash[date] = { study: 0, break: 0, other: 0 }
    end

    # 過去10日間のデータを集計
    Answer.select("DATE(created_at) as date, first_answer_choice, COUNT(*) as count")
          .where(created_at: start_date_for_day..end_date)
          .group("DATE(created_at), first_answer_choice")
          .each do |record|
            date = record.date
            choice = record.first_answer_choice
            count = record.count
            @daily_data[date][choice.to_sym] = count if choice.present?
          end

    # 割合を計算
    @daily_data.transform_values! do |choices|
      total = choices.values.sum
      choices.transform_values { |count| total > 0 ? (count.to_f / total * 100).round(2) : 0 }
    end

    @daily_data_json = @daily_data.to_json
  end
end
