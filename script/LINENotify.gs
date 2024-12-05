/* 実行前の準備
1. このスクリプトを、スクリプトエディタに貼り付ける
2. サンプル以外のスプレッドシートの場合、10行目のgetSheetByName('シート名').getRange('セル番地')を変更する
3. LINE Notify(https://notify-bot.line.me/ja/)でトークンを発行し、11行目に貼り付ける

注：LINE Notifyは2025年3月31日でサービスを終了し、利用できなくなります。将来的にDiscord Botとかに置き換える予定です。
*/

function goHome(){
  let msg = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('時刻表').getRange('F5').getValue(); //メッセージ内容取得
  const token = ['PasteYourLINENotifyToken']; //トークン
  UrlFetchApp.fetch('https://notify-api.line.me/api/notify',{
    'method':'post',
    'payload':'message=' + msg,
    'headers':{'Authorization':'Bearer ' + token} //"Bearer"の後には半角スペースを1文字入れる
  }); //メッセージ送信
}