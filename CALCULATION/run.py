import classCard
import classCardDiscount
import data

payment = data.payment
start_point = data.start_point
end_point = data.end_point
young = data.young
home = data.home
subsidiary = data.subsidiary
pre_month = data.pre_month


card_dic = {}


card = classCard.Card()
card_dic["일반"] = card.original(payment)
card_dic["기후동행카드"] = card.original(payment)

# 주거지에 따라 k_pass 값 다르게 출력
if home == "경기" or home == "인천" :
    k_pass = card.k_pass_plus(payment, subsidiary, young)
    card_dic["경기.인천패스"] = k_pass
else :
    k_pass = card.k_pass(payment, subsidiary, young)
    card_dic["K-패스"] = k_pass


discount = classCardDiscount.Discount(k_pass)

# k_pass_payment = k_pass - classCardDiscount 
def k_pass_payment(class_name) :
    pay_list = []
    if type(class_name) == tuple :
        for i in range(len(k_pass)) :
            binList = []
            for j in range(len(class_name)) :
                pay = k_pass[i] - class_name[i][j]
                binList.append(pay)
            pay_list.append(binList)
    elif type(class_name) == list :   
        for i in range(len(k_pass)) :
            pay = k_pass[i] - class_name[i]
            pay_list.append(pay)
    else :
        pay_list.append("error")
    return pay_list


card_dic["K-패스 카드"] = k_pass_payment(discount.bc_credit(pre_month))
card_dic["티머니 Pay & GO 신한카드"] = k_pass_payment(discount.shinhan_credit_tmoney(pre_month))
card_dic["K-패스 신한카드"] = k_pass_payment(discount.sinhan_credit(pre_month))
card_dic["K-패스 신한카드 체크"] = k_pass_payment(discount.sinhan_check(pre_month))
card_dic["K-패스 하나 체크카드"] = k_pass_payment(discount.hana_check(pre_month))
card_dic["K-패스 하나 신용카드"] = k_pass_payment(discount.hana_credit(pre_month))
card_dic["현대카드Z work Edition2"] = k_pass_payment(discount.handai_credit(pre_month))
card_dic["K-패스카드(체크)"] = k_pass_payment(discount.nonghyup_check(pre_month))
card_dic["K-패스카드(신용)"] = k_pass_payment(discount.nonghyup_credit(pre_month))
card_dic["카카오페이 K-패스 모바일 선불교통"] = k_pass_payment(discount.kakao_mobile(pre_month))
card_dic["이즐 K-패스 카드"] = k_pass_payment(discount.ezl_(pre_month, subsidiary, young))
card_dic["K-패스 삼성카드"] = k_pass_payment(discount.samsung_credit(pre_month))
card_dic["My 체크카드"] = k_pass_payment(discount.kbank_check(pre_month, 50000))
card_dic["원패스"] = k_pass_payment(discount.dgbupay_())
card_dic["K-패스(신용)"] = k_pass_payment(discount.ibk_credit(pre_month))
card_dic["K-패스(체크)"] = k_pass_payment(discount.ibk_check())
card_dic["K-패스카드"] = k_pass_payment(discount.kb_credit(pre_month))
card_dic["K-패스체크카드"] = k_pass_payment(discount.kb_check(pre_month))
card_dic["우리 K-패스(신용)"] = k_pass_payment(discount.woori_credit(pre_month))
card_dic["우리 K-패스 (COOKIE CHECK)"] = k_pass_payment(discount.woori_check(pre_month))
card_dic["K-그린카드v2"] = k_pass_payment(discount.kjbank_credit(pre_month))


# print(card_dic)

# 출력예시
# print(card_dic['K-패스 카드'])