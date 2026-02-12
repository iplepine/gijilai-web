export class TemperamentClassifier {
    static analyze(scores: { NS: number, HA: number, RD: number, P: number }) {
        // Simple Logic based on Dominant Traits (Normalized 0-100)
        // This is a simplified version of TCI interpretation for the MVP.

        const { NS, HA, RD, P } = scores;
        const highThreshold = 50;

        // 1. High NS (Explorer)
        if (NS >= highThreshold) {
            if (HA >= highThreshold) return { label: "섬세한 아티스트", emoji: "🎨", desc: "호기심은 많지만 신중한, 빛나는 감수성을 가졌어요." };
            if (RD >= highThreshold) return { label: "사랑스러운 분위기 메이커", emoji: "💖", desc: "사람을 좋아하고 새로운 것도 좋아하는 인기쟁이!" };
            return { label: "에너지 넘치는 열정 탐험가", emoji: "🦁", desc: "두려움 없이 새로운 세상으로 뛰어드는 모험가예요." };
        }

        // 2. Low NS (Conservative)
        if (HA >= highThreshold) {
            return { label: "신중한 분석가", emoji: "🦉", desc: "돌다리도 두들겨 보고 건너는 꼼꼼함을 가졌어요." };
        }

        if (RD >= highThreshold) {
            return { label: "따뜻한 평화주의자", emoji: "🕊️", desc: "모두와 사이좋게 지내는 다정한 마음씨를 가졌어요." };
        }

        // Default or Low on all (Resilient/Stable or Independent)
        return { label: "무한한 잠재력의 새싹", emoji: "🌱", desc: "아직 어떤 꽃을 피울지 기대되는 아이예요." };
    }
}
