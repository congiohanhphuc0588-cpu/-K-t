import { MCQQuestion, TrueFalseQuestion, DragCategory, DragItem, MatchingPair, FillBlankItem } from '../types';

// ==========================================
// TRÒ 1: TRẮC NGHIỆM KHÁCH QUAN NHIỀU LỰA CHỌN (MCQ)
// ==========================================
export const mcqQuestions: MCQQuestion[] = [
  {
    id: 'mcq-1',
    question: 'Phương pháp kí hiệu thường được dùng để biểu hiện các đối tượng địa lí có đặc điểm phân bố như thế nào?',
    context: 'Bài 2 - Mục 1: Phương pháp kí hiệu',
    options: [
      { key: 'A', text: 'Phân bố theo những điểm cụ thể, riêng lẻ' },
      { key: 'B', text: 'Phân bố phân tán, lẻ tẻ trên diện rộng' },
      { key: 'C', text: 'Phân bố thành từng vùng rộng lớn liên tục' },
      { key: 'D', text: 'Di chuyển theo các hướng và tuyến xác định' },
    ],
    correctAnswer: 'A',
    explanation: 'Phương pháp kí hiệu được dùng để biểu hiện các đối tượng phân bố theo những điểm cụ thể như sân bay, hải cảng, nhà máy, mỏ khoáng sản, đỉnh núi...'
  },
  {
    id: 'mcq-2',
    question: 'Để thể hiện hướng di chuyển của bão, dòng biển, các luồng di dân trên bản đồ, người ta sử dụng phương pháp nào?',
    context: 'Bài 2 - Mục 2: Phương pháp kí hiệu đường chuyển động',
    options: [
      { key: 'A', text: 'Phương pháp chấm điểm' },
      { key: 'B', text: 'Phương pháp kí hiệu đường chuyển động' },
      { key: 'C', text: 'Phương pháp bản đồ - biểu đồ' },
      { key: 'D', text: 'Phương pháp khoanh vùng' },
    ],
    correctAnswer: 'B',
    explanation: 'Phương pháp kí hiệu đường chuyển động dùng để biểu hiện sự di chuyển của các hiện tượng tự nhiên và kinh tế - xã hội (hướng gió, dòng biển, luồng di dân, các tuyến vận tải, bão...).'
  },
  {
    id: 'mcq-3',
    question: 'Phương pháp chấm điểm thường được dùng để biểu hiện đối tượng địa lí nào sau đây?',
    context: 'Bài 2 - Mục 3: Phương pháp chấm điểm',
    options: [
      { key: 'A', text: 'Các mỏ khoáng sản kim loại và nhiên liệu' },
      { key: 'B', text: 'Tuyến đường hàng không quốc tế' },
      { key: 'C', text: 'Sự phân bố dân cư nông thôn hoặc đàn gia súc' },
      { key: 'D', text: 'Cơ cấu kinh tế các vùng lãnh thổ' },
    ],
    correctAnswer: 'C',
    explanation: 'Phương pháp chấm điểm biểu hiện các đối tượng phân bố phân tán, lẻ tẻ như dân cư nông thôn, các điểm chăn nuôi gia súc, diện tích cây trồng bằng các điểm chấm có giá trị xác định.'
  },
  {
    id: 'mcq-4',
    question: 'Để thể hiện sản lượng lúa và diện tích trồng lúa của từng tỉnh ở Đồng bằng sông Cửu Long, phương pháp biểu hiện phù hợp nhất là:',
    context: 'Bài 2 - Mục 4: Phương pháp bản đồ - biểu đồ',
    options: [
      { key: 'A', text: 'Phương pháp khoanh vùng' },
      { key: 'B', text: 'Phương pháp kí hiệu' },
      { key: 'C', text: 'Phương pháp bản đồ - biểu đồ' },
      { key: 'D', text: 'Phương pháp đường chuyển động' },
    ],
    correctAnswer: 'C',
    explanation: 'Phương pháp bản đồ - biểu đồ biểu hiện giá trị tổng cộng của một hiện tượng địa lí trên một đơn vị lãnh thổ (tỉnh/vùng) bằng các biểu đồ đặt trong phạm vi các đơn vị lãnh thổ đó.'
  },
  {
    id: 'mcq-5',
    question: 'Kí hiệu hình học, kí hiệu chữ và kí hiệu tượng hình là các dạng thuộc phương pháp nào?',
    context: 'Bài 2 - Các dạng biểu hiện',
    options: [
      { key: 'A', text: 'Phương pháp bản đồ - biểu đồ' },
      { key: 'B', text: 'Phương pháp chấm điểm' },
      { key: 'C', text: 'Phương pháp khoanh vùng' },
      { key: 'D', text: 'Phương pháp kí hiệu' },
    ],
    correctAnswer: 'D',
    explanation: 'Phương pháp kí hiệu có 3 dạng biểu hiện chính: Kí hiệu hình học (tròn, vuông, tam giác...), Kí hiệu chữ (Fe, Al, Cu, Cr...) và Kí hiệu tượng hình (con thuyền, máy bay, cây lúa, con bò...).'
  },
  {
    id: 'mcq-6',
    question: 'Phương pháp khoanh vùng (vùng phân bố) được dùng để biểu hiện đối tượng nào sau đây?',
    context: 'Bài 2 - Mục 5: Phương pháp khoanh vùng',
    options: [
      { key: 'A', text: 'Vùng phân bố rừng ngập mặn Cà Mau hoặc vùng trồng cao su Đông Nam Bộ' },
      { key: 'B', text: 'Tốc độ và hướng của dòng biển nóng Gơn-xtrim' },
      { key: 'C', text: 'Vị trí chính xác của nhà máy thủy điện Hòa Bình' },
      { key: 'D', text: 'Giá trị kim ngạch xuất nhập khẩu của các quốc gia' },
    ],
    correctAnswer: 'A',
    explanation: 'Phương pháp khoanh vùng biểu hiện những đối tượng phân bố không đều khắp mà tập trung thành những vùng nhất định như vùng phân bố các loại đất, rừng, cây công nghiệp, vùng phân bố dân tộc...'
  },
  {
    id: 'mcq-7',
    question: 'Độ lớn (kích thước) của kí hiệu trên bản đồ thông thường biểu thị đặc tính nào của đối tượng địa lí?',
    context: 'Bài 2 - Khả năng biểu hiện của phương pháp kí hiệu',
    options: [
      { key: 'A', text: 'Tốc độ di chuyển của đối tượng' },
      { key: 'B', text: 'Số lượng, quy mô hoặc công suất của đối tượng' },
      { key: 'C', text: 'Thời gian hình thành của đối tượng' },
      { key: 'D', text: 'Hướng phát triển trong tương lai' },
    ],
    correctAnswer: 'B',
    explanation: 'Kích thước kí hiệu thể hiện quy mô, số lượng hoặc công suất của đối tượng (ví dụ: nhà máy điện công suất lớn dùng kí hiệu sao lớn hơn nhà máy công suất nhỏ).'
  },
  {
    id: 'mcq-8',
    question: 'Khi đọc một bản đồ kinh tế, mũi tên có nét vẽ dày và dài hơn thể hiện điều gì của luồng vận tải hàng hóa?',
    context: 'Bài 2 - Phương pháp đường chuyển động',
    options: [
      { key: 'A', text: 'Chất lượng hàng hóa cao hơn' },
      { key: 'B', text: 'Tốc độ di chuyển chậm hơn' },
      { key: 'C', text: 'Khối lượng vận chuyển lớn hơn và cự li vận chuyển xa hơn' },
      { key: 'D', text: 'Đơn giá cước vận tải rẻ hơn' },
    ],
    correctAnswer: 'C',
    explanation: 'Trong phương pháp đường chuyển động, độ dày/rộng của mũi tên biểu thị khối lượng/cường độ, chiều dài thể hiện cự li/tuyến đường di chuyển.'
  }
];

