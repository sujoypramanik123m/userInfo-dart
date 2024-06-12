import 'package:teledart/model.dart';

menu(){
  var users =  KeyboardButton(text: "User 👤",requestUser: KeyboardButtonRequestUser(requestId: 1, userIsBot: false, ));
  
  dynamic markup = ReplyKeyboardMarkup(
      keyboard: [[users]],
      resizeKeyboard: true
    );

  return markup;
}