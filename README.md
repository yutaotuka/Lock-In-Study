# Lock-In-Study
## サービスURL
https://www.lockinstudy.com
## サービス概要
学習中にアプリから問われる質問に回答する事で集中力を持続するサービスです。
## サービスを作りたい理由
　プログラミングスクールへ通い始めた当時、同期の生徒から学習中に躓くと無意識の内に部屋の掃除をしてしまい学習が進まないと聞き私自身も同じ様な事に課題を感じていました。
　現職の学習塾では生徒へ「今何をしているのか」と定期的に声掛けをする事で集中力の確保をしていた為、同じ様に声掛けをしてくれるサービスとして「Lock In Study」というWebアプリを作成しました。
## ユーザー層について
・勉強をしていてもついつい他のことをしてしまう人
・学習の記録を取りたい人
## サービスの利用イメージ
　勉強時間の測定中に通知される質問を通して、今自分が集中しているかを客観的に認識出来る様になります。

　ユーザーは質問に回答することで現在自分がやるべき事を行っているのかの把握ができます。このことによって集中力の持続・学習の質の向上が見込めます。

　ユーザー登録することで過去の自分の勉強時間、傾向を振り返ることができます。
## サービスの差別化ポイント・推しポイント
　勉強時間を計測して達成感を感じさせるサービスは多く存在しているためその機能での差別化は難しいと考えています。  
　このアプリに関しては測定中に行っている学習内容にフォーカスしているためその部分が他サービスとの差別化になると考えています。

## 機能候補(MVPリリース時)
 * 勉強時間の測定機能
 * 勉強時間測定中の質問通知機能
 * LINEでの会員登録機能
 ## 機能候補(本リリース時)
 * LINEでの通知機能
 * 勉強時間の記録一覧
 * 質問への回答一覧

<!-- ## 機能の実装方針予定
 *  -->
 
## 使用予定の技術スタック
 * サーバーサイド
    * Ruby 3.2.2
    * Rails 7.1.3.4

 * データベース
    * PostgreSQL

 * フロントエンド
    * HTML
    * CSS
    * JavaScript
    * Chart.js

 * インフラ
    * Fly.io

<!-- ## アプリ拡張の観点からの追加機能案
 * xへの投稿機能
  * 1日・1週間・1ヶ月の勉強時間をXへ投稿出来るようにする。
  * 質問への回答時、回答をxへ投稿出来る様にする。
 * 記録を他の人と共有する機能
  * タイムラインページを作成し、そこに勉強完了時にスタート時間・勉強時間を全ユーザーへリアルタイムで共有できるようにする。
  * 同じくタイムラインページで質問と質問に対する回答をリアルタイムで全ユーザーへ共有する。
 * 他の人の記録に「いいね」をする機能
 　タイムラインページ上で他の人の投稿への「いいね」をする事ができるようにする。
 * 勉強のカテゴリー作成
 　勉強のカテゴリーをユーザーが自由に作成してカテゴリー毎にデータを管理できるようにする。
 　カテゴリー例「プログラミング・英語・aws等」
 * カテゴリーごとでの計測機能
 　勉強時間計測開始時に上記で作成したカテゴリーを選択してカテゴリー毎に勉強時間・質問への回答を管理できるようにする。 -->

 ### 画面遷移図
Figma : https://www.figma.com/file/J8zq5K6iB66vGLrMDfcUVj/Lock-In-Study?type=design&node-id=0-1&mode=design&t=Dib9uffXOm5mWtsb-0


### ER図
![alt text](<Lock In Study.drawio.png>)

### 著作権関係
・通知音
  魔王魂：https://maou.audio
