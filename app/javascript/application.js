// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('turbo:load', function() {
  var startBtn = document.getElementById('start-btn');
  var stopBtn = document.getElementById('stop-btn');
  var studyRecord = document.getElementById('study_record');
  var imgBox = document.getElementById('drone-img');
  var studyRecordId;
  var intervalId;  // setIntervalのIDを保存する変数
  var audio = new Audio('/jingle.mp3');
  var answerForm = document.getElementById('question_area'); // フォーム要素を取得


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
      }
    }, 300000); // 1分＝60000
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

// study_time_index
//任意のタブにURLからリンクするための設定
function GethashID (hashIDName){
  if(hashIDName){
    //タブ設定
    $('.tab li').find('a').each(function() { //タブ内のaタグ全てを取得
      var idName = $(this).attr('href'); //タブ内のaタグのリンク名（例）#lunchの値を取得 
      if(idName == hashIDName){ //リンク元の指定されたURLのハッシュタグ（例）http://example.com/#lunch←この#の値とタブ内のリンク名（例）#lunchが同じかをチェック
        var parentElm = $(this).parent(); //タブ内のaタグの親要素（li）を取得
        $('.tab li').removeClass("active"); //タブ内のliについているactiveクラスを取り除き
        $(parentElm).addClass("active"); //リンク元の指定されたURLのハッシュタグとタブ内のリンク名が同じであれば、liにactiveクラスを追加
        //表示させるエリア設定
        $(".area").removeClass("is-active"); //もともとついているis-activeクラスを取り除き
        $(hashIDName).addClass("is-active"); //表示させたいエリアのタブリンク名をクリックしたら、表示エリアにis-activeクラスを追加 
      }
    });
  }
}

//タブをクリックしたら
$('.tab a').on('click', function() {
  var idName = $(this).attr('href'); //タブ内のリンク名を取得  
  GethashID (idName);//設定したタブの読み込みと
  return false;//aタグを無効にする
});


// 上記の動きをページが読み込まれたらすぐに動かす
$(window).on('load', function () {
    $('.tab li:first-of-type').addClass("active"); //最初のliにactiveクラスを追加
    $('.area:first-of-type').addClass("is-active"); //最初の.areaにis-activeクラスを追加
  var hashName = location.hash; //リンク元の指定されたURLのハッシュタグを取得
  GethashID (hashName);//設定したタブの読み込み
});

// common.js

import "@hotwired/turbo-rails";
import "controllers";

document.addEventListener('turbo:load', function() {
  // Study Time Chart Initialization
  function initStudyTimeChart() {
    if (document.getElementById('studyTimeChart')) {
      var dailyData = JSON.parse('<%= raw @daily_totals.values.to_json.html_safe %>');
      var dailyLabels = JSON.parse('<%= @daily_totals.keys.map { |date| date.strftime("%Y-%m-%d") }.to_json.html_safe %>');
      initChart('studyTimeChart', dailyData, dailyLabels);
    }
  }

  // Weekly Study Time Chart Initialization
  function initWeeklyStudyTimeChart() {
    if (document.getElementById('weeklyStudyTimeChart')) {
      var weeklyData = JSON.parse('<%= raw @weekly_totals.values.to_json.html_safe %>');
      var weeklyLabels = JSON.parse('<%= @weekly_totals.keys.map { |date| date.strftime("%Y-%m-%d") }.to_json.html_safe %>');
      initChart('weeklyStudyTimeChart', weeklyData, weeklyLabels);
    }
  }

  // Answer Index Chart Initialization
  function initDailyChart() {
    if (document.getElementById('dailyChart')) {
      var dailyData = JSON.parse('<%= raw @daily_data_json %>');
      var labels = Object.keys(dailyData);
      var studyData = [];
      var breakData = [];
      var otherData = [];

      labels.forEach(function(date) {
        studyData.push(dailyData[date].study);
        breakData.push(dailyData[date].break);
        otherData.push(dailyData[date].other);
      });

      var ctx = document.getElementById('dailyChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: '勉強',
              data: studyData,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: '休憩',
              data: breakData,
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1
            },
            {
              label: 'その他',
              data: otherData,
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  function initWeeklyChart() {
    if (document.getElementById('weeklyChart')) {
      var weeklyData = JSON.parse('<%= raw @weekly_data_json %>');
      var labels = Object.keys(weeklyData);
      var studyData = [];
      var breakData = [];
      var otherData = [];

      labels.forEach(function(week) {
        studyData.push(weeklyData[week].study);
        breakData.push(weeklyData[week].break);
        otherData.push(weeklyData[week].other);
      });

      var ctx = document.getElementById('weeklyChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: '勉強',
              data: studyData,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
            {
              label: '休憩',
              data: breakData,
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1
            },
            {
              label: 'その他',
              data: otherData,
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  // Initialize all charts
  initStudyTimeChart();
  initWeeklyStudyTimeChart();
  initDailyChart();
  initWeeklyChart();
});
