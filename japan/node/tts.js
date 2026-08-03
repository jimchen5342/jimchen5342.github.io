import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts'; // 導入官方常數
import ffmpeg from 'fluent-ffmpeg';

// 相容 ESM 的目錄路徑宣告
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __outputFile = '重點.mp3';

// https://jimchen5342.github.io/japan/node/重點.mp3

// 1. 定義您的 JSON 陣列資料來源

let vocabularyList = [];
const vocabularyList01A = () => {
  return [
    {
      "kana": "はじめまして",
      "mean": "初次見面"
    },
    {
      "kana": "台湾からきました",
      "mean": "我來自台灣"
    },
    {
      "kana": "どうぞ よろしく おねがいします",
      "mean": "請多多關照"
    },
    {
      "kana": "しつれいですが",
      "mean": "抱歉、請問…"
    },
    {
      "kana": "おなまえは",
      "mean": "您貴姓?"
    },
    {
      "kana": "こちらは 〜 さんです",
      "mean": "這位是~"
    },
    {
      "kana": "おやすみなさい",
      "mean": "晚安(睡前)"
    },
    {
      "kana": "どういたしまして",
      "mean": "不客氣"
    },
    {
      "kana": "もうしわけ ございません",
      "mean": "很抱歉"
    },
    {
      "kana": "もうしわけ ありません",
      "mean": "對不起、很抱歉"
    },
    {
      "kana": "ごちそうさまでした",
      "mean": "多謝您的款待"
    },
    {
      "kana": "いってきます",
      "mean": "我出去了"
    },
    {
      "kana": "いってらっしゃい",
      "mean": "路上小心"
    },
    {
      "kana": "ただいま",
      "mean": "我回來了"
    },
    {
      "kana": "おかえりなさい",
      "mean": "歡迎回家"
    }
  ];
}

const vocabularyList01B = () => {
 return [
    {
      "kana": "おひさしぶりです",
      "mean": "好久不見"
    },
    {
      "kana": "おつかれさまです",
      "mean": "辛苦了"
    },
    {
      "kana": "おじゃまします",
      "mean": "打擾了"
    },
    {
      "kana": "おせわになります",
      "mean": "承蒙關照"
    },
    {
      "kana": "きをつけて",
      "mean": "小心"
    },
    {
      "kana": "ごぶさたしております",
      "mean": "久未聯繫"
    },
    {
      "kana": "おだいじに",
      "mean": "請保重"
    },
    {
      "kana": "おめでとう ございます",
      "mean": "恭喜!"
    },
    {
      "kana": "おさきに しつれいします",
      "mean": "先告辭了"
    },
    {
      "kana": "またね",
      "mean": "再見"
    }
  ]
}

const vocabularyList02A = () => {
 return [
    {
      "id": 8,
      "kana": "じしょ",
      "mean": "字典"
    },
    {
      "id": 9,
      "kana": "ざっし",
      "mean": "雜誌"
    },
    {
      "id": 10,
      "kana": "しんぶん",
      "mean": "報紙"
    },
    {
      "id": 11,
      "kana": "ノート",
      "mean": "筆記本"
    },
    {
      "id": 12,
      "kana": "てちょう",
      "mean": "記事本"
    },
    {
      "id": 13,
      "kana": "めいし",
      "mean": "名片"
    },
    {
      "id": 14,
      "kana": "カード",
      "mean": "卡片"
    },
    {
      "id": 15,
      "kana": "えんぴつ",
      "mean": "鉛筆"
    },
    {
      "id": 16,
      "kana": "ボールペン",
      "mean": "原子筆"
    },
    {
      "id": 17,
      "kana": "シャープペンシル",
      "mean": "自動鉛筆"
    },
    {
      "id": 18,
      "kana": "かぎ",
      "mean": "鑰匙"
    },
    {
      "id": 19,
      "kana": "とけい",
      "mean": "鐘錶"
    },
    {
      "id": 20,
      "kana": "かさ",
      "mean": "傘"
    },
    {
      "id": 21,
      "kana": "かばん",
      "mean": "皮包"
    },
    {
      "id": 22,
      "kana": "シーディー",
      "mean": "光碟"
    },
    {
      "id": 23,
      "kana": "テレビ",
      "mean": "電視"
    },
    {
      "id": 24,
      "kana": "ラジオ",
      "mean": "收音機"
    },
    {
      "id": 25,
      "kana": "カメラ",
      "mean": "照相機"
    },
    {
      "id": 26,
      "kana": "コンピューター",
      "mean": "電腦"
    },
    {
      "id": 27,
      "kana": "くるま",
      "mean": "汽車"
    },
    {
      "id": 28,
      "kana": "つくえ",
      "mean": "桌子"
    },
    {
      "id": 29,
      "kana": "いす",
      "mean": "椅子"
    },
    {
      "id": 30,
      "kana": "チョコレート",
      "mean": "巧克力"
    },
    {
      "id": 31,
      "kana": "コーヒー",
      "mean": "咖啡"
    },
    {
      "id": 32,
      "kana": "おみやげ",
      "mean": "伴手禮"
    },
    {
      "id": 33,
      "kana": "えいご",
      "mean": "英語"
    }
  ]
}

