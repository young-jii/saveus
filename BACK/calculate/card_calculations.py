import pandas as pd

# 데이터 초기화
data1 = {
    'mem_id': ['daye', 'jiyoung', 'tenni', 'hwani', 'hro'],
    'mem_email': ['daye@naver.com', 'jiyoung@naver.com', 'tenni@naver.com', 'hwani@naver.com', 'hro'],
    'mem_name': ['최다예', '박지영', '김태현', '노정환', '오재성'],
    'mem_home': ['서울', '경기', '인천', '서울', '서울'],
    'mem_young_yn': ['Y', 'N', 'Y', 'Y', 'Y'],
    'mem_subsidiary_yn': ['N', 'N', 'Y', 'N', 'N']
}
df_member = pd.DataFrame(data1)

data2 = {
    'mem_id': ['daye', 'daye', 'daye', 'daye', 'daye', 'jiyoung', 'jiyoung', 'jiyoung', 'tenni', 'tenni', 'hwani', 'hro'],
    'one_way_payment':[1750, 1850, 1800, 1900, 2000, 2200, 1400, 3200, 3600, 1500, 2400, 900],
    'num_move': [40, 8, 1, 1, 1, 40, 2, 2, 40, 20, 42, 38]
}

df_commerce_detail = pd.DataFrame(data2)