// ==========================================
// TRÒ 2: TRẮC NGHIỆM ĐÚNG / SAI (CHUẨN BGD ĐỊNH DẠNG MỚI)
// ==========================================
export const trueFalseQuestions: TrueFalseQuestion[] = [
  {
    id: 'tf-1',
    title: 'Câu 1: Về phương pháp kí hiệu và khả năng biểu hiện',
    passage: 'Phương pháp kí hiệu là một trong những phương pháp cơ bản và phổ biến nhất được sử dụng trong bản đồ địa lí để thể hiện các đối tượng địa lí phân bố theo điểm.',
    statements: [
      {
        id: 'tf-1-a',
        text: 'a) Phương pháp kí hiệu chỉ thể hiện được vị trí tọa độ của đối tượng mà không thể hiện được quy mô, chất lượng hay cơ cấu.',
        isCorrect: false,
        explanation: 'Sai. Phương pháp kí hiệu biểu hiện được cả vị trí, số lượng (quy mô), chất lượng, cấu trúc và động lực phát triển.'
      },
      {
        id: 'tf-1-b',
        text: 'b) Kí hiệu Fe biểu thị mỏ sắt thuộc dạng kí hiệu chữ.',
        isCorrect: true,
        explanation: 'Đúng. Kí hiệu chữ sử dụng các chữ cái viết tắt của nguyên tố hóa học hoặc tên đối tượng.'
      },
      {
        id: 'tf-1-c',
        text: 'c) Các đối tượng như nhà máy nhiệt điện, sân bay quốc tế, mỏ dầu mỏ đều biểu hiện bằng phương pháp kí hiệu.',
        isCorrect: true,
        explanation: 'Đúng. Đây đều là các đối tượng địa lí phân bố tập trung theo các điểm cụ thể.'
      },
      {
        id: 'tf-1-d',
        text: 'd) Màu sắc của kí hiệu không có ý nghĩa biểu thị đặc tính chất lượng của đối tượng.',
        isCorrect: false,
        explanation: 'Sai. Màu sắc kí hiệu thường thể hiện chất lượng (ví dụ: mỏ đang khai thác màu đỏ, mỏ dự trữ màu đen; nhà máy nhiệt điện màu đỏ, thủy điện màu xanh).'
      }
    ]
  },
  {
    id: 'tf-2',
    title: 'Câu 2: Về phương pháp kí hiệu đường chuyển động và phương pháp chấm điểm',
    passage: 'Trong các bản đồ tự nhiên và kinh tế - xã hội, đường chuyển động và chấm điểm đóng vai trò then chốt trong việc phản ánh động lực và độ phân tán.',
    statements: [
      {
        id: 'tf-2-a',
        text: 'a) Phương pháp kí hiệu đường chuyển động biểu hiện được hướng di chuyển, khối lượng và tốc độ của đối tượng.',
        isCorrect: true,
        explanation: 'Đúng. Đây là đặc điểm nổi bật nhất của phương pháp đường chuyển động (hướng mũi tên, bề dày, màu sắc, chiều dài).'
      },
      {
        id: 'tf-2-b',
        text: 'b) Để thể hiện luồng gió mùa Đông Bắc xâm nhập vào nước ta vào mùa đông, ta dùng phương pháp chấm điểm.',
        isCorrect: false,
        explanation: 'Sai. Hướng gió mùa phải sử dụng phương pháp kí hiệu đường chuyển động (mũi tên hướng Đông Bắc - Tây Nam).'
      },
      {
        id: 'tf-2-c',
        text: 'c) Trong phương pháp chấm điểm, mỗi điểm chấm trên bản đồ bắt buộc phải tương ứng với đúng một cá thể hoặc một hộ dân duy nhất.',
        isCorrect: false,
        explanation: 'Sai. Mỗi điểm chấm quy ước mang một giá trị số lượng xác định (ví dụ 1 chấm = 5.000 người, 10.000 tấn sản phẩm).'
      },
      {
        id: 'tf-2-d',
        text: 'd) Mật độ chấm điểm dày đặc trên bản đồ biểu hiện khu vực có mật độ tập trung cao của đối tượng địa lí đó.',
        isCorrect: true,
        explanation: 'Đúng. Chấm càng dày chứng tỏ đối tượng tập trung mật độ cao, chấm thưa thớt là vùng phân tán.'
      }
    ]
  },
  {
    id: 'tf-3',
    title: 'Câu 3: Về phương pháp bản đồ - biểu đồ và phương pháp khoanh vùng',
    passage: 'Việc lựa chọn đúng phương pháp biểu hiện giúp người đọc bản đồ nắm bắt nhanh chóng và chính xác số liệu thống kê cũng như ranh giới không gian.',
    statements: [
      {
        id: 'tf-3-a',
        text: 'a) Phương pháp bản đồ - biểu đồ thể hiện giá trị tổng cộng của đối tượng địa lí trong một đơn vị lãnh thổ.',
        isCorrect: true,
        explanation: 'Đúng. Biểu đồ đặt trực tiếp vào từng đơn vị lãnh thổ (tỉnh/vùng) để thể hiện tổng giá trị và cơ cấu.'
      },
      {
        id: 'tf-3-b',
        text: 'b) Để phân biệt vùng trồng chè ở Trung du miền núi Bắc Bộ với các vùng khác, phương pháp khoanh vùng là thích hợp nhất.',
        isCorrect: true,
        explanation: 'Đúng. Phương pháp khoanh vùng biểu hiện đối tượng không phân bố đều mà tập trung thành vùng xác định.'
      },
      {
        id: 'tf-3-c',
        text: 'c) Phương pháp bản đồ - biểu đồ chỉ vẽ được biểu đồ hình tròn, không thể vẽ biểu đồ hình cột.',
        isCorrect: false,
        explanation: 'Sai. Phương pháp này có thể sử dụng nhiều dạng biểu đồ như cột, tròn, thanh ngang, biểu đồ đường...'
      },
      {
        id: 'tf-3-d',
        text: 'd) Phương pháp khoanh vùng có thể sử dụng đường viền bao quanh, nét chải gạch hoặc màu sắc để làm nổi bật vùng phân bố.',
        isCorrect: true,
        explanation: 'Đúng. Có nhiều hình thức thể hiện ranh giới vùng như đường nét, tô màu nền, rải hoa văn...'
      }
    ]
  }
];

