export interface ParentReport {
    title: string;
    soilName: string;
    analysis: string;
    magicSeason: string;
    drought: string;
    nutrients: string[];
    letter: string;
}

export class ParentClassifier {
    static analyze(scores: { NS: number, HA: number, RD: number, P: number }): ParentReport {
        const { NS, HA, RD, P } = scores;

        // 1. Soil Analysis & Title
        let title = "따뜻한 지혜를 품은 숲의 토양";
        let soilName = "비옥한 숲 토양";
        let analysis = "당신의 마음 토양은 주변의 생명을 따뜻하게 품어주는 비옥한 숲과 같습니다. 타인의 감정을 세밀하게 읽어내고, 조화를 이루려는 노력이 당신의 대지를 풍요롭게 만듭니다.";
        let magicSeason = "고요한 숲속에 아침 햇살이 비칠 때, 당신은 가장 나다운 평온함을 느낍니다.";
        let drought = "예측할 수 없는 큰 소음이나 무례한 태도는 당신의 정원에 우박처럼 상처를 내기도 합니다.";
        let nutrients = ["혼자만의 고요한 차 한 잔", "좋아하는 음악과 함께하는 산책"];
        let letter = "당신은 이미 충분히 훌륭한 사람입니다. 타인을 돌보는 만큼 당신의 마음 정원도 소중히 가꿔주세요.";

        // High HA (Cautious/Sensitive)
        if (HA >= 60) {
            title = "섬세한 빛을 머금은 새벽 토양";
            soilName = "단단한 암석 토양";
            analysis = "당신의 마음 토양은 작은 변화도 예민하게 감지하는 섬세한 안테나를 가진 대지입니다. 신중함과 책임감이라는 단단한 암석이 당신의 정원을 안전하게 지켜주고 있습니다.";
            magicSeason = "모든 것이 계획대로 차분히 진행되는 고요한 오후, 당신의 정원은 가장 아름답게 빛납니다.";
            drought = "갑작스러운 일정 변화나 불확실한 미래는 당신의 토양을 딱딱하게 굳게 만들며 에너지를 앗아갑니다.";
            nutrients = ["명상이나 심호흡을 통한 이완", "나만의 속도로 정리된 일기 쓰기"];
            letter = "불안함은 당신이 그만큼 세상을 진지하게 대하고 있다는 증거입니다. 조금만 어깨의 짐을 내려놓아도 괜찮아요.";
        }
        // High NS (Dynamic/Energetic)
        else if (NS >= 60) {
            title = "생명력이 샘솟는 화산 토양";
            soilName = "역동적인 화산 토양";
            analysis = "당신의 마음 토양은 뜨거운 열정과 에너지가 끊임없이 솟아오르는 화산 지대와 같습니다. 새로운 시도를 두려워하지 않는 용기가 당신의 정원을 매일 다채롭게 물들입니다.";
            magicSeason = "새로운 도전을 시작하거나 낯선 장소에서 설렘을 느낄 때, 당신의 생명력은 절정에 달합니다.";
            drought = "반복되는 지루한 일상과 꽉 막힌 규칙은 당신의 뜨거운 열기를 가두어 답답한 가뭄을 불러옵니다.";
            nutrients = ["새로운 취미 배우기", "즉흥적인 여행이나 산책"];
            letter = "당신의 에너지는 주변을 밝히는 빛입니다. 가끔은 뜨거워진 마음에 시원한 바람이 지나갈 틈을 내어주세요.";
        }
        // High P (Persistent/Steady)
        else if (P >= 60) {
            title = "굳건한 뿌리를 가진 대지";
            soilName = "단단한 황토 토양";
            analysis = "당신의 마음 토양은 어떤 비바람에도 흔들리지 않는 깊은 뿌리를 가진 대지입니다. 목표를 향한 묵묵한 걸음이 당신의 정원을 누구보다 울창하게 만들어가고 있습니다.";
            magicSeason = "오랜 시간 공들인 일이 마침내 열매를 맺는 순간, 당신은 가장 깊은 만족감을 느낍니다.";
            drought = "노력한 만큼의 결과가 즉각 보이지 않거나, 주변의 비협조적인 태도는 당신의 마음을 메마르게 합니다.";
            nutrients = ["작은 성취를 축하하는 선물", "충분한 숙면과 물리적 휴식"];
            letter = "항상 최선을 다하는 당신의 모습은 경이롭습니다. 하지만 결과보다 과정 중에 있는 당신 자신을 더 사랑해주세요.";
        }

        return { title, soilName, analysis, magicSeason, drought, nutrients, letter };
    }
}
