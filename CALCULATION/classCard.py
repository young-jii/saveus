import data
import classArea

area = classArea.Area()

# 교통비 계산
class Card:
    def __init__(self) :
        self.min = 40
        self.max = 50
        

    # 일반 교통비 함수
    def original(self, payment):
        result = []

        for num_moves in (self.min, self.max) :
            result.append(payment * num_moves) 
        return result
    

    # 기후동행카드 교통비 함수
    def gidongca(self, start_point, end_point, young):
        result = []
        # 기후동행카드 사용 가능 영역
        if area.check(start_point) == "Y" and area.check(end_point) == "Y" or all(bus in area.bus_routes for bus in data.transport) == True:
            # 청년(따릉이 미포함, 포함)
            if young == "Y":
                result.append(55000) 
                result.append(58000) 
            # 일반(따릉이 미포함, 포함)
            else:
                result.append(62000) 
                result.append(65000) 
            return result
        
        # 기후동행카드 사용 불가 영역
        else :  
            return "k_pass"


    # K-패스 교통비 함수
    def k_pass(self, payment, subsidiary, young):
        result = []

        for num_moves in (self.min, self.max) :
            # 일반 교통비
            original = payment * num_moves

            # 이동 횟수 미충족(15회 미만)
            if num_moves < 15:
                cal = original

            # 이동 횟수 충족(15회 이상, 60회 이하)
            elif num_moves <= 60:
                # 20만원 이하
                if original <= 200000:
                    # 저소득층
                    if subsidiary == "Y":
                        cal = original * (1 - 0.53)
                    # 청년
                    elif young == "Y":
                        cal = original * (1 - 0.3)
                    # 일반
                    else:
                        cal = original * (1 - 0.2)
                # 20만원 초과 (초과 비용에 대해서는 절반만 혜택 적용)
                else:
                    # 저소득층 
                    if subsidiary == "Y":
                        cal = original - (200000 + (original - 200000) / 2) * 0.53
                    # 청년
                    elif young == "Y":
                        cal = original - (200000 + (original - 200000) / 2) * 0.3
                    # 일반
                    else:
                        cal = original - (200000 + (original - 200000) / 2) * 0.2

            # 이동 횟수 초과(60회 이상)
            else:
                # 20만원 이하 
                if original <= 200000:
                    # 저소득층
                    if subsidiary == "Y":
                       cal = (payment * 60) * (1 - 0.53) + payment * (num_moves - 60)
                    # 청년
                    elif young == "Y":
                        cal = (payment * 60) * (1 - 0.3) + payment * (num_moves - 60)
                    # 일반
                    else:
                        cal = (payment * 60) * (1 - 0.2) + payment * (num_moves - 60)
                # 20만원 초과
                else:
                    # 저소득층
                    if subsidiary == "Y":
                       cal = (payment * 60) * (1 - 0.53) + payment * (num_moves - 60)
                       cal = original - (200000 + (result - 200000) / 2) * 0.53
                    # 청년
                    elif young == "Y":
                        cal = (payment * 60) * (1 - 0.3) + payment * (num_moves - 60)
                        cal = original - (200000 + (result - 200000) / 2) * 0.3
                    # 일반
                    else:
                        cal = (payment * 60) * (1 - 0.2) + payment * (num_moves - 60)
                        cal = original - (200000 + (result - 200000) / 2) * 0.2
            result.append(round(cal))

        return result



    # The경기패스, 인천I패스 교통비 함수
    def k_pass_plus(self, payment, subsidiary, young) :
        result = []

        for num_moves in (self.min, self.max) :
            # 일반 교통비
            original = payment * num_moves

            # 15회 미만
            if num_moves < 15 :
                cal = original

            # 15회 이상  
            else :
                # 저소득층
                if subsidiary == "Y" :
                    cal = original * (1 - 0.53)
                # 청년층
                elif young == "Y" :
                    cal = original * (1 - 0.3)
                # 일반층
                else :
                    cal = original * (1 - 0.2)
            result.append(round(cal))

        return result