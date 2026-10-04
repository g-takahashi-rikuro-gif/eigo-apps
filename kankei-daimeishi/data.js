// ===== お題データ =====
// お題を追加・変更するときは、このファイルだけを編集します。
// 書き方:
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
  { theme: "場所・地名", nameJa: "京都", nameEn: "Kyoto", emoji: "⛩️", image: "", hints: ["old", "temple", "visit"] },
  { theme: "場所・地名", nameJa: "図書館", nameEn: "library", emoji: "📚", image: "", hints: ["book", "quiet", "borrow"] },
  { theme: "場所・地名", nameJa: "動物園", nameEn: "zoo", emoji: "🦁", image: "", hints: ["animal", "see", "many"] },
  { theme: "場所・地名", nameJa: "水族館", nameEn: "aquarium", emoji: "🐠", image: "", hints: ["fish", "swim", "see"] },
  { theme: "場所・地名", nameJa: "公園", nameEn: "park", emoji: "🌳", image: "images/park.png", hints: ["play", "tree", "children"] },
  { theme: "場所・地名", nameJa: "大阪", nameEn: "Osaka", emoji: "🏙️", image: "images/osaka.png", hints: ["big", "city", "delicious"] },
  { theme: "場所・地名", nameJa: "愛知", nameEn: "Aichi", emoji: "🏯", image: "images/aichi.png", hints: ["Nagoya", "castle", "live"] },

  { theme: "物", nameJa: "傘", nameEn: "umbrella", emoji: "☂️", image: "", hints: ["rain", "carry", "wet"] },
  { theme: "物", nameJa: "自転車", nameEn: "bicycle", emoji: "🚲", image: "", hints: ["ride", "wheel", "pedal"] },
  { theme: "物", nameJa: "冷蔵庫", nameEn: "refrigerator", emoji: "🧊", image: "images/refrigerator.png", hints: ["cold", "food", "kitchen"] },
  { theme: "物", nameJa: "辞書", nameEn: "dictionary", emoji: "📖", image: "", hints: ["word", "meaning", "use"] },
  { theme: "物", nameJa: "電子レンジ", nameEn: "microwave", emoji: "♨️", image: "images/microwave.png", hints: ["warm", "kitchen", "heat"] },

  { theme: "食べ物", nameJa: "寿司", nameEn: "sushi", emoji: "🍣", image: "", hints: ["rice", "fish", "Japanese"] },
  { theme: "食べ物", nameJa: "アイスクリーム", nameEn: "ice cream", emoji: "🍦", image: "", hints: ["cold", "sweet", "summer"] },
  { theme: "食べ物", nameJa: "ラーメン", nameEn: "ramen", emoji: "🍜", image: "", hints: ["noodles", "soup", "hot"] },
  { theme: "食べ物", nameJa: "たこ焼き", nameEn: "takoyaki", emoji: "🐙", image: "", hints: ["round", "Osaka", "sauce"] },

  { theme: "動物", nameJa: "パンダ", nameEn: "panda", emoji: "🐼", image: "", hints: ["bamboo", "black", "China"] },
  { theme: "動物", nameJa: "ゾウ", nameEn: "elephant", emoji: "🐘", image: "", hints: ["nose", "big", "Africa"] },
  { theme: "動物", nameJa: "ペンギン", nameEn: "penguin", emoji: "🐧", image: "", hints: ["bird", "swim", "cold"] },

  { theme: "人・職業", nameJa: "先生", nameEn: "teacher", emoji: "🧑‍🏫", image: "", hints: ["teach", "class", "students"] },
  { theme: "人・職業", nameJa: "メッシ", nameEn: "Messi", emoji: "⚽", image: "images/messi.webp", hints: ["soccer", "Argentina", "goal"] },
  { theme: "人・職業", nameJa: "ウサイン・ボルト", nameEn: "Usain Bolt", emoji: "🏃", image: "images/bolt.png", hints: ["run", "fast", "Jamaica"] },

  { theme: "キャラクター", nameJa: "ドラえもん", nameEn: "Doraemon", emoji: "🤖", image: "images/doraemon.png", hints: ["robot", "future", "pocket"] },
  { theme: "キャラクター", nameJa: "ピカチュウ", nameEn: "Pikachu", emoji: "⚡", image: "images/pikachu.png", hints: ["yellow", "electric", "Pokemon"] },
  { theme: "キャラクター", nameJa: "トトロ", nameEn: "Totoro", emoji: "🌲", image: "images/totoro.png", hints: ["forest", "big", "Ghibli"] }
];
