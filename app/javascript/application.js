import "@hotwired/turbo-rails";
import "controllers";

document.addEventListener('turbo:load', function() {
  var startBtn = document.getElementById('start-btn');
  var stopBtn = document.getElementById('stop-btn');
  var studyRecord = document.getElementById('study_record');
  var imgBox = document.getElementById('drone-img');
  var studyRecordId;
  var intervalId;  // setIntervalのIDを保存する変数
  var audio = new Audio('/jingle.mp3');
  var answerForm = document.getElementById('question_area'); // フォーム要素を取得

  if (startBtn && stopBtn && studyRecord && imgBox) {
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
        if (questionBox && questionBox.style.display === "none") {
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
  } else {
    if (!startBtn) console.warn('Start button not found');
    if (!stopBtn) console.warn('Stop button not found');
    if (!studyRecord) console.warn('Study record element not found');
    if (!imgBox) console.warn('Image box not found');
  }

  // Add form submission listener
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
  } else {
    console.warn('Answer form not found');
  }

  // Form completed event listener
  document.addEventListener('form-completed', function() {
    var questionBox = document.getElementById("question_box");
    if (questionBox) {
      questionBox.style.display = "none";
    } else {
      console.warn('Question box not found');
    }
  });

  // Tab handling function
  function GethashID(hashIDName) {
    if (hashIDName) {
      //タブ設定
      $('.tab li').find('a').each(function() { //タブ内のaタグ全てを取得
        var idName = $(this).attr('href'); //タブ内のaタグのリンク名（例）#lunchの値を取得 
        if (idName == hashIDName) { //リンク元の指定されたURLのハッシュタグ（例）http://example.com/#lunch←この#の値とタブ内のリンク名（例）#lunchが同じかをチェック
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

  // Handle tab clicks
  $('.tab a').on('click', function() {
    var idName = $(this).attr('href'); //タブ内のリンク名を取得  
    GethashID(idName); //設定したタブの読み込みと
    return false; //aタグを無効にする
  });

  // Initialize tabs on window load
  $(window).on('load', function() {
    $('.tab li:first-of-type').addClass("active"); //最初のliにactiveクラスを追加
    $('.area:first-of-type').addClass("is-active"); //最初の.areaにis-activeクラスを追加
    var hashName = location.hash; //リンク元の指定されたURLのハッシュタグを取得
    GethashID(hashName); //設定したタブの読み込み
  });

  // Function to initialize a chart
  function initChart(ctxId, data, labels, chartType = 'bar') {
    console.log(`Initializing chart: ${ctxId}`);
    var ctx = document.getElementById(ctxId).getContext('2d');
    return new Chart(ctx, {
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

  function loadChartScripts(callback) {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = callback;
    document.head.appendChild(script);
  }

  loadChartScripts(function() {
    var dailyData = JSON.parse(document.getElementById('daily-data').textContent);
    var dailyLabels = JSON.parse(document.getElementById('daily-labels').textContent);
    initChart('studyTimeChart', dailyData, dailyLabels);

    var weeklyData = JSON.parse(document.getElementById('weekly-data').textContent);
    var weeklyLabels = JSON.parse(document.getElementById('weekly-labels').textContent);
    initChart('weeklyStudyTimeChart', weeklyData, weeklyLabels);
  });

  // タブのクリックイベント
  $('.tab a').on('click', function() {
    var idName = $(this).attr('href');
    $('.area').hide(); // 全部隠す
    $(idName).show(); // クリックされたタブに対応するエリアを表示
    if (idName === '#weekly') {
      initWeeklyChart();
    } else if (idName === '#daily') {
      initDailyChart();
    }
    return false;
  });

  // Chart.jsを使ったグラフ描画
  function initDailyChart() {
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
      type: 'line', // グラフの種類（例： 'line', 'bar' など）
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

  function initWeeklyChart() {
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
      type: 'bar', // グラフの種類（例： 'line', 'bar' など）
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

  document.addEventListener('DOMContentLoaded', function() {
    initDailyChart(); // 初期表示でdailyChartを初期化
  });
});