class Card:
    def __init__(self, id):
        self.id = id
        self.original_cost = self.original()

    def original(self):
        result = (df_commerce_detail[df_commerce_detail["mem_id"] == self.id]["one_way_payment"] 
                * df_commerce_detail[df_commerce_detail["mem_id"] == self.id]["num_move"]).sum()
        return result

    @staticmethod
    def gidongca(id):
        if df_member[df_member["mem_id"] == id]["mem_young_yn"].iloc[0] == "Y":
            return 58000, 55000
        else:
            return 65000, 62000

    def k_pass(self):
        result = 0
        num_moves = df_commerce_detail[df_commerce_detail["mem_id"] == self.id]["num_move"].sum()
        original_cost = self.original_cost

        if num_moves < 15:
            result = original_cost
        elif num_moves <= 60:
            if original_cost <= 200000:
                if df_member[df_member["mem_id"] == self.id]["mem_subsidiary_yn"].iloc[0] == "Y":
                    result = original_cost * (1 - 0.53)
                elif df_member[df_member["mem_id"] == self.id]["mem_young_yn"].iloc[0] == "Y":
                    result = original_cost * (1 - 0.3)
                else:
                    result = original_cost * (1 - 0.2)
            else:
                discount_factor = 0.53 if df_member[df_member["mem_id"] == self.id]["mem_subsidiary_yn"].iloc[0] == "Y" else (
                    0.3 if df_member[df_member["mem_id"] == self.id]["mem_young_yn"].iloc[0] == "Y" else 0.2)
                result = original_cost - ((200000 + (original_cost - 200000) / 2) * discount_factor)
        else:
            sort_payment = df_commerce_detail[df_commerce_detail["mem_id"] == self.id].sort_values(by="one_way_payment", ascending=False)
            num = 0
            idx = 0

            while num <= 60:
                num += sort_payment.iloc[idx]["num_move"]
                if num > 60:
                    end_idx = idx
                    end_num = num - sort_payment.iloc[idx]["num_move"]
                idx += 1

            discount_factor = 0.53 if df_member[df_member["mem_id"] == self.id]["mem_subsidiary_yn"].iloc[0] == "Y" else (
                0.3 if df_member[df_member["mem_id"] == self.id]["mem_young_yn"].iloc[0] == "Y" else 0.2)

            if original_cost <= 200000:
                for i in range(end_idx):
                    result += sort_payment.iloc[i]["one_way_payment"] * sort_payment.iloc[i]["num_move"]
                result += sort_payment.iloc[end_idx]["one_way_payment"] * (60 - end_num)
                result = result * (1 - discount_factor)
                result += sort_payment.iloc[end_idx]["one_way_payment"] * (num - 60)
                if end_idx < len(sort_payment) - 1:
                    for i in range(end_idx + 1, len(sort_payment)):
                        result += sort_payment.iloc[i]["one_way_payment"] * sort_payment.iloc[i]["num_move"]
            else:
                for i in range(end_idx):
                    result += sort_payment.iloc[i]["one_way_payment"] * sort_payment.iloc[i]["num_move"]
                result += sort_payment.iloc[end_idx]["one_way_payment"] * (60 - end_num)
                result = original_cost - ((200000 + (result - 200000) / 2) * discount_factor)

        return result

    def bc_credit(self, pre_month):
        if pre_month >= 300000:
            return min(self.original_cost * 0.15, 7000)
        elif pre_month >= 600000:
            return min(self.original_cost * 0.15, 12000)
        elif pre_month >= 1000000:
            return min(self.original_cost * 0.15, 15000)
        else:
            return 0

    def shinhan_credit_tmoney(self, pre_month, app):
        if app == "모바일티머니":
            if pre_month >= 300000:
                return min(self.original_cost * 0.3, 7000)
            elif pre_month >= 500000:
                return min(self.original_cost * 0.3, 12000)
            elif pre_month >= 1000000:
                return min(self.original_cost * 0.3, 18000)
            else:
                return 0
        else:
            if pre_month >= 300000:
                return min(self.original_cost * 0.3, 7000)
            elif pre_month >= 500000:
                return min(self.original_cost * 0.3, 12000)
            elif pre_month >= 1000000:
                return min(self.original_cost * 0.3, 18000)
            else:
                return 0

    def sinhan_credit(self, pre_month):
        if pre_month >= 300000:
            return min(self.original_cost * 0.1, 7000)
        elif pre_month >= 600000:
            return min(self.original_cost * 0.1, 15000)
        else:
            return 0

    def sinhan_check(self, pre_month):
        if pre_month >= 200000:
            return min(self.original_cost * 0.1, 2000)
        elif pre_month >= 500000:
            return min(self.original_cost * 0.1, 5000)
        else:
            return 0

    def hana_check(self, pre_month):
        if pre_month >= 300000:
            return min(self.original_cost * 0.1, 3000)
        elif pre_month >= 600000:
            return min(self.original_cost * 0.1, 6000)
        else:
            return 0

    def hana_credit(self, pre_month):
        if pre_month >= 500000:
            return min(self.original_cost * 0.1, 10000)
        elif pre_month >= 1000000:
            return min(self.original_cost * 0.1, 20000)
        else:
            return 0

    def handai_credit(self, pre_month):
        if pre_month >= 500000:
            return min(self.original_cost * 0.1, 6000)
        elif pre_month >= 1000000:
            return min(self.original_cost * 0.1, 10000)
        else:
            return 0

    def nonghyup_check(self, pre_month):
        if pre_month >= 200000:
            return min(self.original_cost * 0.1, 3000)
        elif pre_month >= 800000:
            return min(self.original_cost * 0.1, 5000)
        else:
            return 0

    def nonghyup_credit(self, pre_month):
        if pre_month >= 400000:
            return min(self.original_cost * 0.1, 10000)
        elif pre_month >= 800000:
            return min(self.original_cost * 0.1, 20000)
        else:
            return 0

    def kakao_(self, pre_month):
        if pre_month >= 100000:
            return min(self.original_cost * 0.1, 2000)
        elif pre_month >= 200000:
            return min(self.original_cost * 0.1, 5000)
        elif pre_month >= 300000:
            return min(self.original_cost * 0.1, 7000)
        else:
            return 0

    def ezl_(self, pre_month):
        if pre_month >= 100000:
            return 2000
        elif pre_month >= 200000:
            return 5000
        elif pre_month >= 300000:
            return 7000
        else:
            return 0

    def samsung_credit(self, pre_month):
        if pre_month >= 400000:
            return min(self.original_cost * 0.1, 5000)
        elif pre_month >= 800000:
            return min(self.original_cost * 0.1, 10000)
        else:
            return 0

    def kbank_check(self, pre_month, pre_trans):
        if pre_month >= 300000 and pre_trans >= 50000:
            return 3000
        else:
            return 0

    def dgbupay_(self):
        return 0

    def ibk_credit(self):
        return 0

    def ibk_check(self):
        return 0

    def kb_credit(self, pre_month):
        if pre_month >= 300000:
            return min(self.original_cost * 0.1, 5000)
        else:
            return 0

    def kb_check(self, pre_month):
        if pre_month >= 200000:
            return min(self.original_cost * 0.1, 2000)
        else:
            return 0

    def woori_credit(self, pre_month):
        if pre_month >= 300000:
            return min(self.original_cost * 0.1, 10000)
        elif pre_month >= 700000:
            return min(self.original_cost * 0.1, 20000)
        elif pre_month >= 1200000:
            return min(self.original_cost * 0.1, 40000)
        else:
            return 0

    def woori_check(self, pre_trans):
        if pre_trans >= 50000:
            return 3000
        else:
            return 0

    def kjbank_credit(self, pre_month):
        if pre_month >= 300000:
            return min(self.original_cost * 0.1, 3000)
        else:
            return 0

