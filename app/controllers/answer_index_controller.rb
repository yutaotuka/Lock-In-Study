class AnswerIndexController < ApplicationController
  def index
    start_date_for_day = 10.days.ago.beginning_of_day
    end_date = Time.zone.now.end_of_day
    start_date_for_week = 6.weeks.ago.beginning_of_day

    # 10日間の回答を取得
    daily_answers = current_user.answers.where(created_at: start_date_for_day..end_date)
    # 7週間の回答を取得
    weekly_answers = current_user.answers.where(created_at: start_date_for_week..end_date).order(created_at: :desc)

    @answers = daily_answers.order(created_at: :desc)
    @answers_weekly = weekly_answers

    # 過去10日間の日付の配列を生成
    dates = (start_date_for_day.to_date..end_date.to_date).to_a

    # 初期値を持つ日付ごとのデータを生成
    @daily_data = dates.each_with_object({}) do |date, hash|
      hash[date] = { study: 0, break: 0, other: 0 }
    end

    # 過去10日間のデータを集計
    current_user.answers.select("DATE(created_at) as date, first_answer_choice, COUNT(*) as count")
          .where(created_at: start_date_for_day..end_date)
          .group("DATE(created_at), first_answer_choice")
          .each do |record|
            date = record.date
            choice = record.first_answer_choice
            count = record.count
            if @daily_data.key?(data)
              @daily_data[date][choice.to_sym] = count if choice.present?
            end
          end

    # 割合を計算
    @daily_data.transform_values! do |choices|
      total = choices.values.sum
      choices.transform_values { |count| total > 0 ? (count.to_f / total * 100).round(2) : 0 }
    end

    @daily_data_json = @daily_data.to_json

    # 過去7週間のデータを週ごとに集計
    @weekly_data = {}
    (0..6).each do |i|
      start_of_week = (start_date_for_week + i.weeks).beginning_of_week
      end_of_week = (start_of_week + 6.days).end_of_day

      week_key = start_of_week.strftime("%m/%d") + "~" + end_of_week.strftime("%m/%d")
      @weekly_data[week_key] = { study: 0, break: 0, other: 0 }

      current_user.answers.select("first_answer_choice, COUNT(*) as count")
            .where(created_at: start_of_week..end_date) # 今週のデータも含めるためにend_dateを使用
            .group("first_answer_choice")
            .each do |record|
              choice = record.first_answer_choice
              count = record.count
              @weekly_data[week_key][choice.to_sym] = count if choice.present?
            end

      # 割合を計算
      total = @weekly_data[week_key].values.sum
      @weekly_data[week_key].transform_values! { |count| total > 0 ? (count.to_f / total * 100).round(2) : 0 }
    end

    @weekly_data_json = @weekly_data.to_json
  end
end