// ==========================================
// TRÒ 3: KÉO THẢ NỘI DUNG (MATCHING & CLASSIFICATION)
// ==========================================
export const dragCategories: DragCategory[] = [
  {
    id: 'cat_ki_hieu',
    title: 'Phương pháp Kí hiệu',
    iconName: 'MapPin',
    description: 'Đối tượng phân bố theo điểm cụ thể',
    color: 'border-blue-500 bg-blue-50/50 text-blue-900'
  },
  {
    id: 'cat_duong_chuyen_dong',
    title: 'Đường chuyển động',
    iconName: 'MoveRight',
    description: 'Di chuyển của hiện tượng tự nhiên, KTXH',
    color: 'border-emerald-500 bg-emerald-50/50 text-emerald-900'
  },
  {
    id: 'cat_cham_diem',
    title: 'Phương pháp Chấm điểm',
    iconName: 'Dot',
    description: 'Đối tượng phân tán, lẻ tẻ',
    color: 'border-amber-500 bg-amber-50/50 text-amber-900'
  },
  {
    id: 'cat_ban_do_bieu_do',
    title: 'Bản đồ - Biểu đồ',
    iconName: 'BarChart3',
    description: 'Tổng giá trị trên đơn vị lãnh thổ (tỉnh/vùng)',
    color: 'border-purple-500 bg-purple-50/50 text-purple-900'
  },
  {
    id: 'cat_khoanh_vung',
    title: 'Phương pháp Khoanh vùng',
    iconName: 'Scan',
    description: 'Tập trung thành vùng không đều khắp',
    color: 'border-rose-500 bg-rose-50/50 text-rose-900'
  }
];

