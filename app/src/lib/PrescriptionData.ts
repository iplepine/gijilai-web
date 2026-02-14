export interface Prescription {
    interpretation: string; // [해석] 아이의 신호 통역
    magicWord: string;      // [액션] 마법의 한마디
    gardenTheme: {
        soil: string;
        plant: string;
        color: string;
    };
}

export const PRESCRIPTION_DATA: Record<string, Prescription> = {
    "에너지 넘치는 열정 탐험가": {
        interpretation: "지금 아이는 장난을 치는 게 아니라, 몸속에 가득 찬 뜨거운 태양 에너지를 밖으로 내보내고 있는 거예요.",
        magicWord: "\"와, 민준이가 오늘 정말 신이 났구나! 우리 5분만 정원의 바람을 느끼며 신나게 뛰어볼까?\"",
        gardenTheme: {
            soil: "활동적인 붉은 흙",
            plant: "해바라기",
            color: "orange"
        }
    },
    "섬세한 아티스트": {
        interpretation: "아이가 멈칫하는 건 겁이 많아서가 아니라, 주변의 수만 가지 색깔과 소리를 섬세하게 느끼고 정리할 시간이 필요해서예요.",
        magicWord: "\"조금 낯설지? 괜찮아. 엄마랑 여기서 저 꽃이 무슨 색인지 1분만 같이 구경해볼까?\"",
        gardenTheme: {
            soil: "부드러운 모래 토양",
            plant: "라벤더",
            color: "purple"
        }
    },
    "사랑스러운 분위기 메이커": {
        interpretation: "아이가 엄마 곁을 맴도는 건 혼자 못해서가 아니라, 엄마라는 커다란 영양분을 듬뿍 받아 더 활짝 피어나고 싶기 때문이에요.",
        magicWord: "\"우리 지유가 엄마 사랑을 받고 싶었구나! 꽉 안아줄게. 이제 엄마 기운을 받아서 멋지게 놀아볼까?\"",
        gardenTheme: {
            soil: "영양 가득한 흑토",
            plant: "튤립",
            color: "pink"
        }
    },
    "신중한 분석가": {
        interpretation: "아이가 질문이 많은 건 의심해서가 아니라, 자기만의 정원 지도를 완벽하게 그려서 안전하게 걷고 싶기 때문이에요.",
        magicWord: "\"이게 궁금했구나? 이건 이런 원리야. 이제 지도를 다 그렸으니 한 발짝만 같이 내디뎌볼까?\"",
        gardenTheme: {
            soil: "단단한 암석 토양",
            plant: "소나무",
            color: "blue"
        }
    },
    "따뜻한 평화주의자": {
        interpretation: "아이가 양보하는 건 힘이 없어서가 아니라, 모두가 웃는 평화로운 정원의 풍경이 아이에게 가장 큰 행복이기 때문이에요.",
        magicWord: "\"나눠주는 모습이 참 따뜻하다! 친구도 정말 기쁘대. 대신 민준이 마음 정원도 소중하니까, 힘들 땐 언제든 말해줘.\"",
        gardenTheme: {
            soil: "촉촉한 진흙 토양",
            plant: "연꽃",
            color: "teal"
        }
    },
    "무한한 잠재력의 새싹": {
        interpretation: "아직은 어떤 꽃이 될지 고르는 중이에요. 지금은 비바람을 막아주는 튼튼한 울타리가 되어주는 것만으로도 충분해요.",
        magicWord: "\"천천히 자라도 괜찮아. 어떤 꽃을 피우든 엄마는 이 정원에서 너를 항상 응원할게.\"",
        gardenTheme: {
            soil: "포근한 이끼 토양",
            plant: "작은 새싹",
            color: "green"
        }
    }
};
