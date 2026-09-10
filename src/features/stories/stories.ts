import type { KnowledgeStage } from "@prisma/client";

export type CuratedStory = {
  slug: string;
  title: string;
  category: string;
  stage?: KnowledgeStage;
  summary: string;
  content: string;
  durationMinutes?: number;
};

// Original text authored for this app. The three "Cổ tích" entries are this
// app's own condensed retelling of well-known Vietnamese public-domain folk
// legends (plot only, not any specific app's wording); the "Thơ"/"Đồng dao"
// entries are original short verses written for this feature, not quotes of
// any specific traditional or copyrighted rhyme.
export const curatedStories: CuratedStory[] = [
  {
    slug: "su-tich-trau-cau",
    title: "Sự tích trầu cau",
    category: "Cổ tích",
    summary:
      "Câu chuyện cổ tích giải thích vì sao trầu, cau và vôi luôn đi cùng nhau trong phong tục cưới hỏi của người Việt.",
    content: `Ngày xưa có hai anh em nhà họ Cao giống nhau như đúc, tình cảm gắn bó không rời. Người anh lấy vợ, tuy đã có gia đình riêng nhưng em vẫn một lòng nhường nhịn, quý mến anh chị.

Vì một hiểu lầm nhỏ, người em buồn bã bỏ nhà ra đi. Đi mãi đến bên một con suối, kiệt sức, em hóa thành tảng đá vôi trắng.

Người anh đi tìm em, đến bên con suối cũng kiệt sức mà mất, hóa thành cây cau mọc thẳng bên tảng đá.

Người vợ đi tìm chồng, đến nơi ôm lấy cây cau khóc thương, cũng hóa thành cây trầu leo quấn quanh thân cau.

Về sau, có người nếm thử lá trầu cùng quả cau chấm với vôi, thấy vị cay nồng, ấm áp, môi đỏ tươi như tình nghĩa thắm thiết. Từ đó, trầu - cau - vôi trở thành lễ vật không thể thiếu trong cưới hỏi, nhắc con cháu về tình nghĩa vợ chồng, anh em bền chặt.`,
    durationMinutes: 3,
  },
  {
    slug: "su-tich-banh-chung-banh-giay",
    title: "Sự tích bánh chưng bánh giầy",
    category: "Cổ tích",
    summary:
      "Vì sao ngày Tết người Việt gói bánh chưng vuông, bánh giầy tròn để dâng lên tổ tiên.",
    content: `Vua Hùng thứ sáu về già muốn truyền ngôi, bèn gọi các hoàng tử đến và ra điều kiện: ai tìm được lễ vật ý nghĩa nhất dâng lên tổ tiên trong ngày đầu năm sẽ được nối ngôi.

Các hoàng tử đua nhau tìm của ngon vật lạ khắp núi rừng, biển cả. Riêng hoàng tử thứ mười tám tên Lang Liêu, nhà nghèo, chỉ có lúa gạo, đậu xanh, thịt lợn trong nhà.

Một đêm, Lang Liêu mộng thấy có vị thần bảo: gạo là quý nhất, nuôi sống con người. Chàng bèn lấy gạo nếp gói thành hình vuông tượng trưng cho đất, gọi là bánh chưng; lại giã xôi nặn thành hình tròn tượng trưng cho trời, gọi là bánh giầy.

Vua Hùng nếm thử, thấy bánh vừa ngon vừa mang ý nghĩa biết ơn trời đất, biết ơn hạt gạo nuôi dân, liền truyền ngôi cho Lang Liêu. Từ đó, bánh chưng bánh giầy trở thành món không thể thiếu mỗi dịp Tết đến.`,
    durationMinutes: 3,
  },
  {
    slug: "su-tich-qua-dua-hau",
    title: "Sự tích quả dưa hấu",
    category: "Cổ tích",
    summary:
      "Câu chuyện về chàng Mai An Tiêm bị đày ra đảo hoang và tìm ra giống dưa hấu đỏ ngọt.",
    content: `Mai An Tiêm là con nuôi được vua Hùng yêu quý, nhưng vì một lời nói vô tình mà bị đày ra đảo hoang cùng vợ con, chỉ mang theo ít gạo và một con dao.

Ở đảo hoang, chàng không nản lòng mà dựng nhà, trồng trọt. Một hôm, có đàn chim lạ bay qua thả xuống những hạt đen nhỏ. Chàng đem gieo thử, chẳng bao lâu mọc thành dây leo, ra quả tròn vỏ xanh.

Chàng bổ thử, thấy ruột quả đỏ tươi, mọng nước, vị ngọt mát. Mai An Tiêm đặt tên là dưa hấu, khắc tên mình lên vỏ quả rồi thả xuống biển, nhờ sóng đưa vào đất liền cho thuyền buôn nhặt được.

Tin lành đồn xa, vua Hùng nghe chuyện, biết con nuôi vẫn kiên cường sống tốt giữa gian khó, liền cho đón gia đình Mai An Tiêm trở về. Giống dưa hấu từ đó được nhân rộng khắp nơi, trở thành loại quả quen thuộc mỗi mùa hè.`,
    durationMinutes: 3,
  },
  {
    slug: "vang-trang-cua-be",
    title: "Vầng trăng của bé",
    category: "Thơ",
    stage: "INFANT_3_6_MONTHS",
    summary: "Bài thơ ngắn ru bé ngắm trăng trước giờ đi ngủ.",
    content: `Trăng tròn như đĩa bạc,
Treo trên nóc nhà ai,
Bé nằm trong nôi nhỏ,
Mắt tròn nhìn ra ngoài.

Trăng ơi trăng có lạnh,
Sao trăng sáng một mình?
Bé có mẹ bên cạnh,
Ầu ơ giấc mộng lành.

Trăng khuất sau đám mây,
Bé khép đôi mi khẽ,
Ngủ ngoan nhé, ngủ say,
Mai lại đón nắng về.`,
    durationMinutes: 1,
  },
  {
    slug: "be-va-chu-ga-con",
    title: "Bé và chú gà con",
    category: "Đồng dao",
    stage: "TODDLER",
    summary: "Đồng dao vui nhộn về chú gà con tập gáy, dễ hát theo cho bé.",
    content: `Gà con bé xíu,
Lông vàng như tơ,
Chạy quanh sân nhỏ,
Chiếp chiếp gọi mẹ.

Bé cười khanh khách,
Vẫy tay chào gà,
Gà con giật mình,
Chạy vào ổ rơm.

Mẹ gà xòe cánh,
Ôm con vào lòng,
Bé cũng rúc rích,
Ôm mẹ ngủ ngon.`,
    durationMinutes: 1,
  },
  {
    slug: "di-cho-cung-me",
    title: "Đi chợ cùng mẹ",
    category: "Đồng dao",
    stage: "TODDLER",
    summary: "Đồng dao đếm số vui tươi khi bé tưởng tượng cùng mẹ đi chợ.",
    content: `Một quả cà,
Hai quả cà,
Ba quả cà,
Mẹ mua về nấu canh.

Bốn con cá,
Năm con cá,
Sáu con cá,
Bơi trong giỏ mẹ mang.

Bảy, tám, chín,
Mười trái chín,
Đầy giỏ mẹ,
Bé vui theo mẹ về.`,
    durationMinutes: 1,
  },
  {
    slug: "gio-ru-canh-tre",
    title: "Gió ru cành tre",
    category: "Thơ",
    summary:
      "Bài thơ nhẹ nhàng với hình ảnh gió và tre, thích hợp đọc trước giờ ngủ trưa.",
    content: `Gió về khe khẽ,
Ru cành tre xanh,
Lá tre xào xạc,
Như tiếng mẹ ru.

Bé nằm trong võng,
Kẽo kẹt nhịp đưa,
Mắt bé díu lại,
Theo làn gió qua.

Ngủ ngoan bé nhé,
Có gió, có tre,
Có tay mẹ vỗ,
Giấc trưa êm đềm.`,
    durationMinutes: 1,
  },
];