export const dragItems: DragItem[] = [
  {
    id: 'item-1',
    content: 'Mỏ than đá Cẩm Phả (Quảng Ninh)',
    category: 'cat_ki_hieu',
    hint: 'Phân bố tại một tọa độ điểm khoáng sản cụ thể'
  },
  {
    id: 'item-2',
    content: 'Đường đi và hướng đổ bộ của Bão số 3 (Yagi)',
    category: 'cat_duong_chuyen_dong',
    hint: 'Sự di chuyển của hiện tượng khí tượng'
  },
  {
    id: 'item-3',
    content: 'Sự phân bố các điểm dân cư nông thôn ở vùng đồi núi',
    category: 'cat_cham_diem',
    hint: 'Phân bố rời rạc, phân tán'
  },
  {
    id: 'item-4',
    content: 'Sản lượng lương thực có hạt của 13 tỉnh ĐBSCL năm 2024',
    category: 'cat_ban_do_bieu_do',
    hint: 'Giá trị tổng cộng theo từng đơn vị hành chính tỉnh'
  },
  {
    id: 'item-5',
    content: 'Vùng trồng cây cao su lớn nhất ở Đông Nam Bộ',
    category: 'cat_khoanh_vung',
    hint: 'Đối tượng tập trung thành một không gian vùng rộng'
  },
  {
    id: 'item-6',
    content: 'Tuyến vận tải đường biển quốc tế Hải Phòng - Singapore',
    category: 'cat_duong_chuyen_dong',
    hint: 'Tuyến giao thông vận tải hàng hóa di chuyển'
  },
  {
    id: 'item-7',
    content: 'Nhà máy Thủy điện Sơn La trên sông Đà',
    category: 'cat_ki_hieu',
    hint: 'Công trình công nghiệp tại một điểm cố định'
  },
  {
    id: 'item-8',
    content: 'Vùng phân bố rừng ngập mặn ven biển Nam Bộ',
    category: 'cat_khoanh_vung',
    hint: 'Hệ sinh thái phân bố theo dải vùng nhất định'
  },
  {
    id: 'item-9',
    content: 'Số lượng đàn bò sữa phân tán ở các nông hộ Ba Vì',
    category: 'cat_cham_diem',
    hint: 'Gia súc nuôi phân tán theo từng điểm chấm giá trị'
  },
  {
    id: 'item-10',
    content: 'Cơ cấu kinh tế (Nông nghiệp, Công nghiệp, Dịch vụ) 6 vùng kinh tế',
    category: 'cat_ban_do_bieu_do',
    hint: 'Biểu đồ tròn đặt tại 6 vùng kinh tế'
  }
];

