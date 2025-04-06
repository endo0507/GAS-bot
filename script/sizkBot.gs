/*
スプレッドシートから内容を取得し、ツイートするスクリプトです。
このスクリプトはTwitterWebService.gsのライブラリを使用しています。
GASのライブラリからは削除されているので、↓からコピペし自作ライブラリとして追加して下さい。
(https://gist.github.com/M-Igashi/750ab08718687d11bff6322b8d6f5d90)
元々V8ランタイムでは動作しなかったですが、TwitterWebServiceで使われているOAuth1をVer.18にすると、V8ランタイムでも動くようになります。
getSheetByNameやgetRangeはサンプルのExcelデータのものです。
*/

const sizkAPI = TwitterWebService.getInstance(
	PropertiesService.getScriptProperties().getProperty('CONSUMER_API_KEY'), //Consumer API Key
	PropertiesService.getScriptProperties().getProperty('CONSUMER_API_SECRET') //Consumer API Secret
); //認証インスタンス
function authorize(){ sizkAPI.authorize(); } //最初の認証
function authCallback(request){ return sizkAPI.authCallback(request); } //コールバック
function reset(){ sizkAPI.reset(); } //認証解除

function sizkTweet(){ //投稿時刻の1分前から実行
	const sizkBot = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SizkBot'); //シート名
	try{
		const sleepTime = new Date(sizkBot.getRange('H1').getValue()) - new Date()
		sleepTime > 0 && Utilities.sleep(sleepTime); //ツイートの時間まで待機
		postTweet(sizkBot.getRange('H2').getValue() + '\n#オルガル2');
	}catch(e){
		sendErrorNotifyMail(e);
		console.error(e);
	}finally{
		sizkBot.getRange('H1').setFormula('=min(G4:G12)'); //数式再入力
		SpreadsheetApp.flush(); //次のツイートの投稿時刻を取得するため再計算
		delTrigger('sizkTweet');
		createTrigger('sizkTweet', new Date(sizkBot.getRange('H1').getValue()));
	}
}
function postTweet(content){
	const service = sizkAPI.getService();
	const res = JSON.parse(service.fetch('https://api.twitter.com/2/tweets',{
		'method':'post',
		'contentType':'application/json',
		'payload':JSON.stringify({text:content})
	})); //ツイート
	console.log(res);
}
function delTrigger(funcName){
	const triggers = ScriptApp.getProjectTriggers();
	for(const t of triggers){
		t.getHandlerFunction() == funcName && ScriptApp.deleteTrigger(t); //引数funcNameと一致したトリガーを削除
	}
}
function createTrigger(funcName, nextTweetTime){
	console.log('nextTweetTime:', nextTweetTime);
	let triggerTime = nextTweetTime;
	triggerTime.setMinutes(nextTweetTime.getMinutes() - 1); //次の投稿時刻の1分前に設定
	ScriptApp.newTrigger(funcName).timeBased().at(triggerTime).create();
}

function sendErrorNotifyMail(e = 'テスト送信'){
	const now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yy/M/d a K:mm:ss'),
	options = {from:'example+GASErrorNotify@example.com', name: 'GASエラー通知'},
	body = 'しずくandまどぐちbotでエラーが発生しました。確認してください。\n\n' +
	e + '\n' +
	'発生時刻：' + now;
	GmailApp.sendEmail('example@example.com', 'しずくandまどぐちbotでエラーが発生しました', body, options);
}