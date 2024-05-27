<body>
  <div class="wrapper">
    <ul class="tab">
      <li class="active"><a href="#answer_daily">日</a></li>
      <li><a href="#answer_weekly">週</a></li>
    </ul>
    <div id="answer_daily" class="answers area is-active">
      <canvas id="dailyChart" width="800" height="400"></canvas>
      <% @answers.each do |answer| %>
        <div class="answer">
          <h4><%= l answer.created_at %></h4>
          <ul>
            <li><%= "A1, #{t('enums.answer.first_answer_choice.' + (answer.first_answer_choice || 'default'))}" %></li>
            <li><%= "A2, #{answer.second_answer}" %></li>
            <% if answer.third_answer %>
              <li><%= "A3, #{answer.third_answer}" %></li>
            <% else %>
              <li>A3, ー</li>
            <% end %>
          </ul>
        </div>
      <% end %>
    </div>
    <div id="answer_weekly" class="answers area">
      <canvas id="weeklyChart" width="800" height="400"></canvas>
      <% @answers_weekly.each do |answer| %>
        <div class="answer">
          <h4><%= l answer.created_at %></h4>
          <ul>
            <li><%= "A1, #{t('enums.answer.first_answer_choice.' + (answer.first_answer_choice || 'default'))}" %></li>
            <li><%= "A2, #{answer.second_answer}" %></li>
            <% if answer.third_answer %>
              <li><%= "A3, #{answer.third_answer}" %></li>
            <% else %>
              <li>A3, ー</li>
            <% end %>
          </ul>
        </div>
      <% end %>
    </div>
  </div>

  <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
  <script src="https://coco-factory.jp/ugokuweb/wp-content/themes/ugokuweb/data/5-4-1/js/5-4-1.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <script>
    var dailyChart, weeklyChart;

    function initDailyChart() {
      if (dailyChart) {
        dailyChart.destroy();
      }

      var dailyData = <%= @daily_data_json.html_safe %>;
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
      dailyChart = new Chart(ctx, {
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

    function initWeeklyChart() {
      if (weeklyChart) {
        weeklyChart.destroy();
      }

      var weeklyData = <%= @weekly_data_json.html_safe %>;
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
      weeklyChart = new Chart(ctx, {
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

    document.addEventListener('turbo:load', function() {
      initDailyChart();
      initWeeklyChart();
    });

    // タブのクリックイベント
    $('.tab a').on('click', function() {
      var idName = $(this).attr('href');
      $('.area').hide(); // 全部隠す
      $(idName).show(); // クリックされたタブに対応するエリアを表示
      if (idName === '#answer_daily') {
        initDailyChart();
      } else if (idName === '#answer_weekly') {
        initWeeklyChart();
      }
      return false;
    });
  </script>
</body>
