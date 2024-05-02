// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

document.addEventListener('DOMContentLoaded', function () {
  var ctx = document.getElementById('studyTimeChart').getContext('2d');
  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: <%= @daily_totals.keys.map { |date| date.strftime("%Y-%m-%d") }.to_json.html_safe %>,
      datasets: [{
        label: '勉強時間',
        data: <%= @daily_totals.values.to_json.html_safe %>,
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
            stepSize: 7200,  // 5 hours in seconds
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
});