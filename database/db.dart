import 'package:sqlite3/sqlite3.dart';

class Database {
  final db;

  Database(String path) : db = sqlite3.open(path);

  void createUsersTable() {
    db.execute('''
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER NOT NULL PRIMARY KEY,
        user_id INTEGER NOT NULL
      );
    ''');
  }

  void addUser(int user_id){
    final sql = db.prepare('''INSERT INTO users (user_id) VALUES (?)''');
    sql.execute([user_id]);
    sql.dispose();
  }

Map<String, dynamic>? selectUser(int userId) {
    final ResultSet resultSet = db.select('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (resultSet.isNotEmpty) {
      final row = resultSet.first;
      return {'id': row['id'], 'user_id': row['user_id']};
    }
    return null;
  }

  Map<String, dynamic>? countUser() {
    final ResultSet resultSet = db.select('SELECT count(*) FROM users');
    if (resultSet.isNotEmpty) {
      final row = resultSet.first;
      return {'count': row['count(*)']};
    }
    return {'count': 0};
  }

}
