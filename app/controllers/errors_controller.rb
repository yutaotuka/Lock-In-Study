class ErrorsController < ApplicationController
  layout 'error'

  def show
    status_code = params[:status] || 500
    render template: "errors/#{status_code}", status: status_code, layout: 'error'
  end

  def bad_request
    render(status: 400)
  end

  def unauthorized
    render(status: 401)
  end

  def forbidden
    render(status: 403)
  end

  def not_found
    render(status: 404)
  end

  def conflict
    render(status: 409)
  end

  def unprocessable_entity
    render(status: 422)
  end

  def too_many_requests
    render(status: 429)
  end

  def internal_server_error
    render(status: 500)
  end

  def service_unavailable
    render(status: 503)
  end
end
