class LineBotService
  def self.send_message(user_id, message)
    message = {
      type: 'text',
      text: "質問への回答時間です"
    }

    # LINE_CLIENTを使用してメッセージの送信
    response = LINE_CLIENT.push_message(user_id, message)
    response
  end
end