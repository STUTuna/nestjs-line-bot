// 測驗服務
// 功能:
// 抓題目丟出去
// 計算分數
// 換算動物結果

import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizService {
  onModuleInit() {
    // this.sayHello();
  }

  main() {
    // this.sayHello();
  }

  // 進場詞
  getEntryMessage() {
    return `情緒原型評測\n此評測請用直覺點選\n只需一分鐘即可完成\n開始測驗 !!!!`;
  }

  // 確認使用者
  // 詢問使用者是否要開始測驗

  // 取得玩家下一個題目 若沒有就顯示結果
}