/**
 * カテゴリー別の励ましメッセージ（100個）
 */

export type MessageCategory = 'beauty' | 'achievement' | 'support' | 'health' | 'humor';

export interface EncourageMessage {
  id: number;
  category: MessageCategory;
  text: string;
}

// 美容・可愛さ（20個）
const beautyMessages: string[] = [
  '今日も可愛く走れたね！きっと輝いてたよ',
  'ランニング後の君、最高に美しい！',
  '汗も輝きの一部。今日もキラキラしてるよ',
  '走った後の笑顔、とっても素敵だよ！',
  '健康的な美しさ、最高！',
  'ランナーズハイで顔色も最高だね',
  '今日のランニングで、また一段と綺麗になったね！',
  '美は一日にしてならず。今日も積み重ねたね！',
  'スポーツ美人、まさに君のこと！',
  '走った後のキラキラした瞳、素敵すぎる',
  'ランニングは最高の美容液だね！',
  '汗をかくたびに、綺麗になってる気がする！',
  '今日も可愛さMAX！走った後の君が一番好き',
  'こんなに頑張る君、美しすぎる！',
  'ランニングウェアも似合ってる！',
  '健康美、手に入れてるね！',
  '走る姿、絵になるよ！',
  'スポーティーな君、素敵すぎ！',
  '今日も元気と美しさをチャージ完了！',
  'ランニングは最強の自分磨き',
];

// 達成・称賛（20個）
const achievementMessages: string[] = [
  'すごい！今日もやり遂げたね！',
  '完走おめでとう！君は最高だ！',
  'また一歩、目標に近づいたね！',
  '素晴らしい！その調子で続けよう！',
  '今日の自分を誇りに思って！',
  'やった！また記録が増えたね',
  '君の努力、ちゃんと見てるよ！',
  '毎日の積み重ねが、すごいことになってる！',
  'この調子なら、どんな目標も達成できる！',
  '今日も自分を超えた！かっこいい！',
  '完走したという事実が、すごいこと！',
  '一歩一歩が、大きな成果になってるよ！',
  '君の頑張り、本当に尊敬する！',
  '今日の自分に、胸を張ろう！',
  'また一つ、強くなったね',
  'この努力は、絶対に裏切らない！',
  '記録更新だ！おめでとう',
  '今日の挑戦、見事にクリア！',
  '君の継続力、素晴らしい！',
  'やったね！また一つ成長した！',
];

// 応援・励まし（20個）
const supportMessages: string[] = [
  '今日も頑張ったね！明日も応援してるよ！',
  'いつも君を応援してる。次も楽しみ！',
  '疲れた？でも、ちゃんと完走したね。えらい！',
  'どんなペースでも、走り続けてる君が素敵！',
  '辛い時もあるけど、続けてるのがすごい！',
  '君なら、もっと上を目指せる！',
  'いつも応援してるからね！次も頑張ろう！',
  '一緒に走ってる気持ちだよ！',
  '君の努力、ずっと見守ってる',
  '今日も最後まで走り切った。すごいよ！',
  'ペースは関係ない。続けることが大事！',
  '明日の君は、今日より強い！',
  '辛い時こそ、成長のチャンス！',
  '君の挑戦、いつも応援してる',
  '一歩ずつでいい。前に進んでる！',
  '今日も走れた。それだけで素晴らしい！',
  '頑張りすぎないで。無理は禁物だよ！',
  '君のペースでいいんだよ',
  'また一緒に走ろうね！',
  '次はどんなランになるかな？楽しみ！',
];

// 健康・フィットネス（20個）
const healthMessages: string[] = [
  '体を動かすって、気持ちいいね！',
  '健康第一！今日もいい運動できたね！',
  'カロリー消費！代謝アップ！最高だね',
  '運動習慣、しっかり身についてる！',
  '体が喜んでるのが分かるね！',
  'ストレス発散！スッキリしたでしょ？',
  '健康な体は、何よりの財産だね',
  '今日も体を動かして、元気チャージ！',
  '運動後の爽快感、最高！',
  '体力づくり、順調だね！',
  '継続は力なり！健康への投資だね！',
  '今日も体に良いことしたね！',
  '運動は心にも効く！リフレッシュ完了！',
  '健康寿命を延ばしてる！素晴らしい！',
  '体の調子、良くなってきてない？',
  '有酸素運動、最高のデトックス！',
  '今日も健康レベルアップ！',
  '運動は最高の薬だね',
  '体が軽くなった気がしない？',
  '健康への第一歩、今日も踏み出したね！',
];

// ユーモア・元気（20個）
const humorMessages: string[] = [
  'お疲れ様！ご褒美に美味しいもの食べよう',
  '走った後のシャワー、最高に気持ちいいよね！',
  'よし！今日は自分にご褒美タイム！',
  'ランニング後のストレッチも忘れずにね～',
  '走った分、ちょっと多めに食べてもいいよね？',
  'お疲れ様！今日は早めに寝ようね',
  'ナイスラン！自分に拍手',
  '今日のMVPは、走り切った君だ！',
  'やったー！完走ボーナスポイント+100点！',
  'ランニング後のプロテイン、美味しく感じるよね！',
  '今日も無事に帰還！お疲れ様でした！',
  'よーし！これでまた強くなった！',
  '走った後のご飯、最高に美味しいよね',
  '今日の自分に、金メダルあげたい',
  'ランニングクリア！次のステージへ！',
  '完走記念にスイーツいっちゃう？',
  'よく頑張った！自分で自分を褒めよう！',
  '今日も無事故でゴール！安全第一！',
  'ランニング、レベルアップしたよ！',
  'おめでとう！また経験値が増えたね',
];

// 全メッセージを統合
export const encourageMessages: EncourageMessage[] = [
  ...beautyMessages.map((text, index) => ({
    id: index + 1,
    category: 'beauty' as MessageCategory,
    text,
  })),
  ...achievementMessages.map((text, index) => ({
    id: index + 21,
    category: 'achievement' as MessageCategory,
    text,
  })),
  ...supportMessages.map((text, index) => ({
    id: index + 41,
    category: 'support' as MessageCategory,
    text,
  })),
  ...healthMessages.map((text, index) => ({
    id: index + 61,
    category: 'health' as MessageCategory,
    text,
  })),
  ...humorMessages.map((text, index) => ({
    id: index + 81,
    category: 'humor' as MessageCategory,
    text,
  })),
];

/**
 * ランダムなメッセージを取得
 */
export function getRandomMessage(): EncourageMessage {
  const randomIndex = Math.floor(Math.random() * encourageMessages.length);
  return encourageMessages[randomIndex];
}

/**
 * カテゴリー別のランダムメッセージを取得
 */
export function getRandomMessageByCategory(category: MessageCategory): EncourageMessage {
  const filtered = encourageMessages.filter((msg) => msg.category === category);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex];
}