export const matchingPairs: MatchingPair[] = [
  {
    id: 'match-1',
    method: 'Phương pháp Kí hiệu',
    targetDescription: 'Biểu hiện các đối tượng định vị tại những điểm cụ thể (nhà máy, mỏ, cảng biển)',
    example: 'Kí hiệu mỏ than, sân bay Nội Bài'
  },
  {
    id: 'match-2',
    method: 'Phương pháp Đường chuyển động',
    targetDescription: 'Biểu hiện sự di chuyển, hướng đi, tốc độ và khối lượng của các hiện tượng',
    example: 'Hướng gió mùa, luồng di dân'
  },
  {
    id: 'match-3',
    method: 'Phương pháp Chấm điểm',
    targetDescription: 'Biểu hiện đối tượng phân tán bằng các điểm chấm có giá trị định lượng quy ước',
    example: 'Dân cư nông thôn, số lượng trâu bò'
  },
  {
    id: 'match-4',
    method: 'Phương pháp Bản đồ - Biểu đồ',
    targetDescription: 'Đặt các biểu đồ vào phạm vi từng đơn vị lãnh thổ để thể hiện tổng giá trị và cơ cấu',
    example: 'Biểu đồ cột GDP các tỉnh'
  },
  {
    id: 'match-5',
    method: 'Phương pháp Khoanh vùng',
    targetDescription: 'Biểu hiện đối tượng tập trung thành từng vùng không gian xác định nhưng không đều khắp',
    example: 'Vùng trồng cà phê Tây Nguyên'
  }
];