const vocabularyNumber = () => {
  return [
      {
        "id": 1,
        "kana": "いち",
        "roma": "i chi",
        "kanji": "一",
        "accent": "2",
        "mean": "一"
      },
      {
        "id": 2,
        "kana": "に",
        "roma": "ni",
        "kanji": "二",
        "accent": "1",
        "mean": "二"
      },
      {
        "id": 3,
        "kana": "さん",
        "roma": "sa n",
        "kanji": "三",
        "accent": "3",
        "mean": "三"
      },
      {
        "id": 4,
        "kana": "よん",
        "roma": "yo n",
        "kanji": "四",
        "accent": "1",
        "mean": "四"
      },
      {
        "id": 5,
        "kana": "ご",
        "roma": "go",
        "kanji": "五",
        "accent": "1",
        "mean": "五"
      },
      {
        "id": 6,
        "kana": "ろく",
        "roma": "ro ku",
        "kanji": "六",
        "accent": "2",
        "mean": "六"
      },
      {
        "id": 7,
        "kana": "なな",
        "roma": "na na",
        "kanji": "七",
        "accent": "1",
        "mean": "七"
      },
      {
        "id": 8,
        "kana": "はち",
        "roma": "ha chi",
        "kanji": "八",
        "accent": "2",
        "mean": "八"
      },
      {
        "id": 9,
        "kana": "きゅう",
        "roma": "kyū",
        "kanji": "九",
        "accent": "1",
        "mean": "九"
      },
      {
        "id": 10,
        "kana": "じゅう",
        "roma": "jū",
        "kanji": "十",
        "accent": "1",
        "mean": "十"
      },
      {
        "id": 19,
        "kana": "ひゃく",
        "roma": "hya ku",
        "kanji": "百",
        "accent": "2",
        "mean": "一百"
      },
      {
        "id": 20,
        "kana": "さんびゃく",
        "roma": "sa n bya ku",
        "kanji": "三百",
        "accent": "3",
        "mean": "三百"
      },
      {
        "id": 21,
        "kana": "ろっぴゃく",
        "roma": "ro ppyaku",
        "kanji": "六百",
        "accent": "3",
        "mean": "六百"
      },
      {
        "id": 22,
        "kana": "はっぴゃく",
        "roma": "ha ppyaku",
        "kanji": "八百",
        "accent": "3",
        "mean": "八百"
      },
      {
        "id": 23,
        "kana": "せん",
        "roma": "se n",
        "kanji": "千",
        "accent": "1",
        "mean": "一千"
      },
      {
        "id": 24,
        "kana": "さんぜん",
        "roma": "sa n ze n",
        "kanji": "三千",
        "accent": "3",
        "mean": "三千"
      },
      {
        "id": 25,
        "kana": "はっせん",
        "roma": "ha ssen",
        "kanji": "八千",
        "accent": "3",
        "mean": "八千"
      },
      {
        "id": 26,
        "kana": "いちまん",
        "roma": "i chi ma n",
        "kanji": "一万",
        "accent": "3",
        "mean": "一萬"
      }
    ]
};
    

