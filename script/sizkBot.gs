/* 実行前の準備
1. このスクリプトを、スクリプトエディタに貼り付ける
2. サンプル以外のスプレッドシートの場合、21行目のgetSheetByName('シート名')、23,37,39行目のgetRange('セル番地')とかを変更する
3. 66行目、sendErrorNotifyMail関数の中のメールアドレスを設定する(エラー時にメールが送信されます)
4. Google Apps Scriptの設定でV8ランタイムを無効にする
5. TwitterWebService のライブラリを追加する
→  Script ID: 1rgo8rXsxi1DxI_5Xgo_t3irTw1Y5cxl2mGSkbozKsSXf2E_KBBPC3xTF
6. X Developer Portalでの登録作業をする(APIキーの発行など)
→  Consumer API Keyを13行目に、Consumer API Secretを14行目に貼り付ける
7. authorize関数を実行し認証する
*/

var sizkAPI = TwitterWebService.getInstance(
  'PasteYourConsumerAPIKey', //Consumer API Key
  'PasteYourConsumerAPISecret' //Consumer API Secret
); //認証インスタンス
function authorize(){ sizkAPI.authorize(); } //最初の認証
function authCallback(request){ return sizkAPI.authCallback(request); } //コールバック
function reset(){ sizkAPI.reset(); } //認証解除

function sizkTweet(){ //投稿時刻の1分前から実行
  const sizkBot = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SizkBot'); //シート名
  try{
    var content = {text:sizkBot.getRange('H2').getValue() + '\n#オルガル2'}; //投稿内容取得
    var startTime = new Date(); //現在時刻取得
    if(startTime.getSeconds() >= 58){ //トリガーが58秒以降に実行された場合
      Utilities.sleep(2000); //分が変わってから時間計算され60秒遅れるので、sleepは2秒固定にする
    }else{
      startTime.setMinutes(startTime.getMinutes() + 1, 0, 0); //現在時刻より1分後の0秒丁度に設定
      Utilities.sleep(startTime - new Date()); //「1分後の0秒丁度 - 現在時刻」秒間sleep
    }
    console.log(content);
    postTweet(content); //ツイートする
  }catch(e){
    sendErrorNotifyMail(e); //エラー時のメール送信
    console.error(e); //エラーログを残す
  }finally{
    sizkBot.getRange('H2').setFormula('=index(H4:H12,match(H1,G4:G12,0))'); //セルJ2の数式を再入力する(しないと再計算してくれない)
    SpreadsheetApp.flush(); //適用して再計算
    var nextTweetTime = new Date(sizkBot.getRange('H1').getValue()); //次のツイートの投稿時刻を取得
    console.log(nextTweetTime);
    delTrigger('sizkTweet'); //sizkTweetのトリガー削除
    createTrigger('sizkTweet', nextTweetTime); //次のツイートのトリガーを作成
  }
}
function delTrigger(funcName){
  var triggers = ScriptApp.getProjectTriggers();
  for(var i = 0; i < triggers.length; i++){
    triggers[i].getHandlerFunction() == funcName && ScriptApp.deleteTrigger(triggers[i]); //引数funcNameと一致したトリガーを削除
  }
}
function createTrigger(funcName, nextTweetTime){
  var setTime = new Date(nextTweetTime.setMinutes(nextTweetTime.getMinutes() - 1)); //次の投稿時刻の1分前に設定
  ScriptApp.newTrigger(funcName).timeBased().at(setTime).create(); //トリガー作成
}
function postTweet(content){
  var service = sizkAPI.getService();
  var res = JSON.parse(service.fetch('https://api.twitter.com/2/tweets',{
    'method':'post',
    'validateHttpsCertificates':false,
    'contentType':'application/json',
    'payload':JSON.stringify(content)
  })); //ツイート投稿
  console.log(res);
}
function sendErrorNotifyMail(e){
  var now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yy/M/d a K:mm:ss');
  const to = 'example@example.com', subject ='しずくandまどぐちbotでエラーが発生しました',
  options = {from:'example+GASErrorNotify@example.com', name: 'GASエラー通知'};
  var body = 'しずくandまどぐちbotでエラーが発生しました。確認してください。\n\n' +
  e + '\n' +
  '発生時刻：' + now;
  GmailApp.sendEmail(to, subject, body, options); //エラー時のメール送信
}