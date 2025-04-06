# GAS-bot
[Endoのホームページ](https://endo0507.github.io/created/)で紹介しているbotのソースコード(サンプル)を置いています。<br>
bot_sample.xlsxと、scriptフォルダ内のスクリプトを用いて、サンプルプログラムを動作させたり、<br>
オープンソースソフトウェアとしても使えます。
## botの紹介
### しずくandまどぐちbot
bot_sample.xlsxの"sizkBot"シートと、sizkBot.gsを使用します

[X(\@orugarubot)](https://x.com/orugarubot)で運用しているbotです。<br>
スプレッドシートから投稿内容を取得し、X API v2にリクエストを送ってポストします。<br>
スプレッドシートから次の投稿時刻を取得し、次の投稿のトリガーを設定します。
### LINE Messaging APIを活用した「今から帰るよ」bot
bot_sample.xlsxの"時刻表"シートと、LINEMessagingAPI.gsを使用します

Googleフォームで何本後の電車で帰るか回答すると、スプレッドシートからメッセージ内容を取得して送信します。<br>
次の電車の時刻算出、メッセージ内容の作成はスプレッドシートでしているので、スクリプトはただ送信するだけのシンプルなものです。
