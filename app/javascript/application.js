// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('turbo:load', function() {
  var startBtn = document.getElementById('start-btn');
  var stopBtn = document.getElementById('stop-btn');
  var imgBox = document.getElementById('drone-img');
  var studyRecordId;
  var intervalId;  // setIntervalのIDを保存する変数

  

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
        stopBtn.style.display = 'inline';
        imgBox.classList.add('animate-img_box');
      }
    });

    intervalId = setInterval(function() {
      var questionBox = document.getElementById("question_box");
      if (questionBox.style.display === "none") {
        questionBox.style.display = "block";
      }
    }, 30000); // 10秒ごとに処理を実行
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
        imgBox.classList.remove('animate-img_box');
        alert('おつかれさま！！'); 
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
