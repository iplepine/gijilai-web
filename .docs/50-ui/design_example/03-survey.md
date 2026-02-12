<!DOCTYPE html>
<html class="light" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&amp;family=Noto+Sans+KR:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#11d4d4",
                        "background-light": "#f8fafc",
                        "background-dark": "#0f172a",
                        "soft-bg": "#f0fdfa"
                    },
                    fontFamily: {
                        "display": ["Public Sans", "Noto Sans KR", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "1rem",
                        "2xl": "1.5rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
<style type="text/tailwindcss">
        @layer base {
            body {
                -webkit-tap-highlight-color: transparent;
                -webkit-font-smoothing: antialiased;
            }
        }
        .likert-button:checked + .likert-label {
            @apply border-primary bg-primary/5 text-primary font-bold;
        }
        .progress-glow {
            box-shadow: 0 0 10px rgba(17, 212, 212, 0.4);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
<div class="relative flex min-h-screen w-full flex-col overflow-x-hidden mx-auto max-w-[430px] bg-background-light dark:bg-background-dark">
<header class="flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-3 sticky top-0 z-20">
<button class="flex size-10 items-center justify-start text-slate-600 dark:text-slate-400">
<span class="material-symbols-outlined">arrow_back_ios</span>
</button>
<h1 class="flex-1 text-center text-base font-bold tracking-tight">기질 분석 설문</h1>
<div class="size-10 flex items-center justify-end">
<span class="material-symbols-outlined text-slate-400 text-xl">help_outline</span>
</div>
</header>
<main class="flex flex-col flex-1 px-5 pb-10">
<div class="mt-2 mb-8">
<div class="flex justify-between items-end mb-2">
<div class="flex flex-col">
<span class="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">Progress</span>
<div class="flex items-center gap-1.5">
<p class="text-2xl font-bold text-slate-900 dark:text-white leading-none">32%</p>
<p class="text-xs text-slate-500 font-medium">이제 절반 넘었어요! 힘내세요 ✨</p>
</div>
</div>
<div class="flex items-center gap-1 mb-1">
<span class="material-symbols-outlined text-[14px] text-emerald-500 animate-pulse">sync</span>
<span class="text-[11px] font-medium text-slate-400">자동 저장 중</span>
</div>
</div>
<div class="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
<div class="h-full bg-primary progress-glow transition-all duration-700 ease-out rounded-full" style="width: 32%;"></div>
</div>
</div>
<div class="space-y-10">
<div class="flex items-center gap-2">
<div class="w-1 h-5 bg-primary rounded-full"></div>
<h2 class="text-sm font-bold text-slate-500">아이의 기질 (생후 24-36개월)</h2>
</div>
<section class="space-y-6">
<div class="space-y-2">
<span class="text-primary font-bold text-sm">Q1.</span>
<h3 class="text-xl font-bold leading-relaxed text-slate-800 dark:text-slate-100">
                            우리 아이는 낯선 장소나 처음 보는 사람에게 금방 다가가나요?
                        </h3>
</div>
<div class="flex flex-col gap-3">
<div class="flex justify-between px-2 mb-1">
<span class="text-[11px] text-slate-400 font-medium">전혀 그렇지 않다</span>
<span class="text-[11px] text-slate-400 font-medium">매우 그렇다</span>
</div>
<div class="flex justify-between items-center gap-2">
<label class="relative flex-1 group cursor-pointer">
<input class="hidden likert-button" name="q1" type="radio" value="1"/>
<div class="likert-label flex items-center justify-center h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all text-lg font-semibold text-slate-400">1</div>
</label>
<label class="relative flex-1 group cursor-pointer">
<input class="hidden likert-button" name="q1" type="radio" value="2"/>
<div class="likert-label flex items-center justify-center h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all text-lg font-semibold text-slate-400">2</div>
</label>
<label class="relative flex-1 group cursor-pointer">
<input checked="" class="hidden likert-button" name="q1" type="radio" value="3"/>
<div class="likert-label flex items-center justify-center h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all text-lg font-semibold text-slate-400">3</div>
</label>
<label class="relative flex-1 group cursor-pointer">
<input class="hidden likert-button" name="q1" type="radio" value="4"/>
<div class="likert-label flex items-center justify-center h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all text-lg font-semibold text-slate-400">4</div>
</label>
<label class="relative flex-1 group cursor-pointer">
<input class="hidden likert-button" name="q1" type="radio" value="5"/>
<div class="likert-label flex items-center justify-center h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all text-lg font-semibold text-slate-400">5</div>
</label>
</div>
</div>
</section>
<section class="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800/50">
<div class="flex items-center gap-2 mb-4">
<div class="w-1 h-5 bg-amber-400 rounded-full"></div>
<h2 class="text-sm font-bold text-slate-500">부모의 양육 스타일</h2>
</div>
<div class="space-y-2">
<span class="text-amber-500 font-bold text-sm">Q2.</span>
<h3 class="text-xl font-bold leading-relaxed text-slate-800 dark:text-slate-100">
                            아이의 돌발 행동이 발생했을 때, 감정적으로 대응하기보다 먼저 침착하게 이유를 물어보시나요?
                        </h3>
</div>
<div class="flex flex-col gap-3">
<div class="flex justify-between items-center gap-2">
<label class="relative flex-1 group cursor-pointer">
<input class="hidden likert-button" name="q2" type="radio" value="1"/>
<div class="likert-label flex items-center justify-center h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all text-lg font-semibold text-slate-400">1</div>
</label>
<label class="relative flex-1 group cursor-pointer">
<input class="hidden likert-button" name="q2" type="radio" value="2"/>
<div class="likert-label flex items-center justify-center h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all text-lg font-semibold text-slate-400">2</div>
</label>
<label class="relative flex-1 group cursor-pointer">
<input class="hidden likert-button" name="q2" type="radio" value="3"/>
<div class="likert-label flex items-center justify-center h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all text-lg font-semibold text-slate-400">3</div>
</label>
<label class="relative flex-1 group cursor-pointer">
<input class="hidden likert-button" name="q2" type="radio" value="4"/>
<div class="likert-label flex items-center justify-center h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all text-lg font-semibold text-slate-400">4</div>
</label>
<label class="relative flex-1 group cursor-pointer">
<input class="hidden likert-button" name="q2" type="radio" value="5"/>
<div class="likert-label flex items-center justify-center h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all text-lg font-semibold text-slate-400">5</div>
</label>
</div>
</div>
</section>
</div>
</main>
<footer class="p-6 bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 sticky bottom-0">
<div class="flex gap-4 max-w-full">
<button class="flex-1 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-lg active:scale-95 transition-transform">
                    이전
                </button>
<button class="flex-[2] h-14 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-2">
                    다음 질문
                    <span class="material-symbols-outlined text-xl">arrow_forward</span>
</button>
</div>
<div class="h-5"></div>
</footer>
</div>

</body></html>