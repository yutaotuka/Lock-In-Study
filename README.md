# Lock-In-Study
## サービス概要
Lock In Studyは主に2つの機能があります
1. 勉強時間の計測。
2. 勉強時間の計測中にランダムなタイミングで今している事について質問をします。
## このサービスを作りたい理由
自分が学習中に集中力を確保することが苦手で、気がついたら部屋の掃除やyoutubeを見ることに時間を取られてしまい思うように勉強が進まないことがあった。  
そこにかなり課題を感じていた為、集中するためにタイマーで時間をはかり定期的に自分が今何をしていてそれがどの様な意味があるかを考えるようにしたら勉強が捗るようになった。  
学習中の集中力維持に課題を抱えている人の為にこのサービスを作りたいです。
## ユーザー層について
勉強をしていてもついつい他のことをしてしまう人
## サービスの利用イメージ
勉強時間の測定中に通知される質問を通して、今自分が集中しているかを客観的に認識出来る様にする。  
質問は何層かに分ける。内容は最初の質問の答えによって変える。また最初の質問の答え方は面倒になりすぎない様ボタンにする。  
以下質問のイメージ。  
* 質問1　ー　あなたは今何をしていますか？
    * 回答（3択）　　・勉強　・休憩　・他の事

* 質問2　（質問1で選択したものによって変える)
    * 勉強の場合 - なぜそれをしていますか？
        * 回答例 - Railsの使い方を学ぶため
    * 休憩の場合 - あと何分休憩しますか？
        * 回答例 - 10分
    * 他の事の場合 - なぜそれをしていますか？
        * 回答例 - なんとなく

* 質問3（質問1で選択したものによって変える)
    * 勉強の場合 - それをする事で何が得られるのですか？
        * 回答例 - 転職してやりがいのある仕事ができる
    * 休憩の場合 - なし
    * 他の事の場合 - それをする事で何を失いますか？
        * 回答例 - 転職できる時期が遅くなる

## サービスの差別化ポイント・推しポイント
勉強時間を計測して達成感を感じさせるサービスは多く存在しているためその機能での差別化は難しいと考えます。  
このアプリに関しては測定中の集中力、内容にフォーカスしているためその部分が他サービスとの差別化になると考えています。

## 機能候補(MVPリリース時)
 * 勉強時間の測定機能
 * 勉強時間測定中の質問通知機能
 * LINEでの会員登録機能
 （LINEでの通知機能を実装予定なのでLINE経由での会員登録のみに絞ろかと考えていますが、辞めた方が良ければAPI経由ではないログインも実装しようかと思います。）
 ## 機能候補(本リリース時)
 * LINEでの通知機能（PCの前おらず部屋の掃除とかをしていたら通知に気づかないため）
 * 勉強時間の記録一覧
 * 質問への回答一覧

## 機能の実装方針予定
 * LINE Messaging API
 * 質問の通知は音を鳴らして知らせる
 * 通知の音を鳴らすか消すかの選択が可能

## 使用予定の技術スタック
 * サーバーサイド
    * Ruby 3.2.2
    * Rails 7.1.3.4

 * データベース
    * MySQL

 * フロントエンド
    * HTML
    * Bootstrap
    * jQuery
    * Chart.js
    * jquery.inview

 * インフラ
    * Fly.io

## アプリ拡張の観点からの追加機能案
 * xへの共有機能
 　1日・1週間・1ヶ月の勉強時間をXへ投稿出来るようにする。
 　質問への回答時、回答をxへ投稿出来る様にする。
 * 記録を他の人と共有する機能
 　タイムラインページを作成して、そこに勉強完了時にスタート時間・勉強時間をリアルタイムで共有できるようにする。
 　同じくタイムラインページで質問と質問に対する回答をリアルタイムで共有する。
 * 他の人の記録に「いいね」をする機能
 　タイムラインページ上で他の人の投稿への「いいね」をする事ができるようにする。
 * 勉強のカテゴリー作成
 　勉強のカテゴリーを作成してカテゴリー毎にデータを管理できるようにする。
 　カテゴリー例「プログラミング・英語・aws等」
 * カテゴリーごとでの計測機能
 　勉強時間計測開始時に上記で作成したカテゴリーを選択してカテゴリー毎に勉強時間・質問への回答を管理できるようにする。