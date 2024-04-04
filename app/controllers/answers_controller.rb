# app/controllers/answers_controller.rb
class AnswersController < ApplicationController
  def new
    @answer = initialize_answer_from_session
  end

  def create
    session[:answers] ||= {}
    session[:answers].merge!(answer_params.to_h)

    @answer = initialize_answer_from_session

    if @answer.valid?
      if final_question_answered?(@answer)
        @answer.save
        session.delete(:answers) # セッションをクリア
        render_final_message
      else
        @next_question = determine_next_question(@answer)
        render_next_question_or_final_message
      end
    else
      # バリデーションエラー時の処理
      respond_to do |format|
        format.turbo_stream { render turbo_stream: turbo_stream.replace("question_area", partial: "answers/form", locals: { answer: @answer }) }
        format.html { render :new }
      end
    end
  end

  private

  def answer_params
    params.require(:answer).permit(:first_answer_choice, :second_answer, :third_answer)
  end

  def initialize_answer_from_session
    current_user.answers.build(session[:answers] || {})
  end

  def determine_next_question(answer)
    case answer.first_answer_choice
    when "study"
      if answer.second_answer.present?
        "それをする事で何を得ますか？"
      else
        "何の勉強をしていますか？"
      end
    when "break"
      "あと何分休憩しますか？"
    when "other"
      if answer.second_answer.present?
        "それをしたら何を失いますか？"
      else
        "何をしていますか？"
      end
    else
      "質問はこれで終了です。"
    end
  end

  def render_next_question_or_final_message
    if @next_question == "質問はこれで終了です。"
      # render_final_message
      render turbo_stream: turbo_stream.replace("question_area", partial: "answers/final_message")
    else
      respond_to do |format|
        format.turbo_stream { render turbo_stream: turbo_stream.update("question_area", partial: "answers/next_question", locals: { next_question: @next_question }) }
      end
    end
  end

  def final_question_answered?(answer)
    # ここに最後の質問に対する回答が完了したかどうかを判定するロジックを記述
    # 例: answer.third_answer.present?
    case answer.first_answer_choice
    when 'study'
      answer.third_answer.present? # 「勉強」が選ばれた場合、third_answerが最後の質問になるかもしれない
    when 'break'
      answer.second_answer.present? # 「休憩」が選ばれた場合、second_answerが最後の質問になるかもしれない
    when 'other'
      answer.third_answer.present? # 「その他」が選ばれた場合、third_answerが最後の質問になるかもしれない
    else
      false # それ以外の場合は、まだ最後の質問に到達していないと見なす
    end
  end

  def render_final_message
        
    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.update("question_area", partial: "answers/final_message") }
      if session[:study_session_active]
        # 勉強セッションがアクティブな場合、勉強時間測定画面にリダイレクト
        format.html { redirect_to study_record_path(study_record_id), notice: '質問に全て答えました。勉強に戻りましょう。' }
      else
        # 勉強セッションが非アクティブな場合、別の適切なページ（例: ホーム）にリダイレクト
        format.html { redirect_to root_path, notice: 'セッションが非アクティブです。' }
      end
    end
  end
end
