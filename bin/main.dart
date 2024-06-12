import 'package:teledart/model.dart';
import 'package:teledart/teledart.dart';
import 'package:teledart/telegram.dart';
import '../keyboards/menu.dart';
import '../database/db.dart';




Future<void> main() async {
  Database database = Database('main.db');
  database.createUsersTable();
  const BOT_TOKEN = "6447264435:AAGDfkT-_vks2vLXs3y0LqlLNCc0ARYEzm4";
  final username = (await Telegram(BOT_TOKEN).getMe()).username;
  final teledart = TeleDart(BOT_TOKEN, Event(username!));

  teledart.start();

  teledart.onCommand('start').listen((message)  { 

    final result = database.selectUser(message.from!.id);
    if (result == null){
      database.addUser(message.from!.id);
    }
    String text = "${message.from?.username != null ? '@${message.from!.username}' : ''}\nId: ${message.from!.id}\nFirst: ${message.from!.firstName}\nLang: ${message.from!.languageCode}";
    dynamic markup = menu();
    teledart.sendMessage(
      message.chat.id, text,
      parseMode: 'html',
      replyMarkup: markup,
      );
      

  });

  teledart.onCommand('stat').listen((message) { 
    final stat = database.countUser();
    teledart.sendMessage(
      message.chat.id, "<b>BOT FOYDALANAUVCHILARI: ${stat!['count']} ta</b>",
      parseMode: 'html',
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