// ===== お題データ =====
// お題を追加・変更するときは、このファイルだけを編集します。
// 書き方:
//   { theme: "テーマ名", nameJa: "日本語名", nameEn: "英語名", emoji: "絵文字", image: "", hints: ["単語1", "単語2", "単語3"] }
// ・image に画像ファイルのパス(例: "images/kyoto.png")を入れると、絵文字より画像が優先されます。
// ・hints には、お題の答えになる英単語は入れないでください。
// ・新しいテーマを作りたいときは、THEMES にも名前を足してください。

const THEMES = [
  { name: "場所・地名", icon: "🗺️", color: "#ffd8d8" },
  { name: "物", icon: "🎒", color: "#ffe9c2" },
  { name: "食べ物", icon: "🍙", color: "#fff6b8" },
  { name: "動物", icon: "🐾", color: "#d6f5d6" },
  { name: "人・職業", icon: "🧑‍🏫", color: "#d3ecff" },
  { name: "キャラクター", icon: "⭐", color: "#e6dcff" }
];

const TOPICS = [
  // ---- 場所・地名 ----
  { theme: "場所・地名", nameJa: "京都", nameEn: "Kyoto", emoji: "⛩️", image: "", hints: ["old", "temple", "visit"] },
  { theme: "場所・地名", nameJa: "学校", nameEn: "school", emoji: "🏫", image: "", hints: ["study", "teacher", "friends"] },
  { theme: "場所・地名", nameJa: "図書館", nameEn: "library", emoji: "📚", image: "", hints: ["book", "quiet", "borrow"] },
  { theme: "場所・地名", nameJa: "動物園", nameEn: "zoo", emoji: "🦁", image: "", hints: ["animal", "see", "many"] },
  { theme: "場所・地名", nameJa: "空港", nameEn: "airport", emoji: "🛫", image: "", hints: ["plane", "fly", "travel"] },
  { theme: "場所・地名", nameJa: "コンビニ", nameEn: "convenience store", emoji: "🏪", image: "", hints: ["buy", "night", "food"] },
  { theme: "場所・地名", nameJa: "富士山", nameEn: "Mt. Fuji", emoji: "🗻", image: "", hints: ["mountain", "snow", "climb"] },
  { theme: "場所・地名", nameJa: "水族館", nameEn: "aquarium", emoji: "🐠", image: "", hints: ["fish", "swim", "see"] },
  { theme: "場所・地名", nameJa: "病院", nameEn: "hospital", emoji: "🏥", image: "", hints: ["sick", "nurse", "help"] },
  { theme: "場所・地名", nameJa: "駅", nameEn: "station", emoji: "🚉", image: "", hints: ["train", "wait", "ticket"] },
  { theme: "場所・地名", nameJa: "公園", nameEn: "park", emoji: "🌳", image: "images/park.png", hints: ["play", "tree", "children"] },
  { theme: "場所・地名", nameJa: "沖縄", nameEn: "Okinawa", emoji: "🏝️", image: "", hints: ["island", "sea", "warm"] },
  { theme: "場所・地名", nameJa: "大阪", nameEn: "Osaka", emoji: "🏙️", image: "images/osaka.png", hints: ["big", "city", "delicious"] },
  { theme: "場所・地名", nameJa: "遊園地", nameEn: "amusement park", emoji: "🎡", image: "", hints: ["ride", "fun", "enjoy"] },
  { theme: "場所・地名", nameJa: "映画館", nameEn: "movie theater", emoji: "🎬", image: "", hints: ["movie", "watch", "popcorn"] },
  { theme: "場所・地名", nameJa: "東京", nameEn: "Tokyo", emoji: "🗼", image: "", hints: ["capital", "tower", "crowded"] },
  { theme: "場所・地名", nameJa: "愛知", nameEn: "Aichi", emoji: "🏯", image: "images/aichi.png", hints: ["Nagoya", "castle", "live"] },
  { theme: "場所・地名", nameJa: "北海道", nameEn: "Hokkaido", emoji: "⛄", image: "", hints: ["north", "cold", "snow"] },

  // ---- 物 ----
  { theme: "物", nameJa: "傘", nameEn: "umbrella", emoji: "☂️", image: "", hints: ["rain", "carry", "wet"] },
  { theme: "物", nameJa: "スマートフォン", nameEn: "smartphone", emoji: "📱", image: "", hints: ["phone", "game", "message"] },
  { theme: "物", nameJa: "掛け時計", nameEn: "wall clock", emoji: "🕰️", image: "", hints: ["time", "wall", "hour"] },
  { theme: "物", nameJa: "自転車", nameEn: "bicycle", emoji: "🚲", image: "", hints: ["ride", "wheel", "pedal"] },
  { theme: "物", nameJa: "冷蔵庫", nameEn: "refrigerator", emoji: "🧊", image: "images/refrigerator.png", hints: ["cold", "food", "kitchen"] },
  { theme: "物", nameJa: "辞書", nameEn: "dictionary", emoji: "📖", image: "", hints: ["word", "meaning", "use"] },
  { theme: "物", nameJa: "カメラ", nameEn: "camera", emoji: "📷", image: "", hints: ["photo", "take", "picture"] },
  { theme: "物", nameJa: "リュック", nameEn: "backpack", emoji: "🎒", image: "", hints: ["carry", "back", "school"] },
  { theme: "物", nameJa: "メガネ", nameEn: "glasses", emoji: "👓", image: "", hints: ["see", "wear", "eyes"] },
  { theme: "物", nameJa: "野球", nameEn: "baseball", emoji: "⚾", image: "", hints: ["bat", "ball", "team"] },
  { theme: "物", nameJa: "ピアノ", nameEn: "piano", emoji: "🎹", image: "", hints: ["music", "play", "keys"] },
  { theme: "物", nameJa: "電子レンジ", nameEn: "microwave", emoji: "♨️", image: "images/microwave.png", hints: ["warm", "kitchen", "heat"] },
  { theme: "物", nameJa: "歯ブラシ", nameEn: "toothbrush", emoji: "🪥", image: "", hints: ["teeth", "clean", "morning"] },
  { theme: "物", nameJa: "カレンダー", nameEn: "calendar", emoji: "📅", image: "", hints: ["date", "month", "day"] },
  { theme: "物", nameJa: "マスク", nameEn: "mask", emoji: "😷", image: "", hints: ["wear", "face", "cold"] },

  // ---- 食べ物 ----
  { theme: "食べ物", nameJa: "寿司", nameEn: "sushi", emoji: "🍣", image: "", hints: ["rice", "fish", "Japanese"] },
  { theme: "食べ物", nameJa: "カレー", nameEn: "curry", emoji: "🍛", image: "", hints: ["spicy", "rice", "eat"] },
  { theme: "食べ物", nameJa: "ピザ", nameEn: "pizza", emoji: "🍕", image: "", hints: ["cheese", "round", "Italy"] },
  { theme: "食べ物", nameJa: "アイスクリーム", nameEn: "ice cream", emoji: "🍦", image: "", hints: ["cold", "sweet", "summer"] },
  { theme: "食べ物", nameJa: "ラーメン", nameEn: "ramen", emoji: "🍜", image: "", hints: ["noodles", "soup", "hot"] },
  { theme: "食べ物", nameJa: "納豆", nameEn: "natto", emoji: "🫘", image: "", hints: ["sticky", "smell", "breakfast"] },
  { theme: "食べ物", nameJa: "たこ焼き", nameEn: "takoyaki", emoji: "🐙", image: "", hints: ["round", "Osaka", "sauce"] },
  { theme: "食べ物", nameJa: "ケーキ", nameEn: "cake", emoji: "🍰", image: "", hints: ["birthday", "sweet", "bake"] },

  // ---- 動物 ----
  { theme: "動物", nameJa: "パンダ", nameEn: "panda", emoji: "🐼", image: "", hints: ["bamboo", "black", "China"] },
  { theme: "動物", nameJa: "ゾウ", nameEn: "elephant", emoji: "🐘", image: "", hints: ["nose", "big", "Africa"] },
  { theme: "動物", nameJa: "ペンギン", nameEn: "penguin", emoji: "🐧", image: "", hints: ["bird", "swim", "cold"] },
  { theme: "動物", nameJa: "キリン", nameEn: "giraffe", emoji: "🦒", image: "", hints: ["neck", "tall", "Africa"] },

  // ---- 人・職業 ----
  { theme: "人・職業", nameJa: "先生", nameEn: "teacher", emoji: "🧑‍🏫", image: "", hints: ["teach", "class", "students"] },
  { theme: "人・職業", nameJa: "医者", nameEn: "doctor", emoji: "🧑‍⚕️", image: "", hints: ["sick", "hospital", "help"] },
  { theme: "人・職業", nameJa: "消防士", nameEn: "firefighter", emoji: "🚒", image: "", hints: ["fire", "truck", "rescue"] },
  { theme: "人・職業", nameJa: "メッシ", nameEn: "Messi", emoji: "⚽", image: "images/messi.webp", hints: ["soccer", "Argentina", "goal"] },
  { theme: "人・職業", nameJa: "ウサイン・ボルト", nameEn: "Usain Bolt", emoji: "🏃", image: "images/bolt.png", hints: ["run", "fast", "Jamaica"] },

  // ---- キャラクター ----
  { theme: "キャラクター", nameJa: "ドラえもん", nameEn: "Doraemon", emoji: "🤖", image: "images/doraemon.png", hints: ["robot", "future", "pocket"] },
  { theme: "キャラクター", nameJa: "ピカチュウ", nameEn: "Pikachu", emoji: "⚡", image: "images/pikachu.png", hints: ["yellow", "electric", "Pokemon"] },
  { theme: "キャラクター", nameJa: "トトロ", nameEn: "Totoro", emoji: "🌲", image: "images/totoro.png", hints: ["forest", "big", "Ghibli"] }
];
