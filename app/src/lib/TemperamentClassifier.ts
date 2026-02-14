export class TemperamentClassifier {
    static analyze(scores: { NS: number, HA: number, RD: number, P: number }, parentScores: { NS: number, HA: number, RD: number, P: number }) {
        const { NS, HA, RD, P } = scores;
        const highThreshold = 60;
        const lowThreshold = 40;

        // 1. Seed Type (Current Manifestation - Child TCI)
        let plant = { label: "무한한 잠재력의 새싹", emoji: "🌱", desc: "도처에 싹을 틔울 준비가 된 생명력 넘치는 상태예요." };

        if (NS >= highThreshold) {
            if (HA >= highThreshold) plant = { label: "섬세한 아티스트 씨앗", emoji: "🎨", desc: "호기심은 많지만 조심스럽게 영역을 넓혀가는 중이에요." };
            else if (RD >= highThreshold) plant = { label: "다정한 분위기 메이커 씨앗", emoji: "💖", desc: "사람들을 향해 향기를 퍼뜨리며 활짝 피어났어요." };
            else plant = { label: "에너지 넘치는 탐험 씨앗", emoji: "🦁", desc: "거침없이 하늘을 향해 가지를 뻗는 중이에요." };
        } else if (HA >= highThreshold) {
            plant = { label: "신중한 관찰자 씨앗", emoji: "🦉", desc: "외부 자극에 민감하게 반응하며 자신을 보호하고 관찰해요." };
        } else if (RD >= highThreshold) {
            plant = { label: "따뜻한 평화주의자 씨앗", emoji: "🕊️", desc: "모두와 조화롭게 어우러지는 다정한 아이예요." };
        } else if (P >= highThreshold) {
            plant = { label: "단단한 노력가 씨앗", emoji: "🌳", desc: "비바람에도 흔들리지 않고 깊게 뿌리를 내리고 있어요." };
        }

        // 2. Seed Nature (Innate Nature - Child Proxy for Chess & Thomas)
        let seed = { label: "둥근 씨앗", desc: "어디서든 유연하게 적응하는 씨앗" };
        if (NS >= 65 && HA >= 65) {
            seed = { label: "뾰족 씨앗", desc: "자기만의 개성이 뚜렷하고 조건이 섬세한 씨앗" };
        } else if (HA >= 60 && NS <= 40) {
            seed = { label: "단단한 껍질 씨앗", desc: "발아까지 시간이 걸리지만 내실이 튼튼한 씨앗" };
        }

        // 3. Soil Classification (Parent Environment Proxy)
        let soil = { label: "비옥한 숲 토양", desc: "어떤 씨앗도 편안하게 받아주는 안정적인 바탕" };

        if (parentScores.HA >= 60) {
            soil = { label: "단단한 암석 토양", desc: "씨앗을 안전하게 보호하지만 세심한 유연함이 필요한 바탕" };
        } else if (parentScores.NS >= 60) {
            soil = { label: "역동적인 화산 토양", desc: "강력한 에너지를 주지만 적절한 완급 조절이 필요한 바탕" };
        }

        return { ...plant, seed, soil };
    }
}