class CardCalculations:
    def __init__(self, id, pre_month, app=None, pre_trans=None):
        self.id = id
        self.pre_month = pre_month
        self.app = app
        self.pre_trans = pre_trans
        self.member_home = df_member.loc[df_member['mem_id'] == id, 'mem_home'].values[0]

        # Card 객체 생성
        self.card = Card(id)

        try:
            self.bc_credit = self.card.k_pass() - self.card.bc_credit(pre_month)
            self.shinhan_credit_tmoney = self.card.k_pass() - self.card.shinhan_credit_tmoney(pre_month, app)
            self.shinhan_credit = self.card.k_pass() - self.card.sinhan_credit(pre_month)
            self.shinhan_check = self.card.k_pass() - self.card.sinhan_check(pre_month)
            self.hana_check = self.card.k_pass() - self.card.hana_check(pre_month)
            self.hana_credit = self.card.k_pass() - self.card.hana_credit(pre_month)
            self.hyundai_credit = self.card.k_pass() - self.card.handai_credit(pre_month)
            self.nonghyup_check = self.card.k_pass() - self.card.nonghyup_check(pre_month)
            self.nonghyup_credit = self.card.k_pass() - self.card.nonghyup_credit(pre_month)
            self.kakao_pay = self.card.k_pass() - self.card.kakao_(pre_month)
            self.ezl = self.card.k_pass() - self.card.ezl_(pre_month)
            self.samsung_credit = self.card.k_pass() - self.card.samsung_credit(pre_month)
            self.samsung_check = self.card.k_pass() - self.card.kbank_check(pre_month, pre_trans)
            self.dgbupay = self.card.k_pass() - self.card.dgbupay_()
            self.ibk_credit = self.card.k_pass() - self.card.ibk_credit()
            self.ibk_check = self.card.k_pass() - self.card.ibk_check()
            self.kb_credit = self.card.k_pass() - self.card.kb_credit(pre_month)
            self.kb_check = self.card.k_pass() - self.card.kb_check(pre_month)
            self.woori_credit = self.card.k_pass() - self.card.woori_credit(pre_month)
            self.woori_check = self.card.k_pass() - self.card.woori_check(pre_trans)
            self.kjbank_credit = self.card.k_pass() - self.card.kjbank_credit(pre_month)

        except Exception as e:
            print(f"Initialization Error: {e}")
            raise

    def calculate(self):
        try:
            if self.member_home == "경기":
                return self.get_results(prefix="[The경기]")
            elif self.member_home == "인천":
                return self.get_results(prefix="[인천I]")
            else:
                return self.get_results(prefix="[K]")
        except Exception as e:
            print(f"Calculation Error: {e}")
            raise

    def get_results(self, prefix):
        try:
            results = {
                f"{prefix} bc_신용": round(self.bc_credit),
                f"{prefix} 신한_신용_티머니": round(self.shinhan_credit_tmoney),
                f"{prefix} 신한_신용": round(self.shinhan_credit),
                f"{prefix} 신한_체크": round(self.shinhan_check),
                f"{prefix} 하나_체크": round(self.hana_check),
                f"{prefix} 하나_신용": round(self.hana_credit),
                f"{prefix} 현대_신용": round(self.hyundai_credit),
                f"{prefix} 농협_체크": round(self.nonghyup_check),
                f"{prefix} 농협_신용": round(self.nonghyup_credit),
                f"{prefix} 카카오페이": round(self.kakao_pay),
                f"{prefix} 이즐": round(self.ezl),
                f"{prefix} 삼성_신용": round(self.samsung_credit),
                f"{prefix} 삼성_체크": round(self.samsung_check),
                f"{prefix} dgb유페이": round(self.dgbupay),
                f"{prefix} 기업_신용": round(self.ibk_credit),
                f"{prefix} 기업_체크": round(self.ibk_check),
                f"{prefix} 국민_신용": round(self.kb_credit),
                f"{prefix} 국민_체크": round(self.kb_check),
                f"{prefix} 우리_신용": round(self.woori_credit),
                f"{prefix} 우리_체크": round(self.woori_check),
                f"{prefix} 광주_신용": round(self.kjbank_credit),
            }
            return results
        except Exception as e:
            print(f"Get Results Error: {e}")
            raise


# 인스턴스 생성 및 계산 수행 예제
id = "daye"
pre_month = 300000
app = "티머니GO"
pre_trans = 60000

card_calculations = CardCalculations(id, pre_month, app, pre_trans)
results = card_calculations.calculate()
print(results)
