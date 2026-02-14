export class TemperamentClassifier {
    static analyze(scores: { NS: number, HA: number, RD: number, P: number }) {
        const { NS, HA, RD, P } = scores;
        const highThreshold = 60;
        const lowThreshold = 40;

        // 1. Seed Classification (TCI based)
        let seed = { label: "무한한 잠재력의 새싹", emoji: "🌱", desc: "아직 어떤 꽃을 피울지 기대되는 아이예요." };

        if (NS >= highThreshold) {
            if (HA >= highThreshold) seed = { label: "섬세한 아티스트 씨앗", emoji: "🎨", desc: "호기심은 많지만 신중한, 빛나는 감수성을 가졌어요." };
            else if (RD >= highThreshold) seed = { label: "다정한 분위기 메이커 씨앗", emoji: "💖", desc: "사람을 좋아하고 새로운 것도 좋아하는 인기쟁이!" };
            else seed = { label: "에너지 넘치는 탐험 씨앗", emoji: "🦁", desc: "두려움 없이 새로운 세상으로 뛰어드는 모험가예요." };
        } else if (HA >= highThreshold) {
            seed = { label: "신중한 관찰자 씨앗", emoji: "🦉", desc: "돌다리도 두들겨 보고 건너는 꼼꼼함을 가졌어요." };
        } else if (RD >= highThreshold) {
            seed = { label: "따뜻한 평화주의자 씨앗", emoji: "🕊️", desc: "모두와 사이좋게 지내는 다정한 마음씨를 가졌어요." };
        } else if (P >= highThreshold) {
            seed = { label: "단단한 노력가 씨앗", emoji: "🌳", desc: "한번 시작한 일은 끝까지 해내는 끈기가 있어요." };
        }

        // 2. Soil Classification (Chess & Thomas based proxy)
        let soil = { label: "순한 토양", desc: "영양이 풍부하고 안정적인 바탕" };

        // High NS + High HA + Low RD is often 'Difficult'
        if (NS >= 65 && HA >= 65) {
            soil = { label: "예민한 화산토", desc: "변화가 많고 섬세한 관리가 필요한 바탕" };
        }
        // High HA + Low NS is often 'Slow-to-warm-up'
        else if (HA >= 60 && NS <= 40) {
            soil = { label: "신중한 진흙토", desc: "예열이 필요하지만 한 번 뿌리내리면 단단한 바탕" };
        }
        // Low HA + Low NS (or balanced) is 'Easy'
        else if (HA <= 45 && NS <= 55) {
            soil = { label: "비옥한 숲토양", desc: "어떤 씨앗도 편안하게 받아주는 안정적인 바탕" };
        }

        return { ...seed, soil };
    }
}
