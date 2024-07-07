class LineLoginApiController < ApplicationController
  require 'json'
  require 'typhoeus'
  require 'securerandom'
  require 'jwt'

  def login

    # CSRF対策用の固有な英数字の文字列
    # ログインセッションごとにWebアプリでランダムに生成する
    session[:state] = SecureRandom.urlsafe_base64

    # ユーザーに認証と認可を要求する
    # https://developers.line.biz/ja/docs/line-login/integrate-line-login/#making-an-authorization-request

    base_authorization_url = 'https://access.line.me/oauth2/v2.1/authorize'
    response_type = 'code'
    client_id = Rails.application.credentials.line_login[:client_id]
    redirect_uri = CGI.escape(line_login_api_callback_url)
    state = session[:state]
    scope = 'profile%20openid' #ユーザーに付与を依頼する権限

    authorization_url = "#{base_authorization_url}?response_type=#{response_type}&client_id=#{client_id}&redirect_uri=#{redirect_uri}&state=#{state}&scope=#{scope}"

    redirect_to authorization_url, allow_other_host: true
  end

  def callback
    # CSRF対策のトークンが一致するかを確認
    if params[:state] == session[:state]
      # 認証コードを使ってIDトークンとアクセストークンを取得
      id_token, access_token = get_line_user_id_and_access_token(params[:code])
      # IDトークンからLINEユーザーIDを抽出
      line_user_id = extract_user_id_from_id_token(id_token)
      # アクセストークンを使ってユーザーの表示名を取得
      name = get_line_user_name(access_token)
  
      # LINEユーザーIDでユーザーを検索し、存在しなければ新規作成
      user = User.find_or_initialize_by(line_user_id: line_user_id)
      # ユーザーの表示名を設定
      user.name = name
  
      # ユーザー情報を保存
      if user.save
        # ログインセッションを設定
        session[:user_id] = user.id
        # ログイン後のリダイレクト先へ移動
        redirect_to root_path, notice: 'ログインしました'
      else
        # 保存に失敗した場合はエラーメッセージを表示
        redirect_to login_path, alert: 'ログインに失敗しました'
      end
    else
      # CSRFトークンが不一致の場合はエラーメッセージを表示
      redirect_to root_path, alert: '不正なアクセスです'
    end
  end

  private

  def extract_user_id_from_id_token(id_token)
  # IDトークンはJWT形式なので、JWT.decodeメソッドを使ってデコードします。
  # LINEの公開鍵や秘密鍵を使って署名の検証をする必要はありますが、
  # ここでは簡略化のために検証を行わずにデコードしています。
  decoded_token = JWT.decode(id_token, nil, false)
  # デコードされたトークンは配列形式で返され、
  # 最初の要素にペイロードが含まれています。
  # 'sub' キーはLINEユーザーIDを表します。
    decoded_token[0]['sub']
  rescue JWT::DecodeError
  # 何らかの理由でデコードに失敗した場合、nilを返す。
    nil
  end


  def get_line_user_id(code)

    # ユーザーのIDトークンからプロフィール情報（ユーザーID）を取得する
    # https://developers.line.biz/ja/docs/line-login/verify-id-token/

    line_user_id_token = get_line_user_id_token(code)

    if line_user_id_token.present?

      url = 'https://api.line.me/oauth2/v2.1/verify'
      options = {
        body: {
          id_token: line_user_id_token,
          client_id: Rails.application.credentials.line_login[:client_id]
        }
      }

      response = Typhoeus::Request.post(url, options)

      if response.code == 200
        JSON.parse(response.body)['sub']
      else
        nil
      end
    
    else
      nil
    end

  end

  def get_line_user_name(access_token)
    return nil unless access_token
  
    url = 'https://api.line.me/v2/profile'
    headers = {
      'Authorization' => "Bearer #{access_token}"
    }
  
    response = Typhoeus::Request.get(url, headers: headers)
  
    if response.code == 200
      JSON.parse(response.body)['displayName']
    else
      nil
    end
  end

  def get_line_user_id_and_access_token(code)
    url = 'https://api.line.me/oauth2/v2.1/token'
    redirect_uri = line_login_api_callback_url
    options = {
      headers: {
        'Content-Type' => 'application/x-www-form-urlencoded'
      },
      body: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
        client_id: Rails.application.credentials.line_login[:client_id],
        client_secret: Rails.application.credentials.line_login[:client_secret]
      }
    }
  
    response = Typhoeus::Request.post(url, options)
  
    if response.code == 200
      body = JSON.parse(response.body)
      return body['id_token'], body['access_token'] # IDトークンとアクセストークンを返す
    else
      return nil, nil
    end
  end
end