// 2. 設定音色
const ZH_VOICE = "zh-TW-HsiaoChenNeural"; // 台灣中文女聲
const JA_VOICE = "ja-JP-NanamiNeural";     // 日本日文女聲
const JA_VOICE_MALE = "ja-JP-KeitaNeural"; // 日本日文男聲

// 封裝成一個將語音寫入檔案的 Promise 函式
function saveSpeechToFile(text, voice, targetPath) {
    return new Promise(async (resolve, reject) => {
        try {
            const tts = new MsEdgeTTS();
            // 1. 先設定音色與輸出格式
            await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
            
            // 2. 獲取音訊流
            const { audioStream } = tts.toStream(text);
            const writeStream = fs.createWriteStream(targetPath);
            
            audioStream.pipe(writeStream);
            
            writeStream.on('finish', () => resolve());
            writeStream.on('error', (err) => reject(err));
            audioStream.on('error', (err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
}

// 產生靜音檔（預設 0.5 秒）
function generateSilence(silencePathLong, durationSec = 0.5) {
  return new Promise((resolve, reject) => {
    // Use raw PCM zeros from /dev/zero to avoid relying on lavfi
    // ffmpeg command equivalent:
    // ffmpeg -f s16le -ar 24000 -ac 1 -i /dev/zero -t <duration> -acodec libmp3lame <silencePathLong>
    ffmpeg()
      .input('/dev/zero')
      .inputOptions(['-f s16le', '-ar 24000', '-ac 1'])
      .outputOptions(['-t', String(durationSec)])
      .audioCodec('libmp3lame')
      .audioChannels(1)
      .audioFrequency(24000)
      .format('mp3')
      .save(silencePathLong)
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });
}

/**
 * 核心主程式
 */
async function main() {
    // 第 01 課
    // vocabularyList = vocabularyList01A(); // 重點1 
    // vocabularyList = vocabularyList.concat(vocabularyList01B()) // 全部
    // vocabularyList = vocabularyList02A(); //
    vocabularyList = vocabularyNumber(); // 數字
    const title = "數字";
    
    const concatFiles = [];
    const cleanupFiles = [];
    const silencePathLong = path.join(__dirname, `silence_Long.mp3`);
    let silenceCreatedLong = false;
    let addSilenceLong = async () => {
      let silenceDuration = 1.5; // 靜音檔並加入合併清單（僅建立一次， 可重複加入以產生多個間隔）
      try {
        if (!silenceCreatedLong) {
          if (!fs.existsSync(silencePathLong)) {
            console.log('正在產生 ' + silenceDuration + ' 秒靜音檔...');
            await generateSilence(silencePathLong, silenceDuration);
          }
          silenceCreatedLong = true;
          if (!cleanupFiles.includes(silencePathLong)) cleanupFiles.push(silencePathLong);
        }
        concatFiles.push(silencePathLong);
      } catch (err) {
        console.error('產生或加入靜音檔失敗', err);
      }
    };

    const silencePathShort = path.join(__dirname, `silence_Short.mp3`);
    let silenceCreatedShort = false;
    let addSilenceShort = async () => {
      let silenceDuration = 1; // 靜音檔並加入合併清單（僅建立一次， 可重複加入以產生多個間隔）
      try {
        if (!silenceCreatedShort) {
          if (!fs.existsSync(silencePathShort)) {
            console.log('正在產生 ' + silenceDuration + ' 秒靜音檔...');
            await generateSilence(silencePathShort, silenceDuration);
          }
          silenceCreatedShort = true;
          if (!cleanupFiles.includes(silencePathShort)) cleanupFiles.push(silencePathShort);
        }
        concatFiles.push(silencePathShort);
      } catch (err) {
        console.error('產生或加入靜音檔失敗', err);
      }
    };
    
    console.log("🔍 開始讀取 JSON 陣列並依序生成語音...");
    try {
        let fileIndex = 0;
        const jaMan = false, jaWoman = true, zhWoman = false;

        {
            const zhPath = path.join(__dirname, `temp_${fileIndex++}.mp3`);
            concatFiles.push(zhPath);
            if (!cleanupFiles.includes(zhPath)) cleanupFiles.push(zhPath);
            await saveSpeechToFile(title, ZH_VOICE, zhPath);
            await addSilenceLong(); // 加入 1 秒靜音
            await addSilenceLong(); // 加入 1 秒靜音
        }
            
        for (const item of vocabularyList) {
            // --- A. 合成日文 (kana) ---
            if (item.kana) {
              if(jaMan) {
                let jaPath = path.join(__dirname, `temp_${fileIndex++}.mp3`);
                concatFiles.push(jaPath);
                if (!cleanupFiles.includes(jaPath)) cleanupFiles.push(jaPath);
                console.log(`[JA] 正在合成: "${item.kana}"`);
                await saveSpeechToFile(item.kana, JA_VOICE_MALE, jaPath);
                await addSilenceShort(); // 加入 0.5 秒靜音
              }

              if(jaWoman && !jaMan) {
                let jaPath = path.join(__dirname, `temp_${fileIndex++}.mp3`);
                concatFiles.push(jaPath);
                if (!cleanupFiles.includes(jaPath)) cleanupFiles.push(jaPath);
                console.log(`[JA] 正在合成: "${item.kana}"`);
                await saveSpeechToFile(item.kana, JA_VOICE, jaPath);
                await addSilenceShort(); // 加入 0.5 秒靜音
              }
              
              
              if(jaWoman) {
                let jaPath = path.join(__dirname, `temp_${fileIndex++}.mp3`);
                concatFiles.push(jaPath);
                if (!cleanupFiles.includes(jaPath)) cleanupFiles.push(jaPath);
                console.log(`[JA] 正在合成: "${item.kana}"`);
                await saveSpeechToFile(item.kana, JA_VOICE, jaPath);
                if(zhWoman)
                  await addSilenceShort(); // 加入 0.5 秒靜音
              }
            }

            // --- B. 合成中文 (mean) ---
            if (item.mean && zhWoman) {
                const zhPath = path.join(__dirname, `temp_${fileIndex++}.mp3`);
                concatFiles.push(zhPath);
                if (!cleanupFiles.includes(zhPath)) cleanupFiles.push(zhPath);
                console.log(`[ZH] 正在合成: "${item.mean}"`);
                await saveSpeechToFile(item.mean, ZH_VOICE, zhPath);
            }
            await addSilenceLong(); // 加入 1 秒靜音
        }
        await addSilenceLong(); // 加入 1 秒靜音
        await addSilenceLong(); // 加入 1 秒靜音

        console.log("🎵 正在使用 ffmpeg 拼接所有音訊片段...");
        const finalOutput = path.join(__dirname, __outputFile);
        cleanup([finalOutput]); // 先清理舊檔案
        const command = ffmpeg();

        // 依序輸入所有待合併檔案
        concatFiles.forEach(file => {
          command.input(file);
        });

        // 執行無損合併
        command.concat(finalOutput)
            .on('start', () => console.log('合併中，請稍候...'))
            .on('error', (err) => {
                console.error('ffmpeg 發生錯誤:', err.message);
                cleanup(cleanupFiles);
            })
            .on('end', () => {
                console.log('🎉 恭喜！中日文音訊已完美儲存為: ' + __outputFile);
                cleanup(cleanupFiles);
                console.log('正在關閉程式...');
                process.exit(0); // 順利完成後安全退出 (傳回狀態碼 0)
            });

    } catch (error) {
        console.error("執行失敗:", error);
        cleanup(tempFiles);
    }
}

/**
 * 清除暫存檔
 */
function cleanup(files) {
    files.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
    });
}

main();