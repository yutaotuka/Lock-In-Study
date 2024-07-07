// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('turbo:load', function() {
  var startBtn = document.getElementById('start-btn');
  var stopBtn = document.getElementById('stop-btn');
  var header = document.getElementById('header');
  var footer = document.getElementById('footer');
  var studyRecord = document.getElementById('study_record');
  var imgBox = document.getElementById('drone-img');
  var studyRecordId;
  var intervalId;  // setIntervalのIDを保存する変数
  var audio = new Audio('/jingle.mp3');
  var answerForm = document.getElementById('question_area'); // フォーム要素を取得
  var userId = document.querySelector('input[name="user_id"]').value;


      if (answerForm) {
        answerForm.addEventListener('submit', function(event) {
          var radioGroups = {}; // ラジオボタンのグループを保存するオブジェクト
          var isValid = true;
    
          // ラジオボタンのチェック状態を確認
          answerForm.querySelectorAll('input[type=radio]').forEach(function(radio) {
            // グループ名ごとにチェックされた状態を格納
            if (!radioGroups[radio.name]) {
              radioGroups[radio.name] = false; // 初期状態は未チェック
            }
            if (radio.checked) {
              radioGroups[radio.name] = true; // いずれかがチェックされていればtrue
            }
          });
    
          // すべてのラジオボタングループがチェックされているか確認
          for (var groupName in radioGroups) {
            if (!radioGroups[groupName]) {
              isValid = false; // 未チェックのグループがあれば無効
              break;
            }
          }
    
          // バリデーションが失敗した場合はフォームの送信を阻止
          if (!isValid) {
            event.preventDefault();
            alert('質問に回答してください。');
          }
        });
      }

  

  startBtn.addEventListener('click', function() {
    console.log("Start button clicked!"); 
    fetch('/study_records/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        studyRecordId = data.study_record_id;
        startBtn.style.display = 'none';
        studyRecord.style.display = 'none';
        header.style.display = 'none';
        footer.style.display = 'none';
        stopBtn.style.display = 'inline';
        imgBox.classList.add('animate-img_box');
      }
    });

    intervalId = setInterval(function() {
      var questionBox = document.getElementById("question_box");
      if (questionBox.style.display === "none") {
        questionBox.style.display = "block";
        // 音を再生
        audio.play().catch(function(error) {
          console.error('Audio playback failed:', error);
        });
        // LINEメッセージを送信
        fetch('/send_custom_message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
          },
          body: JSON.stringify({ user_id: userId, message: '質問が表示されました' })
        }).then(response => response.json())
          .then(data => {
            if (data.status === 'success') {
              console.log('LINEメッセージが送信されました');
            } else {
              console.error('LINEメッセージの送信に失敗しました:', data.message);
            }
          });
      }
    }, 1800000); // 1分＝60000
  });

  stopBtn.addEventListener('click', function() {
    fetch(`/study_records/${studyRecordId}/stop`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]').content
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        stopBtn.style.display = 'none';
        startBtn.style.display = 'inline';
        studyRecord.style.display = 'inline';
        imgBox.classList.remove('animate-img_box');
        alert('おつかれさま！！'); 
        // ページをリロード
        window.location.reload();
      } else {
        alert('時間測定に失敗しました。');
      }
    });
    clearInterval(intervalId);
  });
});

// フォームの回答が終わったら非表示にする
// _final_messageで着火させてる
document.addEventListener('form-completed', function() {
  var questionBox = document.getElementById("question_box");
  if (questionBox) {
    questionBox.style.display = "none";
  }
});

