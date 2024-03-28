class StudyRecordsController < ApplicationController
  def start
    @study_record = StudyRecord.new(start_time: Time.current, user_id: current_user_id)
    if @study_record.save
      render json: { success: true, study_record_id: @study_record_id }
    else
      render json: { success: false }
    end
  end

  def stop
    @study_record = StudyRecord.find(params[:id])
    end_time = Time.current
    duration_time = (end_time - @study_record.start_time).to_i
    if @study_record.update(end_time: end_time, duration_time: duration_time)
      render json: { success: true }
    else
      render json: { success: false }
    end
  end
end
