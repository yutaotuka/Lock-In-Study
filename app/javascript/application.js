// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('turbo:load', function() {
  let startBtn = document.getElementById('start-btn');
  let stopBtn = document.getElementById('stop-btn');
  let header = document.getElementById('header');
  let footer = document.getElementById('footer');
  let studyRecord = document.getElementById('study_record');
  let imgBox = document.getElementById('drone-img');
  let studyRecordId;
  let intervalId;
  let audio = new Audio('/jingle.mp3');
  let answerForm = document.getElementById('question_area'); // フォーム要素を取得
  let userId = document.querySelector('input[name="user_id"]').value;

  if (answerForm) {
    answerForm.addEventListener('submit', function(event) {
      let radioGroups = {};
      let isValid = true;

      answerForm.querySelectorAll('input[type=radio]').forEach(function(radio) {
        if (!radioGroups[radio.name]) {
          radioGroups[radio.name] = false;
        }
        if (radio.checked) {
          radioGroups[radio.name] = true;
        }
      });

      for (let groupName in radioGroups) {
        if (!radioGroups[groupName]) {
          isValid = false;
          break;
        }
      }

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
      let questionBox = document.getElementById("question_box");
      if (questionBox.style.display === "none") {
        questionBox.style.display = "block";
        audio.play().catch(function(error) {
          console.error('Audio playback failed:', error);
        });
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
    }, 1200000); // 1分＝60000
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
        alert('おつかれさま！！'); 
        window.location.reload();
      } else {
        alert('時間測定に失敗しました。');
      }
    });
    clearInterval(intervalId);
  });
});

// フォームの回答が終わったら非表示にする
document.addEventListener('form-completed', function() {
  let questionBox = document.getElementById("question_box");
  if (questionBox) {
    questionBox.style.display = "none";
  }
});
