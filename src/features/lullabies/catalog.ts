export const LULLABY_AGES = [
  {
    id: "0-6",
    label: "0–6 tháng",
    description: "Một vài giai điệu nhẹ để bố mẹ nghe và hát cùng con.",
  },
  {
    id: "6-12",
    label: "6–12 tháng",
    description:
      "Những bài có giai điệu lặp lại để gia đình chọn bài quen thuộc.",
  },
  {
    id: "1-3",
    label: "1–3 tuổi",
    description: "Lời chúc ngủ ngon và những bài bố mẹ có thể hát cùng bé.",
  },
  {
    id: "3-plus",
    label: "Từ 3 tuổi",
    description:
      "Cùng con chọn bài yêu thích cho khoảng thời gian trước khi ngủ.",
  },
] as const;
export type LullabyAge = (typeof LULLABY_AGES)[number]["id"];
export type Lullaby = {
  id: string;
  title: string;
  subtitle: string;
  publisher: string;
  language: "Tiếng Việt" | "Không lời";
  audioSrc: string;
  sourceUrl: string;
  license: string;
  ages: LullabyAge[];
};

// Physical folders organize storage; age tags are family suggestions, not clinical restrictions.
// Recording provenance and conversion details: public/audio/lullabies/sources.json.
export const LULLABIES: Lullaby[] = [
  {
    "id": "ru-nam-bo-U5dGCf-vlJk",
    "title": "Chiều chiều chim vịt kêu chiều",
    "subtitle": "Hát ru Nam Bộ truyền thống · Giọng ru mộc với đờn kìm.",
    "publisher": "Song Oanh (hát), Sáu Hưng (đờn kìm) · Cultura Fish",
    "language": "Tiếng Việt",
    "audioSrc": "/audio/lullabies/0-6-thang/ru-chieu-chieu-chim-vit-keu-chieu.mp3",
    "sourceUrl": "https://ichlinks.com/archive/materials/audiosV.do?nation=VN&ichDataUid=13878355160478610312",
    "license": "CC BY-NC",
    "ages": [
      "0-6",
      "6-12",
      "1-3",
      "3-plus"
    ]
  },
  {
    "id": "ru-nam-bo-F54czTq0W_w",
    "title": "Sông sâu sào vắn khó dò",
    "subtitle": "Hát ru Nam Bộ truyền thống · Giọng ru mộc với đờn kìm.",
    "publisher": "Song Oanh (hát), Sáu Hưng (đờn kìm) · Cultura Fish",
    "language": "Tiếng Việt",
    "audioSrc": "/audio/lullabies/1-3-tuoi/ru-song-sau-sao-van-kho-do.mp3",
    "sourceUrl": "https://ichlinks.com/archive/materials/audiosV.do?nation=VN&ichDataUid=13878366473447631738",
    "license": "CC BY-NC",
    "ages": [
      "0-6",
      "6-12",
      "1-3",
      "3-plus"
    ]
  },
  {
    "id": "ru-nam-bo-BaC-JJoPzLA",
    "title": "Chim đa đa đậu nhánh đa đa",
    "subtitle": "Hát ru Nam Bộ truyền thống · Giọng ru mộc với đờn kìm.",
    "publisher": "Song Oanh (hát), Sáu Hưng (đờn kìm) · Cultura Fish",
    "language": "Tiếng Việt",
    "audioSrc": "/audio/lullabies/1-3-tuoi/ru-chim-da-da-dau-nhanh-da-da.mp3",
    "sourceUrl": "https://ichlinks.com/archive/materials/audiosV.do?nation=VN&ichDataUid=13878364015150625990",
    "license": "CC BY-NC",
    "ages": [
      "0-6",
      "6-12",
      "1-3",
      "3-plus"
    ]
  },
  {
    "id": "ru-nam-bo-iaRhEkSk26M",
    "title": "Chiều chiều ông Lữ đi câu",
    "subtitle": "Hát ru Nam Bộ truyền thống · Giọng ru mộc với đờn kìm.",
    "publisher": "Song Oanh (hát), Sáu Hưng (đờn kìm) · Cultura Fish",
    "language": "Tiếng Việt",
    "audioSrc": "/audio/lullabies/3-tuoi-tro-len/ru-chieu-chieu-ong-lu-di-cau.mp3",
    "sourceUrl": "https://ichlinks.com/archive/materials/audiosV.do?nation=VN&ichDataUid=13878362191440616073",
    "license": "CC BY-NC",
    "ages": [
      "0-6",
      "6-12",
      "1-3",
      "3-plus"
    ]
  },
  {
    "id": "ru-nam-bo-o1KOpJdpod4",
    "title": "Má ơi con vịt nó chết chìm",
    "subtitle": "Hát ru Nam Bộ truyền thống · Giọng ru mộc với đờn kìm.",
    "publisher": "Song Oanh (hát), Sáu Hưng (đờn kìm) · Cultura Fish",
    "language": "Tiếng Việt",
    "audioSrc": "/audio/lullabies/6-12-thang/ru-ma-oi-con-vit.mp3",
    "sourceUrl": "https://ichlinks.com/archive/materials/audiosV.do?nation=VN&ichDataUid=13878365469876630021",
    "license": "CC BY-NC",
    "ages": [
      "0-6",
      "6-12",
      "1-3",
      "3-plus"
    ]
  },
  {
    "id": "edo-lullaby",
    "title": "Edo Lullaby",
    "subtitle": "Giai điệu ru Nhật Bản, bản không lời ngắn.",
    "publisher": "Akaniji",
    "language": "Không lời",
    "audioSrc": "/audio/lullabies/0-6-thang/edo-lullaby.mp3",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Edo_Lullaby.ogg",
    "license": "CC BY 3.0",
    "ages": [
      "0-6",
      "6-12"
    ]
  },
  {
    "id": "irish-lullaby",
    "title": "Irish Lullaby",
    "subtitle": "Bản hòa tấu kèn gỗ của Richard Kearns.",
    "publisher": "Richard Kearns",
    "language": "Không lời",
    "audioSrc": "/audio/lullabies/6-12-thang/irish-lullaby.mp3",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Irish_lullaby.ogg",
    "license": "CC BY 3.0",
    "ages": [
      "0-6",
      "6-12",
      "1-3",
      "3-plus"
    ]
  },
  {
    "id": "another-lullaby",
    "title": "Another Lullaby",
    "subtitle": "Một giai điệu ru ngủ của Antti Luode.",
    "publisher": "Antti Luode",
    "language": "Không lời",
    "audioSrc": "/audio/lullabies/1-3-tuoi/another-lullaby.mp3",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Another_Lullaby_(Antti_Luode).mp3",
    "license": "CC BY 3.0",
    "ages": [
      "1-3",
      "3-plus"
    ]
  },
  {
    "id": "brahms-hop-nhac",
    "title": "Brahms · Hộp nhạc ru ngủ",
    "subtitle": "Guten Abend, gute Nacht · Giai điệu từ hộp nhạc.",
    "publisher": "stephan",
    "language": "Không lời",
    "audioSrc": "/audio/lullabies/0-6-thang/brahms-hop-nhac.mp3",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Lullaby_wound_up_clock_guten_abend_gute_nacht.ogg",
    "license": "Public domain",
    "ages": [
      "0-6",
      "6-12",
      "1-3"
    ]
  },
  {
    "id": "twinkle-twinkle",
    "title": "Twinkle Twinkle Little Star",
    "subtitle": "Giai điệu ngôi sao quen thuộc, bản không lời.",
    "publisher": "CambridgeBayWeather",
    "language": "Không lời",
    "audioSrc": "/audio/lullabies/3-tuoi-tro-len/twinkle-twinkle.mp3",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Twinkle_Twinkle_Little_Star_plain.ogg",
    "license": "Public domain",
    "ages": [
      "6-12",
      "1-3",
      "3-plus"
    ]
  }
];

export function lullabyAgeForBaby(
  birth: Date,
  now = new Date(),
  timezone = "Asia/Ho_Chi_Minh",
): LullabyAge {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: timezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const part = (name: string) =>
    Number(parts.find((item) => item.type === name)?.value);
  const year = part("year"),
    month = part("month"),
    day = part("day");
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const anniversaryDay = Math.min(birth.getUTCDate(), lastDay);
  const months = Math.max(
    0,
    (year - birth.getUTCFullYear()) * 12 +
      month -
      birth.getUTCMonth() -
      1 -
      Number(day < anniversaryDay),
  );
  return months < 6
    ? "0-6"
    : months < 12
      ? "6-12"
      : months < 36
        ? "1-3"
        : "3-plus";
}
export function lullabiesForAge(age: LullabyAge | "all") {
  return age === "all"
    ? LULLABIES
    : LULLABIES.filter((track) => track.ages.includes(age));
}
