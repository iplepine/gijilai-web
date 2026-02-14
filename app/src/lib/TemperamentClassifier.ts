export class TemperamentClassifier {
    static analyze(scores: { NS: number, HA: number, RD: number, P: number }, parentScores: { NS: number, HA: number, RD: number, P: number }) {
        const { NS, HA, RD, P } = scores;
        const highThreshold = 60;
        const lowThreshold = 40;

        // 1. Sprout (Current Manifestation - Child TCI)
        let plant = { label: "무한한 잠재력의 새싹", emoji: "🌱", desc: "도처에 싹을 틔울 준비가 된 생명력 넘치는 상태예요." };

        if (NS >= highThreshold) {
            if (HA >= highThreshold) plant = { label: "섬세한 아티스트 새싹", emoji: "🎨", desc: "호기심은 많지만 조심스럽게 영역을 넓혀가는 중이에요." };
            else if (RD >= highThreshold) plant = { label: "다정한 분위기 메이커 새싹", emoji: "💖", desc: "사람들을 향해 온기를 전하며 활발하게 자라고 있어요." };
            else plant = { label: "에너지 넘치는 탐험 새싹", emoji: "🦁", desc: "정원을 역동적으로 탐색하며 생명력을 뿜어내는 중이에요." };
        } else if (HA >= highThreshold) {
            plant = { label: "신중한 관찰자 새싹", emoji: "🦉", desc: "외부 자극에 민감하게 반응하며 자신을 보호하고 관찰해요." };
        } else if (RD >= highThreshold) {
            plant = { label: "따뜻한 평화주의자 새싹", emoji: "🕊️", desc: "모두와 조화롭게 어우러지는 다정한 아이예요." };
        } else if (P >= highThreshold) {
            plant = { label: "단단한 노력가 새싹", emoji: "🌳", desc: "비바람에도 흔들리지 않고 묵묵히 제 자리를 지키고 있어요." };
        }

        // 2. Seed Nature (Innate Nature - Child Proxy for Chess & Thomas)
        let seed = {
            label: "둥근 씨앗",
            desc: "어디서든 유연하게 적응하는 씨앗",
            detail: "낯선 환경에서도 금방 적응하고, 감정의 기복이 크지 않아 주변을 편안하게 만드는 매력이 있어요. 어떤 토양에서도 싹을 틔울 준비가 된 긍정적인 에너지를 품고 있습니다."
        };
        if (NS >= 65 && HA >= 65) {
            seed = {
                label: "뾰족 씨앗",
                desc: "자기만의 개성이 뚜렷하고 조건이 섬세한 씨앗",
                detail: "세상의 자극을 남들보다 예리하게 받아들여요. 비록 발아 조건은 까다로울 수 있지만, 한번 피어났을 때 누구보다 강렬하고 독창적인 빛깔을 뽐내는 존재입니다."
            };
        } else if (HA >= 60 && NS <= 40) {
            seed = {
                label: "단단한 껍질 씨앗",
                desc: "발아까지 시간이 걸리지만 내실이 튼튼한 씨앗",
                detail: "새로운 변화에 몸을 움츠리고 지켜보는 시간이 필요해요. 속도는 조금 느릴 수 있지만, 그만큼 내실을 탄탄하게 다져서 한번 내린 뿌리는 결코 흔들리지 않는 굳건함을 가졌습니다."
            };
        }

        // 3. Soil Classification (Parent Environment Proxy)
        let soil = {
            label: "비옥한 숲 토양",
            desc: "어떤 씨앗도 편안하게 받아주는 안정적인 바탕",
            detail: "부모님의 넓은 수용성과 안정적인 정서가 큰 강점이에요. 아이가 실패를 두려워하지 않고 마음껏 뿌리를 뻗을 수 있는 든든하고 따뜻한 영양분을 제공하고 있습니다."
        };

        if (parentScores.HA >= 60) {
            soil = {
                label: "단단한 암석 토양",
                desc: "씨앗을 안전하게 보호하지만 세심한 유연함이 필요한 바탕",
                detail: "신중함과 책임감으로 아이를 위험으로부터 철저히 보호하는 울타리가 되어주세요. 다만, 단단한 흙을 조금만 부드럽게 일구어 아이가 스스로 틈을 비집고 나올 틈을 주는 유연함이 더해지면 좋습니다."
            };
        } else if (parentScores.NS >= 60) {
            soil = {
                label: "역동적인 화산 토양",
                desc: "강력한 에너지를 주지만 적절한 완급 조절이 필요한 바탕",
                detail: "풍부한 에너지와 열정으로 아이 성장에 강력한 추진력을 제공해요. 뜨거운 열기가 아이의 연약한 싹을 시들게 하지 않도록, 가끔은 시원한 그늘과 정적인 휴식을 섞어주는 완급 조절이 핵심입니다."
            };
        }

        return { ...plant, seed, soil };
    }
}
