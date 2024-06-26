const cardData = [
    {
        id: 1,
        title: '광주은행 K-패스그린카드v2',
        issuance: '만 19세 이상 본인 회원 (가족카드 불가)',
        brand: 'Mastercard(해외겸용), LOCAL(국내전용)',
        annualFee: '해외겸용 12,000원(기본연회비 1.2만원 + 제휴연회비 0원)\n국내전용 10,000원(기본연회비 1만원 + 제휴연회비 0원)',
        discount: '대중교통 10% 에코 머니 포인트 적립',
        discountDetails: '30만원 이상 : 최대 3,000원',
        postpaid: '기본탑재',
        link: 'https://www.kjbank.com/ib20/mnu/FPMCARD020103?ib20_wc=FPMCARD050102V10:FPMCARD050102V20&INBN_GDS_NO=CDR20230623001'
    },
    {
        id: 2,
        title: '기업은행 K-패스 (신용)',
        issuance: '만 19세 이상 본인 회원 (후불교통만 가능)',
        brand: 'BC, Mastercard(국내 전용)',
        annualFee: 'BC: 2000원\nMater: 4000원',
        discount: '1일 3회 → 최대 300원, 월 10,000원 한도 할인',
        discountDetails: '20만원 이상 : 평일 → 회당 100원 / 주말(공휴일) → 회당 200원\n50만원 이상 : 평일 → 회당 200원 / 주말(공휴일) → 회당 300원',
        postpaid: '연회비 면제여부 있음\n연간(카드 발급일로부터 1년) 국내 가맹점 이용금액 240만원 이상 시 차년도 연회비 면제(카드사 매출표 접수일 기준)\n연회비 실적제외가맹점 : 단기카드대출 금액 제외',
        link: 'https://cardapplication.ibk.co.kr/card/index.jsp?card_prdc_id=103105'
    },
    {
        id: 3,
        title: 'IBK큐브(체크, 후불, 실물)',
        issuance: '',
        brand: '',
        annualFee: '',
        discount: '건 당 100원 할인 → 최대 1,000원 (10회 한도)',
        discountDetails: '',
        postpaid: '',
        link: 'https://www.ibk.co.kr/common/navigation.ibk?linkUrl=/financetech/efinance/mobileb/ibk_cube_02.jsp&pageId=SM01050000'
    },
    {
        id: 4,
        title: '기후동행카드',
        issuance: '',
        brand: '',
        annualFee: '',
        discount: '서울지역 지하철 + 김포골드라인, 서울시 면허 시내·마을버스, 따릉이\n신분당선, 서울지역 외 지하철, 광역/공항버스, 타 지역 면허버스\n버스의 경우 서울시 면허 버스는 서울지역 외에서 승하차하더라도 기후동행카드 사용 가능\n지하철의 경우 이용범위 내 역에서 승차 후 이용범위 외 역에서 하차할 경우 기후동행카드 사용 불가\n예 : 종로3가(서울) 승차→인덕원(경기) 하차, 기후동행카드 사용불가, 하차역에서 역무원에 의해 별도 요금 징수\n승차역에서 하차역까지의 운임요금 부과\n예외적으로 이용범위 내 역에서 승차 후, 4호선(별내별가람~진접), 5호선(미사~하남검단산), 7호선(석남~까치울), 진접선(전구간)에서 하차하는 것은 가능합니다.(해당 역에서 승차는 할 수 없음)',
        discountDetails: '일반 : 65,000원 / 62,000원\n청년 : 55,000원 / 58,000원 (만 19~34세)',
        postpaid: '기후동행카드 가능 노선',
        link: 'https://news.seoul.go.kr/traffic/archives/510651'
    },
    {
        id: 5,
        title: '농협 K-패스(체크, 후불, 실물)',
        issuance: '',
        brand: '',
        annualFee: '',
        discount: '대중교통 10% 캐시백\n20만원 이상 : 3,000원\n80만원 이상 : 5,000원',
        discountDetails: '',
        postpaid: '',
        link: 'https://card.nonghyup.com/IpCc2021R.act'
    },
    {
        id: 6,
        title: '농협 K-패스(신용, 후불, 실물)',
        issuance: '만 19세 이상 본인 회원',
        brand: 'Visa(해외겸용), LOCAL(국내전용)',
        annualFee: '해외겸용 : 15,000원 (기본연회비 6,000원 + 제휴연회비 9,000원)\n국내전용 : 13,000원 (기본연회비 6,000원 + 제휴연회비 7,000원)',
        discount: '버스/지하철/택시/철도 10% 청구 할인',
        discountDetails: '40만원 이상 : 10,000원\n80만원 이상 : 20,000원',
        postpaid: '',
        link: 'https://card.nonghyup.com/IpCc2021R.act'
    },
    {
        id: 7,
        title: 'BC 바로카드 (신용, 후불, 실물) K-패스',
        issuance: '만 19세 이상 본인 회원',
        brand: 'Visa, Mastercard(해외겸용), LOCAL(국내전용)',
        annualFee: '해외겸용(Visa) 7,000원\n해외겸용(MasterCard) 6,000원\n국내전용 6,000원',
        discount: '30만원 이상 : 7,000원\n60만원 이상 : 12,000원\n100만원 이상 : 15,000원',
        discountDetails: '',
        postpaid: '',
        link: 'https://www.bccard.com/app/card/CreditCardMain.do?gdsno=103112'
    },
    {
        id: 8,
        title: '삼성카드 (신용, 후불, 실물) K-패스',
        issuance: '만 19세 이상 본인 회원',
        brand: 'Mastercard(해외겸용), LOCAL(국내전용)',
        annualFee: "해외겸용 10,000원(기본연회비 7,000원 + 제휴연회비 3,000원)\n국내전용 10,000원(기본연회비 7,000원 + 제휴연회비 3,000원)",
        discount: '대중교통 10% 결제일 할인',
        discountDetails: '40만원 이상 : 5,000원\n80만원 이상 : 10,000원',
        postpaid: '',
        link: 'https://www.samsungcard.com/home/card/cardinfo/PGHPPCCCardCardinfoDetails001?code=AAP1830&alncmpC=QHKPASS&affcode=QHKPASS'
    },
    {
        id: 9,
        title: '신한카드 (신용, 후불, 실물)  K-패스',
        issuance: '만 19세 이상 본인 회원',
        brand: 'Mastercard(해외겸용), LOCAL(국내전용)',
        annualFee: '해외겸용 7,000원(기본연회비 7,000원 + 서비스 0원)\n국내전용 7,000원(기본연회비 7,000원 + 서비스 3,000원)',
        discount: '대중교통 10% 할인',
        discountDetails: '30만원 이상 : 7,000원\n60만원 이상 : 15,000원',
        postpaid: '',
        link: 'https://www.shinhancard.com/pconts/html/card/apply/credit/1225543_2207.html'
    },
    {
        id: 10,
        title: '신한카드 (신용, 후불, 모바일) 티머니 Pay&GO',
        issuance: '만 19세 이상 본인 회원',
        brand: 'Mastercard(해외겸용), LOCAL(국내전용)',
        annualFee: '해외겸용 18,000원(기본연회비 7,000원 + 서비스 11,000원)\n국내전용 15,000원(기본연회비 7,000원 + 서비스 8,000원)',
        discount: '대중교통 30% 결제일 할인\n모바일티머니 앱 내 교통 카드 서비스에서 티머니 Pay & GO 신한카드를 등록 후 대중교통 이용 시 할인 적용(충전 사용/아이폰 사용자 불가)\n고속/시외 버스, 따릉이, 킥보드, 택시 20% 결제일 할인',
        discountDetails: '일 1회 → 최대 2,000원까지 할인 적용\n30만원 이상 : 7,000원\n50만원 이상 : 12,000원\n100만원 이상 : 18,000원',
        postpaid: '',
        link: 'https://www.shinhancard.com/pconts/html/card/apply/credit/1216792_2207.html?empSeq=501&btnApp=dp01'
    },
    {
        id: 11,
        title: '신한카드 (체크, 후불, 실물)  K-패스',
        issuance: '만 19세 이상 본인 회원',
        brand: '',
        annualFee: '',
        discount: '대중교통 10% 할인',
        discountDetails: '20만원 이상 : 2,000원\n50만원 이상 : 5,000원',
        postpaid: '단기카드대출, 장기카드대출, 연회비, 각종 수수료/이자(할부수수료, 연체이자 등), 기프트카드/선불카드 구매충전 금액, 상품권/선불전자지급수다니 구매충전 금액, 지방세 외 수입, 환경개선부담금, TV수신료, 국세, 지방세, 4대보험, 유치원/초중고 학교납입금, 대학(원)등록금, 아파트관리비, 도시가스, 전기요금, 수도요금 → 지난달 이용 금액 포함 X',
        link: 'https://www.shinhancard.com/pconts/html/card/apply/check/1225544_2206.html'
    },
    {
        id: 12,
        title: '우리카드 (신용, 후불, 실물) K-패스',
        issuance: '만 19세 이상 본인 회원',
        brand: 'Mastercard(해외겸용), BC카드(국내전용)',
        annualFee: 'BC카드(국내전용) 13,000원\nMastercard(해외겸용) 15,000원',
        discount: '대중교통 10% 청구 할인',
        discountDetails: '30만원 이상 : 10,000원\n70만원 이상 : 20,000원\n120만원 이상 : 40,000원',
        postpaid: '',
        link: 'https://pc.wooricard.com/dcpc/yh1/crd/crd01/H1CRD101S02.do?cdPrdCd=838395&canvasser=88805029'
    },
    {
        id: 13,
        title: '우리카드 (체크, 후불, 실물) K-패스',
        issuance: '만 19세 이상 본인 회원',
        brand: '',
        annualFee: '',
        discount: '대중교통 5만원 이상 사용 시 : 3,000원 캐시백',
        discountDetails: '',
        postpaid: '',
        link: 'https://pc.wooricard.com/dcpc/yh1/crd/crd01/H1CRD101S02.do?cdPrdCd=839035&canvasser=88805029'
    },
    {
        id: 14,
        title: '이즐 K-패스(모바일)',
        issuance: '만 19세 이상 본인 회원',
        brand: '',
        annualFee: '',
        discount: '교통카드 판매 가격 : 4,000원',
        discountDetails: '10만원 이상 : 2,000원\n20만원 이상 : 5,000원\n30만원 이상 : 7,000원\n계층별 적립금 지급 비율\n일반 : 20%\n청년층 : 30%\n저소득층 : 53%',
        postpaid: '',
        link: 'https://www.myezl.com/ezl/sub/news_detail1.do'
    },
    {
        id: 15,
        title: '이즐 K-패스(선불, 실물)',
        issuance: '만 19세 이상 본인 회원',
        brand: '',
        annualFee: '',
        discount: '교통카드 판매 가격 : 4,000원',
        discountDetails: '10만원 이상 : 2,000원\n20만원 이상 : 5,000원\n30만원 이상 : 7,000원\n계층별 적립금 지급 비율\n일반 : 20%\n청년층 : 30%\n저소득층 : 53%',
        postpaid: '',
        link: 'https://www.myezl.com/ezl/sub/news_detail1.do'
    },
    {
        id: 16,
        title: '카카오페이 K-패스(선불,모바일)',
        issuance: '',
        brand: '',
        annualFee: '',
        discount: '대중교통 이용금액 대상 10% 추가 환급',
        discountDetails: '10만원 이상 : 2,000원\n20만원 이상 : 5,000원\n30만원 이상 : 7,000원',
        postpaid: '잔액 충전 횟수에 제한 없이 수수료 무료\n아이폰 사용 불가',
        link: 'https://link.kakaopay.com/t/paywebis_pay_link_redirect=true&url=https%3A%2F%2Ffest.kakao.com%2Fkayo%3Ft_src%3Dkakaotalk%26t_ch%3Dtms%26t_obj%3Dmarketing'
    },
    {
        id: 17,
        title: '케이뱅크 My 체크카드(후불, 실물)',
        issuance: '만 19세 이상 본인 회원 (가족카드 불가)',
        brand: '',
        annualFee: '',
        discount: '전원 실적 30만원 이상 + 대중교통 비 5만원 이상 (총 35만원) → 매월 3,000원 추가 혜택',
        discountDetails: '(대학등록금, 철도승차권, 아파트관리비, 상품권 및 기프트카드 결제금액, 각종 수수료, 이자, 제세공과금, 사회보험료, 해외 및 교통카드 이용금액, 임대료 제외)',
        postpaid: '',
        link: 'https://www.kbanknow.com/ib20/mnu/FPMCRD030800?phashid=cqtKtFT'
    },
    {
        id: 18,
        title: 'K-패스 하나카드(신용, 후불, 실물)',
        issuance: '만 19세 이상 본인 회원',
        brand: 'Mastercard(해외겸용), LOCAL(국내전용)',
        annualFee: '해외겸용 17,000원(기본연회비 17,000원 + 제휴연회비 0원)\n국내전용 17,000원(기본연회비 17,000원 + 제휴연회비 0원)',
        discount: '대중교통 10% 청구 할인',
        discountDetails: '50만원 이상 : 10,000원\n100만원 이상 : 20,000원',
        postpaid: '',
        link: 'https://www.hanacard.co.kr/OPI41000000D.web?_frame=no&CD_PD_SEQ=17016'
    },
    {
        id: 19,
        title: 'K-패스 하나카드(체크, 후불, 실물)',
        issuance: '만 19세 이상 본인 회원',
        brand: '',
        annualFee: '',
        discount: '대중교통 10% 캐시백',
        discountDetails: '30만원 이상 : 3,000원\n60만원 이상 : 6,000원',
        postpaid: '',
        link: 'https://www.hanacard.co.kr/OPI41000000D.web?_frame=no&CD_PD_SEQ=17033'
    },
    {
        id: 20,
        title: 'DGB유페이(선불, 모바일) 원패스',
        issuance: '',
        brand: '',
        annualFee: '',
        discount: '',
        discountDetails: '',
        postpaid: '',
        link: 'https://play.google.com/store/apps/details?id=com.dgbupay.mobile&pli=1'
    },
    {
        id: 21,
        title: 'DGB유페이(선불,실물)',
        issuance: '',
        brand: '',
        annualFee: '',
        discount: '',
        discountDetails: '',
        postpaid: '',
        link: 'https://www.notion.so/woohwalog/58dfecbb09364abbb6423a7ac68f043a'
    },
    {
        id: 22,
        title: 'KB국민카드 (신용, 후불, 실물) K-패스',
        issuance: '만 19세 이상 본인 회원',
        brand: 'Visa(해외겸용), LOCAL(국내전용)',
        annualFee: '해외겸용 8,000원(기본연회비[회원별] 7,000원 + 제휴연회비[카드별] 1,000원)\n국내전용 8,000원(기본연회비[회원별] 7,000원 + 제휴연회비[카드별] 1,000원)',
        discount: '대중교통 10% 할인',
        discountDetails: '30만원 이상 : 5,000원\n(KB국민 K-패스카드로 청구할인 서비스를 적용 받은 이용건(해당 매출 전체), 단기카드대출(현금서비스), 장기카드대출(카드론), 아파트관리비, 초/중/고 학교납입금 전체(수업료/교육비/현장학습비/급식비 등), 대학(원)등록금, 정부지원금(보육료/유치원보조비/바우처 이용금액 등), 각종 세금, 공과금(전기/수도 등), 4대 사회보험료(건강/연금/고용/산재), 각종 수수료 및 이자, 연체료, 연회비, 상품권 및 선불카드(선불전자지급수단 포함) 구입/충전금액, 무승인전표(대중교통, 공항버스, 자판기, 터널통행료, 항공기내 이용 등), 취소금액 → 전월 이용 실적 제외)',
        postpaid: '',
        link: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?mainCC=a&cooperationcode=09321'
    },
    {
        id: 23,
        title: 'KB국민카드(체크, 후불, 실물) K-패스',
        issuance: '만 19세 이상 본인 회원',
        brand: '',
        annualFee: '',
        discount: '대중교통 10% 적립',
        discountDetails: '20만원 이상 : 최대 2,000점',
        postpaid: '',
        link: 'https://card.kbcard.com/CRD/DVIEW/HCAMCXPRICAC0076?ainCC=a&cooperationcode=09322'
    }
];

export default cardData;
