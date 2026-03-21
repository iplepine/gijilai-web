export class TemperamentClassifier {
    static analyze(scores: { NS: number, HA: number, RD: number, P: number }, parentScores: { NS: number, HA: number, RD: number, P: number }) {
        const { NS, HA, RD, P } = scores;
        const highThreshold = 60;
        const lowThreshold = 40;

        // 1. Current Manifestation - Child TCI (NS-HA-RD 조합 8유형)
        // 한국인 데이터 보정 기준 (방법 B) - 평균 점수를 0-100 스케일로 환산
        // NS > 3.2 → 64, HA > 2.8 → 56, RD > 3.0 → 60
        const isNS_H = NS > 64;
        const isHA_H = HA > 56;
        const isRD_H = RD > 60;

        let plant: { label: string, emoji: string, desc: string };

        if (isNS_H && !isHA_H && !isRD_H) {
            plant = { label: "자유로운 탐험가", emoji: "🦁", desc: "새로운 것에 거침없이 도전하며 혼자서도 잘 노는 아이" };
        } else if (isNS_H && !isHA_H && isRD_H) {
            plant = { label: "인기쟁이 활동가", emoji: "⭐", desc: "사람을 좋아하고 활기차며 어디서나 주목받는 분위기 메이커" };
        } else if (isNS_H && isHA_H && !isRD_H) {
            plant = { label: "예민한 완벽주의자", emoji: "🎨", desc: "하고 싶은 건 많지만 겁도 많아 생각이 많고 신중한 아이" };
        } else if (isNS_H && isHA_H && isRD_H) {
            plant = { label: "감성 풍부한 예술가", emoji: "🦋", desc: "주변 자극과 감정에 민감하며 풍부한 감수성을 지닌 아이" };
        } else if (!isNS_H && isHA_H && !isRD_H) {
            plant = { label: "조용한 분석가", emoji: "🦉", desc: "낯선 상황을 충분히 관찰한 뒤에 움직이는 내실 있는 아이" };
        } else if (!isNS_H && isHA_H && isRD_H) {
            plant = { label: "다정한 평화주의자", emoji: "🕊️", desc: "갈등을 싫어하며 주변 사람의 기분을 잘 살피는 착한 아이" };
        } else if (!isNS_H && !isHA_H && !isRD_H) {
            plant = { label: "단단한 마이웨이", emoji: "⛰️", desc: "감정 기복이 적고 남의 시선보다 자기 페이스가 중요한 아이" };
        } else {
            // L-L-H
            plant = { label: "성실한 조력자", emoji: "🌱", desc: "정해진 규칙을 잘 지키며 주변을 돕는 것을 좋아하는 아이" };
        }

        // 2. Innate Nature - Child Proxy
        let seed = {
            label: "유연하고 균형 잡힌 기질",
            desc: "어디로든 유연하게 적응하는 조화를 아는 아이",
            detail: "세상의 변화를 편안한 선으로 받아들이는 부드러운 본성을 품고 있습니다. 어떤 환경을 만나더라도 긍정적으로 적응하고 잘 어우러질 수 있는 잠재력을 가졌습니다."
        };
        if (NS >= 65 && HA >= 65) {
            seed = {
                label: "입체적이고 섬세한 기질",
                desc: "자기만의 경계와 결이 선명하게 빛나는 성향",
                detail: "자기만의 기준과 빛깔이 아주 선명한 아이예요. 그 입체성은 세상을 향한 예민하고 똑똑한 안테나이며, 보호자의 세심한 조율이 더해졌을 때 가장 독창적이고 매력적으로 성장할 것입니다."
            };
        } else if (HA >= 60 && NS <= 40) {
            seed = {
                label: "깊고 단단한 기질",
                desc: "긴 호흡으로 내실을 굳건하게 채워가는 성향",
                detail: "속을 쉽게 내어주지 않는 만큼, 그 안에 아주 커다란 잠재력을 꾹꾹 눌러 담은 아이예요. 행동하기까지 긴 기다림과 인내가 필요할 수 있지만, 한 번 시작하면 쉽게 포기하지 않는 굳건함을 보여줄 것입니다."
            };
        }

        // 3. Environment/Parent Proxy
        let soil = {
            label: "여유로운 수용의 마음",
            desc: "어떤 성향의 아이도 편안하게 받아주는 안정적인 태도",
            detail: "보호자님의 넓은 수용성과 안정적인 정서가 큰 강점이에요. 아이가 실패를 두려워하지 않고 마음껏 도전할 수 있는 든든하고 따뜻한 지지를 제공하고 있습니다."
        };

        if (parentScores.HA >= 60) {
            soil = {
                label: "신중한 보호의 마음",
                desc: "아이를 안전하게 보호하지만 유연함이 필요한 태도",
                detail: "신중함과 책임감으로 아이를 안전하게 지켜주는 울타리가 되어주네요. 다만, 마음속 걱정을 조금 덜고 아이가 스스로 부딪혀 볼 수 있도록 부드러운 지지를 더해주면 좋습니다."
            };
        } else if (parentScores.NS >= 60) {
            soil = {
                label: "열정적 추진의 마음",
                desc: "아이의 성장을 강하게 이끌지만 완급 조절이 필요한 태도",
                detail: "풍부한 에너지와 열정으로 아이 성장에 큰 자극을 제공해요. 보호자님의 빠른 호흡과 열기가 자칫 아이를 버겁게 하지 않도록, 가끔은 정적인 휴식을 섞어주는 완급 조절이 핵심입니다."
            };
        }

        // 4. Harmony Dynamics (Relationship Insight)
        const diffs = [
            { key: 'NS', label: '에너지의 속도 차이', diff: Math.abs(NS - parentScores.NS), desc: "세상을 탐색하려는 아이의 호기심 속도와 보호자님의 속도가 달라서 생기는 마찰 혹은 시너지입니다." },
            { key: 'HA', label: '안전 거리 감각', diff: Math.abs(HA - parentScores.HA), desc: "아이의 발걸음과 보호자님이 생각하는 안전한 경계 사이의 거리를 조율하는 과정에 놓여있습니다." },
            { key: 'RD', label: '마음의 온도차', diff: Math.abs(RD - parentScores.RD), desc: "감정을 표현하고 칭찬과 보상을 주고받는 서로의 방식이 다르기 때문에 세심한 통역이 필요합니다." },
            { key: 'P', label: '성취의 호흡', diff: Math.abs(P - parentScores.P), desc: "한 가지에 몰입하는 아이의 호흡과 이를 기다려주는 보호자님의 리듬 차이를 맞추어가는 단계입니다." }
        ];
        const majorDiff = diffs.sort((a, b) => b.diff - a.diff)[0];

        return {
            ...plant,
            seed,
            soil,
            harmony: {
                title: majorDiff.label,
                desc: majorDiff.desc,
                score: majorDiff.diff
            }
        };
    }
}
