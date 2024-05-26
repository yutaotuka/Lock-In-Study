// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('turbo:load', function() {
  console.log('turbo:load event fired');

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
    }, 300000); // 5分＝300000
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

  document.addEventListener('form-completed', function() {
    var questionBox = document.getElementById("question_box");
    if (questionBox) {
      questionBox.style.display = "none";
    }
  });

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

  $('.tab a').on('click', function() {
    var idName = $(this).attr('href'); //タブ内のリンク名を取得  
    GethashID (idName);//設定したタブの読み込みと
    return false;//aタグを無効にする
  });

  $(window).on('load', function () {
    $('.tab li:first-of-type').addClass("active"); //最初のliにactiveクラスを追加
    $('.area:first-of-type').addClass("is-active"); //最初の.areaにis-activeクラスを追加
    var hashName = location.hash; //リンク元の指定されたURLのハッシュタグを取得
    GethashID (hashName);//設定したタブの読み込み
  });

  // Function to initialize a chart
  function initChart(ctxId, data, labels, chartType = 'bar') {
    console.log(`Initializing chart: ${ctxId}`);
    var ctx = document.getElementById(ctxId);
    if (!ctx) {
      console.error(`Canvas context not found for: ${ctxId}`);
      return;
    }
    ctx = ctx.getContext('2d');
    new Chart(ctx, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
          label: '勉強時間',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 7200,
              callback: function(value) {
                var hours = Math.floor(value / 3600);
                var minutes = Math.floor((value % 3600) / 60);
                var seconds = value % 60;
                return `${hours}時間${minutes}分${seconds}秒`;
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                var totalSeconds = context.parsed.y;
                var hours = Math.floor(totalSeconds / 3600);
                var minutes = Math.floor((totalSeconds % 3600) / 60);
                var seconds = totalSeconds % 60;
                return context.dataset.label + ': ' + hours + '時間 ' + minutes + '分 ' + seconds + '秒';
              }
            }
          }
        }
      }
    });
  }

  // Initialize study time chart
  if (document.getElementById('studyTimeChart')) {
    try {
      var dailyData = JSON.parse(document.getElementById('daily-data').textContent);
      var dailyLabels = JSON.parse(document.getElementById('daily-labels').textContent);
      initChart('studyTimeChart', dailyData, dailyLabels);
    } catch (error) {
      console.error('Error initializing study time chart:', error);
    }
  }

  // Initialize weekly study time chart
  if (document.getElementById('weeklyStudyTimeChart')) {
    try {
      var weeklyData = JSON.parse(document.getElementById('weekly-data').textContent);
      var weeklyLabels = JSON.parse(document.getElementById('weekly-labels').textContent);
      initChart('weeklyStudyTimeChart', weeklyData, weeklyLabels);
    } catch (error) {
      console.error('Error initializing weekly study time chart:', error);
    }
  }

  // Initialize daily answer chart
  if (document.getElementById('dailyChart')) {
    try {
      var dailyData = JSON.parse(document.getElementById('daily-answer-data').textContent);
      var labels = Object.keys(dailyData);
      var studyData = [];
      var breakData = [];
      var otherData = [];

      labels.forEach(function(date) {
        studyData.push(dailyData[date].study);
        breakData.push(dailyData[date].break);
        otherData.push(dailyData[date].other);
      });

      initChart('dailyChart', {
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
      }, 'line');
    } catch (error) {
      console.error('Error initializing daily answer chart:', error);
    }
  }

  // Initialize weekly answer chart
  if (document.getElementById('weeklyChart')) {
    try {
      var weeklyData = JSON.parse(document.getElementById('weekly-answer-data').textContent);
      var labels = Object.keys(weeklyData);
      var studyData = [];
      var breakData = [];
      var otherData = [];

      labels.forEach(function(week) {
        studyData.push(weeklyData[week].study);
        breakData.push(weeklyData[week].break);
        otherData.push(weeklyData[week].other);
      });

      initChart('weeklyChart', {
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
      }, 'bar');
    } catch (error) {
      console.error('Error initializing weekly answer chart:', error);
    }
  }
});
