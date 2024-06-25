import data
import classCard

# K-패스 카드 23개 "추가" 할인
class Discount:

    def __init__(self, k_pass) :
        self.k_pass = k_pass
        card = classCard.Card()
        self.min = card.min
        self.max = card.max

    # BC 바로카드 (신용, 후불, 실물) | K-패스 카드 
    def bc_credit(self, pre_month):
        discount_result = []

        for k_pass_price in self.k_pass :
            # 이전 달, 100만원 이상 사용
            if pre_month >= 1000000 :
                cal = min(k_pass_price * 0.15, 15000)
            # 이전 달, 60만원 이상 사용
            elif pre_month >= 600000 :
                cal = min(k_pass_price * 0.15, 12000)
            # 이전 달, 30만원 이상 사용
            elif pre_month >= 300000 :
                cal = min(k_pass_price * 0.15, 7000)
            # 이전 달, 실적 미충족
            else :
                cal = 0
            discount_result.append(round(cal))

        return discount_result
    

    # 신한카드 (신용, 후불, 모바일) | 티머니 Pay & GO 신한카드 
    def shinhan_credit_tmoney(self, pre_month):
        discount_result_mobile = []
        discount_result_go = []

        # 모바일 티머니 (IPone X), 티머니 GO
        for k_pass_price in self.k_pass :
            # 이전 달, 100만원 이상 사용
            if pre_month >= 1000000 :
                cal_mobile = min(k_pass_price * 0.3, 18000)
                cal_go = min(k_pass_price * 0.2, 18000)
            # 이전 달, 50만원 이상 사용
            elif pre_month >= 500000 :
                cal_mobile = min(k_pass_price * 0.3, 12000)
                cal_go = min(k_pass_price * 0.2, 12000)
            # 이전 달, 30만원 이상 사용
            elif pre_month >= 300000 :
                cal_mobile = min(k_pass_price * 0.3, 7000)
                cal_go = min(k_pass_price * 0.2, 7000)
            # 이전 달, 실적 미충족
            else :
                cal_mobile = 0
                cal_go = 0
        
            discount_result_mobile.append(round(cal_mobile))
            discount_result_go.append(round(cal_go))

        return discount_result_mobile, discount_result_go


    # 신한카드 (신용, 후불, 실물) | K-패스 신한카드 
    def sinhan_credit(self, pre_month):
        discount_result = []
        
        for k_pass_price in self.k_pass :
            # 이전 달, 60만원 이상 사용
            if pre_month >= 600000:
                cal =  min(k_pass_price * 0.1, 15000)
            # 이전 달, 30만원 이상 사용
            elif pre_month >= 300000:
                cal = min(k_pass_price * 0.1, 7000)
            # 이전 달, 실적 미충족
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result


    # 신한카드 (체크, 후불, 실물) | K-패스 신한카드 체크 
    def sinhan_check(self, pre_month):
        discount_result = []

        for k_pass_price in self.k_pass :
            # 이전 달, 50만원 이상 사용
            if pre_month >= 500000:
                cal = min(k_pass_price * 0.1, 5000)
            # 이전 달, 20만원 이상 사용
            if pre_month >= 200000:
                cal = min(k_pass_price * 0.1, 2000)
            # 이전 달, 실적 미충족
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result


    # 하나카드 (체크, 후불, 실물) | K-패스 하나 체크카드 
    def hana_check(self, pre_month):
        discount_result = []

        for k_pass_price in self.k_pass :
            # 이전 달, 60만원 이상 사용
            if pre_month >= 600000:
                cal = min(k_pass_price * 0.1, 6000)
            # 이전 달, 30만원 이상 사용
            if pre_month >= 300000:
                cal = min(k_pass_price * 0.1, 3000)
            # 이전 달, 실적 미충족
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result
    

    # 하나카드 (신용, 후불, 실물) | K-패스 하나 신용카드
    def hana_credit(self, pre_month):
        discount_result = []
        
        for k_pass_price in self.k_pass :
            # 이전 달, 100만원 이상 사용
            if pre_month >= 1000000:
                cal = min(k_pass_price * 0.1, 20000)
            # 이전 달, 50만원 이상 사용
            elif pre_month >= 500000:
                cla = min(k_pass_price * 0.1, 10000)
            # 이전 달, 실적 미충족
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result
    

    # 현대카드 (신용, 후불, 실물) | 현대카드Z work Edition2 
    def handai_credit(self, pre_month):
        discount_result = []
        
        for k_pass_price in self.k_pass :
            # 이전 달, 100만원 이상 사용
            if pre_month >= 1000000:
                cal = min(k_pass_price * 0.1, 10000)
            # 이전 달, 50만원 이상 사용
            elif pre_month >= 500000:
                cal = min(k_pass_price * 0.1, 6000)
            # 이전 달, 실적 미충족
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result


    # 농협 (체크, 후불, 실물) | K-패스카드(체크) 
    def nonghyup_check(self, pre_month): 
        discount_result = []
        
        for k_pass_price in self.k_pass :
            # 이전 달, 80만원 이상 사용
            if pre_month >= 800000:
                cal = min(k_pass_price * 0.1, 5000)
            # 이전 달, 20만원 이상 사용
            elif pre_month >= 200000:
                cal = min(k_pass_price * 0.1, 3000)
            # 이전 달, 실적 미충족
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result


    # 농협 (신용, 후불, 실물) | K-패스카드(신용) 
    def nonghyup_credit(self, pre_month):
        discount_result = []
        
        for k_pass_price in self.k_pass :
            # 이전 달, 80만원 이상 사용
            if pre_month >= 800000:
                cal = min(k_pass_price * 0.1, 20000)
            # 이전 달, 40만원 이상 사용
            elif pre_month >= 400000:
                cal = min(k_pass_price * 0.1, 10000)
            # 이전 달, 실적 미충족
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result
    

    # 카카오페이 (선불, 모바일) | 카카오페이 K-패스 모바일 선불교통(안드로이드OS 한정) 
    def kakao_mobile(self, pre_month):
        discount_result = []
        
        for k_pass_price in self.k_pass :
            # 이전 달, 30만원 이상 사용
            if pre_month >= 300000:
                cal = min(k_pass_price * 0.1, 7000)
            # 이전 달, 20만원 이상 사용
            elif pre_month >= 200000:
                cal = min(k_pass_price * 0.1, 5000)
            # 이전 달, 10만원 이상 사용
            elif pre_month >= 100000:
                cal = min(k_pass_price * 0.1, 2000)
            # 이전 달, 실적 미충족
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result


    # 이동의 즐거움 (선불, 실물 / 모바일) | 이즐 K-패스 카드  
    def ezl_(self, pre_month, subsidiary, young):
        discount_result = []
        
        for k_pass_price in self.k_pass :
            # 이전 달, 30만원 이상 사용
            if pre_month >= 300000:
                # 저소득층
                if subsidiary == "Y":
                    cal = min(k_pass_price * 0.53, 7000)
                # 청년
                elif young == "Y":
                    cal = min(k_pass_price * 0.3, 7000)
                # 일반
                else:
                    cal = min(k_pass_price * 0.2, 7000)

            # 이전 달, 20만원 이상 사용
            elif pre_month >= 200000:
                # 저소득층
                if subsidiary == "Y":
                    cal = min(k_pass_price * 0.53, 5000)
                # 청년
                elif young == "Y":
                    cal = min(k_pass_price * 0.3, 5000)
                # 일반
                else:
                    cal = min(k_pass_price * 0.2, 5000)

            # 이전 달, 10만원 이상 사용
            elif pre_month >= 100000:
                # 저소득층
                if subsidiary == "Y":
                    cal = min(k_pass_price * 0.53, 2000)
                # 청년
                elif young == "Y":
                    cal = min(k_pass_price * 0.3, 2000)
                # 일반
                else:
                    cal = min(k_pass_price * 0.2, 2000)


            # 이전 달, 실적 미충족
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result
    

    # 삼성카드 (신용, 후불, 실물) | K-패스 삼성카드 
    def samsung_credit(self, pre_month):
        discount_result = []
        
        for k_pass_price in self.k_pass : 
            # 이전 달, 80만원 이상 사용
            if pre_month >= 800000:
                cal = min(k_pass_price * 0.1, 10000)
            # 이전 달, 40만원 이상 사용
            elif pre_month >= 400000:
                cal = min(k_pass_price * 0.1, 5000)
            # 이전 달, 실적 미충족
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result


    # 케이뱅크 (체크, 후불, 실물) | My 체크카드 
    def kbank_check(self, pre_month, pre_trans):
        discount_result = []
        for k_pass_price in self.k_pass : 
            # 이전 달, 30만원 + 대중교통비 5만원 이상 사용
            if pre_month >= 300000 and pre_trans >= 50000:
                discount_result.append(3000)
            else:
                discount_result.append(0)

        return discount_result
    

    # DGB유페이 (선불, 모바일/실물) | 원패스 
    def dgbupay_(self) :
        discount_result = []

        for k_pass_price in self.k_pass : 
            # 혜택 X
            discount_result.append(0)
        return discount_result


    # 기업은행 (신용, 후불, 실물) | K-패스(신용)
    def ibk_credit(self, pre_month):
        discount_result = []

        # 회당 측정
        for cnt in (self.min, self.max) :
            # 이전 달, 50만원 이상 사용
            if pre_month >= 500000 :
                # 일 300원 할인으로 계산
                cal = 10000
            # 이전 달, 20만원 이상 사용
            elif pre_month >= 200000 :
                # 200 * 50 = 10000
                if cnt >= 50 :
                    cal = 10000
                # 200 * 40 = 8000 (예상가격)
                else :
                    cal = 8000
            # 이전 달, 실적 미충족
            else :
                cal = 0
            discount_result.append(cal)

        return discount_result


    # 기업은행 (체크, 후불, 실물) | K-패스(체크)
    def ibk_check(self):
        discount_result = []
        
        for k_pass_price in self.k_pass : 
            # 회당, 100원 할인
            for cnt in (self.min, self.max) :
                cal = min(cnt * 100, 1000)
            discount_result.append(cal)

        return discount_result
    

    # KB국민카드 (신용, 후불, 실물) | K-패스카드 
    def kb_credit(self, pre_month):
        discount_result = []
        
        for k_pass_price in self.k_pass : 
            # 이전 달, 30만원 이상 사용
            if pre_month >= 300000:
                cal = min(k_pass_price * 0.1, 5000)
            # 이전 달, 실적 미충족
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result


    # KB국민카드 (체크, 후불, 실물) | K-패스체크카드 
    def kb_check(self, pre_month):
        discount_result = []
        
        for k_pass_price in self.k_pass : 
            # 이전 달, 20만원 이상 사용
            if pre_month >= 200000:
                cal = min(k_pass_price * 0.1, 2000)
            # 이전 달, 실적 미충족
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result


    # 우리카드 (신용, 후불, 실물) | 우리 K-패스(신용)  
    def woori_credit(self, pre_month):
        discount_result = []
        
        for k_pass_price in self.k_pass : 
            # 이전 달, 120만원 이상 사용
            if pre_month >= 1200000:
                cal = min(k_pass_price * 0.1, 40000)
            # 이전 달, 70만원 이상 사용
            elif pre_month >= 700000:
                cal = min(k_pass_price * 0.1, 20000)
            # 이전 달, 30만원 이상 사용
            elif pre_month >= 300000:
                cal = min(k_pass_price * 0.1, 10000)
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result


    # 우리카드 (체크, 후불, 실물) | 우리 K-패스 (COOKIE CHECK) 
    def woori_check(self, pre_trans):
        discount_result = []

        for k_pass_price in self.k_pass : 
            # 대중교통비 5만원 이상 사용
            if pre_trans >= 50000:
                discount_result.append(3000)
            else:
                discount_result.append(0)

        return discount_result


    # 광주은행 (신용, 후불, 실물) | K-그린카드v2  
    def kjbank_credit(self, pre_month):
        discount_result = []
        
        for k_pass_price in self.k_pass : 
            # 이전 달, 30만원 이상 사용
            if pre_month >= 300000:
                cal = min(k_pass_price * 0.1, 3000)
            else:
                cal = 0
            discount_result.append(round(cal))

        return discount_result