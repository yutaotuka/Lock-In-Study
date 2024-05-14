class AnswerIndexController < ApplicationController
  def index
    @answers = Answer.all
  end
end
