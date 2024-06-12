import 'package:teledart/model.dart';
import 'package:teledart/teledart.dart';
import 'package:teledart/telegram.dart';
import '../keyboards/menu.dart';




Future<void> main() async {
  const BOT_TOKEN = "x:x:x:x:x:x:x:x:x";
  final username = (await Telegram(BOT_TOKEN).getMe()).username;
  final teledart = TeleDart(BOT_TOKEN, Event(username!));

  teledart.start();

  teledart.onCommand('start').listen((message)  { 
String text = "${message.from?.username != null ? '@${message.from!.username}' : ''}\nId: ${message.from!.id}\nFirst: ${message.from!.firstName}\nLang: ${message.from!.languageCode}";

    dynamic markup = menu();
    teledart.sendMessage(
      message.chat.id, text,
      parseMode: 'html',
      replyMarkup: markup,
      );
      

  });

  teledart.onMessage().listen((message) async { 
    String text = "";
    if (message.text == null){
      text = text =  "User id:  <code>${message.userShared?.userId}</code>";
    }else if (message.text != null){
      text = text = "${message.from?.username != null ? '@${message.from!.username}' : ''}\nId: ${message.from!.id}\nFirst: ${message.from!.firstName}\nLang: ${message.from!.languageCode}";

  }
    teledart.sendMessage(
      message.chat.id, text,
      parseMode: 'html');
    }
);
}