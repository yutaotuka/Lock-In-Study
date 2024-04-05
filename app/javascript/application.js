// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('turbo:load', function() {
  var startBtn = document.getElementById('start-btn');
  var stopBtn = document.getElementById('stop-btn');
  var imgBox = document.getElementById('drone-img');
  var studyRecordId;
  var questionBox = document.getElementById("question_box");

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
    
    setTimeout(function() {
      if (questionBox) {
        questionBox.style.display = "block";
      }
    }, 10000); // 10分 = 600000ミリ秒
  });

// フォームの非表示ボタン読み込み
  setupHideButton(); 

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
  });
});

// フォームの非表示
function setupHideButton() {
  document.addEventListener('click', function(event) {
    if (event.target.matches('#hide-form-btn')) {
      var questionBox = document.getElementById('question_box');
      if (questionBox) {
        questionBox.style.display = 'none';
      }
    }
  });
}
