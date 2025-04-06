/*
LINE公式アカウントを開設し、Messaging APIを有効化する。
(詳しい手順：https://developers.line.biz/ja/docs/messaging-api/getting-started/)
チャネルアクセストークン(長期)を発行し、スクリプトプロパティに登録。
これをWebアプリとしてデプロイし、WebアプリのURLをWebhook URLに登録。
公式アカウントに「ID」とメッセージを送るとIDが返信されます。
*/

function doPost(d){
	const events = JSON.parse(d.postData.contents).events;
	for(const e of events){
		if(e.type == 'message' && e.message.type == 'text' && e.message.text == 'ID'){
			const srctype = e.source.type
			let id;
			switch(srctype){
				case 'user': //1対1トーク
					id = e.source.userId; break;
				case 'group': //グループ
					id = e.source.groupId; break;
				case 'room': //複数人トーク
					id = e.source.roomId; break;
			}
			const payload = {
				'replyToken': e.replyToken,
				'messages': [{
					'type':'text',
					'text': srctype + ' ID = ' + id
				}]
			};
			UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply',{
				'method':'post',
				'headers':{
					'Content-Type':'application/json',
					'Authorization':'Bearer ' + PropertiesService.getScriptProperties().getProperty('CHANNEL_ACCESS_TOKEN')
				},
				'payload':JSON.stringify(payload)
			});
		}
	}
}