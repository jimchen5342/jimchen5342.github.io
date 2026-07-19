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
const vocabularyList1 = () => {
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


const vocabularyList2 = () => {
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
function generateSilence(silencePath1000, durationSec = 0.5) {
  return new Promise((resolve, reject) => {
    // Use raw PCM zeros from /dev/zero to avoid relying on lavfi
    // ffmpeg command equivalent:
    // ffmpeg -f s16le -ar 24000 -ac 1 -i /dev/zero -t <duration> -acodec libmp3lame <silencePath1000>
    ffmpeg()
      .input('/dev/zero')
      .inputOptions(['-f s16le', '-ar 24000', '-ac 1'])
      .outputOptions(['-t', String(durationSec)])
      .audioCodec('libmp3lame')
      .audioChannels(1)
      .audioFrequency(24000)
      .format('mp3')
      .save(silencePath1000)
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });
}

/**
 * 核心主程式
 */
async function main() {
    vocabularyList = vocabularyList2();
    const concatFiles = [];
    const cleanupFiles = [];
    const silencePath1000 = path.join(__dirname, `silence_1000.mp3`);
    let silenceCreated1000 = false;
    let addSilence1000 = async () => {
      // 生成 1 秒靜音檔並加入合併清單（僅建立一次， 可重複加入以產生多個間隔）
      try {
        if (!silenceCreated1000) {
          if (!fs.existsSync(silencePath1000)) {
            console.log('正在產生 1 秒靜音檔...');
            await generateSilence(silencePath1000, 1);
          }
          silenceCreated1000 = true;
          if (!cleanupFiles.includes(silencePath1000)) cleanupFiles.push(silencePath1000);
        }
        concatFiles.push(silencePath1000);
      } catch (err) {
        console.error('產生或加入靜音檔失敗', err);
      }
    };

    const silencePath500 = path.join(__dirname, `silence_500.mp3`);
    let silenceCreated500 = false;
    let addSilence500 = async () => {
      // 生成 0.5 秒靜音檔並加入合併清單（僅建立一次， 可重複加入以產生多個間隔）
      try {
        if (!silenceCreated500) {
          if (!fs.existsSync(silencePath500)) {
            console.log('正在產生 0.5 秒靜音檔...');
            await generateSilence(silencePath500, 0.5);
          }
          silenceCreated500 = true;
          if (!cleanupFiles.includes(silencePath500)) cleanupFiles.push(silencePath500);
        }
        concatFiles.push(silencePath500);
      } catch (err) {
        console.error('產生或加入靜音檔失敗', err);
      }
    };
    
    console.log("🔍 開始讀取 JSON 陣列並依序生成語音...");
    try {
        let fileIndex = 0;

        for (const item of vocabularyList) {
            // --- A. 合成日文 (kana) ---
            if (item.kana) {
              let jaPath = path.join(__dirname, `temp_${fileIndex++}.mp3`);
              concatFiles.push(jaPath);
              if (!cleanupFiles.includes(jaPath)) cleanupFiles.push(jaPath);
              console.log(`[JA] 正在合成: "${item.kana}"`);
              await saveSpeechToFile(item.kana, JA_VOICE_MALE, jaPath);
              await addSilence500(); // 加入 0.5 秒靜音

              jaPath = path.join(__dirname, `temp_${fileIndex++}.mp3`);
              concatFiles.push(jaPath);
              if (!cleanupFiles.includes(jaPath)) cleanupFiles.push(jaPath);
              console.log(`[JA] 正在合成: "${item.kana}"`);
              await saveSpeechToFile(item.kana, JA_VOICE, jaPath);
              await addSilence500(); // 加入 0.5 秒靜音
            }

            // --- B. 合成中文 (mean) ---
            if (item.mean) {
                const zhPath = path.join(__dirname, `temp_${fileIndex++}.mp3`);
                concatFiles.push(zhPath);
                if (!cleanupFiles.includes(zhPath)) cleanupFiles.push(zhPath);
                console.log(`[ZH] 正在合成: "${item.mean}"`);
                await saveSpeechToFile(item.mean, ZH_VOICE, zhPath);
            }
            await addSilence1000(); // 加入 1 秒靜音
        }
        await addSilence1000(); // 加入 1 秒靜音
        await addSilence1000(); // 加入 1 秒靜音

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