// 測驗服務
// 功能:
// 抓題目丟出去
// 計算分數
// 換算動物結果

import { Injectable } from '@nestjs/common';
import { User } from './user.interface';
import { ResultObject, UserStage } from 'src/enum/enum';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class UserService {
  constructor(private readonly firebaseService: FirebaseService) {}
  // 更新使用者session的stage狀態
  updateUserStage(userId: string, message: string): void {
    return;
  }

  handleUserInput(user: User, message: string): void {
    // 如果user.stage是QUIZ類型就把答案存起來
    if (
      user.stage === UserStage.QUIZ2 ||
      user.stage === UserStage.QUIZ3 ||
      user.stage === UserStage.QUIZ4 ||
      user.stage === UserStage.QUIZ5 ||
      user.stage === UserStage.RESULT_TEST
    ) {
      // 把答案存起來
      user.resultArr.push(message);
      return;
    }

    if (user.stage === UserStage.RESULT_EMAIL) {
      // 驗證email格式
      this.verifyEmail(message);
      // 如果email格式不正確
      if (!this.verifyEmail(message)) {
        throw new Error('請輸入正確的email');
      }
      // 如果email格式正確 更新使用者email
      user.email = message;
    }

    if (user.stage === UserStage.RESULT_PHONE) {
      // 如果手機號碼格式不正確
      if (message.length !== 10) {
        throw new Error('請輸入正確的手機號碼');
      }
      // 如果手機號碼格式正確 更新使用者phone
      user.phone = message;
    }

    if (user.stage === UserStage.RESULT_LINE_ID) {
      // 不驗證 直接更新使用者line id
      user.customLineId = message;
    }

    // 更新使用者姓名
    if (user.stage === UserStage.RESULT_NAME) user.name = message;

    // 更新使用者資料到firebase
    if (
      user.stage === UserStage.RESULT_NAME ||
      user.stage === UserStage.RESULT_EMAIL ||
      user.stage === UserStage.RESULT_PHONE ||
      user.stage === UserStage.RESULT_LINE_ID
    ) {
      this.firebaseService.writeUserData(user);
    }

    // 如果user.stage是ENTRY 且 message是開始測驗!!! 就把user.stage改成QUIZ1
    if (user.stage === UserStage.ENTRY && message === '開始測驗!!!') {
      user.stage = UserStage.QUIZ1;
    }

    // 如果使用者未在報名畫面點擊報名 就跳回進入點
    if (
      user.stage === UserStage.RESULT_SIGNUP &&
      message !== ResultObject.ANSWER_SIGNUP.value.text
    ) {
      user.stage = UserStage.ENTRY;
    }
  }

  // 驗證email格式
  verifyEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  // 取得使用者回答哪個選項最多次
  getMostAnswer(user: User): string {
    // 把使用者的答案轉成物件
    const resultObj = user.resultArr.reduce((acc, cur) => {
      if (acc[cur]) {
        acc[cur]++;
      } else {
        acc[cur] = 1;
      }
      return acc;
    }, {});
    // 把物件轉成陣列
    const resultArr = Object.entries(resultObj);
    // 把陣列排序
    resultArr.sort((a: any, b: any) => b[1] - a[1]);
    // 回傳答案最多的選項
    return resultArr[0][0];
  }
}
