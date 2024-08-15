class StudyRecordsController < ApplicationController
  def index
    # last_study_record = current_user.study_records.last
    # if last_study_record && last_study_record.duration_time
    #   total_seconds = last_study_record.duration_time
    #   hours = total_seconds / 3600
    #   minutes = (total_seconds / 60) % 60
    #   seconds = total_seconds % 60
  
    #   @duration_time = format("%02d時間 %02d分 %02d秒", hours, minutes, seconds)
    # else
    #   @duration_time = "データなし"
    # end
    
  end

  def start
    @study_record = StudyRecord.new(start_time: Time.current, user_id: current_user.id)
    if @study_record.save
      render json: { success: true, study_record_id: @study_record.id }
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
