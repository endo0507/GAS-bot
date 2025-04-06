/*
LINE Messaging APIを使って、スプレッドシートから内容を取得し、特定のグループにプッシュ通知するスクリプトです。
GROUP_IDの取得は、サンプルデータのreplyID.gsを使うとできます。
getSheetByNameやgetRangeはサンプルのExcelデータのものです。
*/

const lineBot = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('時刻表');

function goHome(){
	const msg = lineBot.getRange('G5').getValue(); //メッセージ内容
	const payload = {
		'to': PropertiesService.getScriptProperties().getProperty('GROUP_ID'),
		'messages':[{
			'type':'text',
			'text':'今から帰ります:' + msg
		}]
	};
	const res = UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push',{
		'method':'post',
		'headers':{
			'Content-Type':'application/json',
			'Authorization':'Bearer ' + PropertiesService.getScriptProperties().getProperty('CHANNEL_ACCESS_TOKEN')
		},
		'payload':JSON.stringify(payload)
	}); //メッセージ送信
	console.log(res.getContentText());
}