// ==========================================
// TRÒ 4: ĐIỀN KHUYẾT KIẾN THỨC CỐT LÕI (CLOZE TEST)
// ==========================================
export const fillBlankItems: FillBlankItem[] = [
  {
    id: 'fb-1',
    sentenceBefore: 'Phương pháp kí hiệu dùng để biểu hiện các đối tượng phân bố theo những ',
    sentenceAfter: ' cụ thể như mỏ khoáng sản, sân bay, ngọn núi.',
    correctAnswer: 'điểm',
    acceptableAnswers: ['điểm', 'vi trí điểm', 'tọa độ điểm'],
    hint: 'Từ có 1 âm tiết, chỉ vị trí không gian thu nhỏ trên bản đồ (đ---).',
    wordBank: ['điểm', 'vùng', 'đường', 'diện tích', 'khối lượng']
  },
  {
    id: 'fb-2',
    sentenceBefore: 'Để biểu hiện hướng, tốc độ và khối lượng di chuyển của gió bão hoặc luồng hàng hóa, ta dùng phương pháp ',
    sentenceAfter: '.',
    correctAnswer: 'đường chuyển động',
    acceptableAnswers: ['đường chuyển động', 'kí hiệu đường chuyển động', 'chuyển động'],
    hint: 'Phương pháp dùng các mũi tên di chuyển.',
    wordBank: ['đường chuyển động', 'khoanh vùng', 'chấm điểm', 'bản đồ biểu đồ', 'nền chất lượng']
  },
  {
    id: 'fb-3',
    sentenceBefore: 'Trong phương pháp chấm điểm, mỗi điểm chấm trên bản đồ đều mang một ',
    sentenceAfter: ' xác định (ví dụ: 1 chấm = 5.000 người).',
    correctAnswer: 'giá trị',
    acceptableAnswers: ['giá trị', 'giá trị số lượng', 'số lượng'],
    hint: 'Định lượng cụ thể được quy ước trước cho mỗi chấm (g-- t--).',
    wordBank: ['giá trị', 'tọa độ', 'hướng đi', 'chất lượng', 'kích thước']
  },
  {
    id: 'fb-4',
    sentenceBefore: 'Phương pháp bản đồ - biểu đồ thể hiện giá trị tổng cộng của hiện tượng trên một ',
    sentenceAfter: ' (như một tỉnh, một huyện hoặc một vùng kinh tế).',
    correctAnswer: 'đơn vị lãnh thổ',
    acceptableAnswers: ['đơn vị lãnh thổ', 'đơn vị hành chính', 'lãnh thổ'],
    hint: 'Phạm vi không gian hành chính xác định (đ-- v- l--- t--).',
    wordBank: ['đơn vị lãnh thổ', 'điểm tọa độ', 'tuyến đường', 'đỉnh núi', 'hải cảng']
  },
  {
    id: 'fb-5',
    sentenceBefore: 'Phương pháp ',
    sentenceAfter: ' dùng để thể hiện những đối tượng phân bố tập trung thành những vùng nhất định như vùng trồng cây công nghiệp, vùng phân bố rừng đặc dụng.',
    correctAnswer: 'khoanh vùng',
    acceptableAnswers: ['khoanh vùng', 'vùng phân bố'],
    hint: 'Phương pháp dùng đường ranh giới hoặc tô màu cho một vùng (k---- v---).',
    wordBank: ['khoanh vùng', 'chấm điểm', 'kí hiệu chữ', 'đường chuyển động', 'bản đồ biểu đồ']
  }
];
