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
                        "background-light": "#f6f8f8",
                        "background-dark": "#102222",
                        "navy-custom": "#0d1b1b",
                        "green-custom": "#4c9a9a"
                    },
                    fontFamily: {
                        "display": ["Public Sans", "Noto Sans KR", "sans-serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
<title>통합 결과 리포트</title>
<style type="text/tailwindcss">
        body {
            min-height: 100dvh;
        }
        .ios-bottom-padding {
            padding-bottom: env(safe-area-inset-bottom, 24px);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display text-navy-custom dark:text-white antialiased">
<div class="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-green-custom/10">
<div class="flex items-center p-4 justify-between max-w-md mx-auto">
<div class="text-navy-custom dark:text-white flex size-10 shrink-0 items-center justify-center">
<span class="material-symbols-outlined">arrow_back_ios</span>
</div>
<h2 class="text-navy-custom dark:text-white text-lg font-bold leading-tight flex-1 text-center">통합 양육 보고서</h2>
<div class="flex size-10 items-center justify-end">
<span class="material-symbols-outlined">share</span>
</div>
</div>
</div>
<div class="bg-background-light dark:bg-background-dark sticky top-[60px] z-40 border-b border-green-custom/10">
<div class="flex px-4 justify-between max-w-md mx-auto">
<button class="flex flex-col items-center justify-center border-b-[3px] border-transparent text-green-custom/60 py-4 flex-1">
<p class="text-sm font-bold">📊 기질 분석</p>
</button>
<button class="flex flex-col items-center justify-center border-b-[3px] border-transparent text-green-custom/60 py-4 flex-1">
<p class="text-sm font-bold">🔮 사주 분석</p>
</button>
<button class="flex flex-col items-center justify-center border-b-[3px] border-primary text-navy-custom dark:text-white py-4 flex-1">
<p class="text-sm font-bold">⭐ 통합 솔루션</p>
</button>
</div>
</div>
<main class="max-w-md mx-auto pb-12">
<div class="p-6">
<div class="bg-gradient-to-br from-white to-primary/5 dark:from-navy-custom/60 dark:to-primary/10 rounded-2xl p-6 shadow-sm border border-primary/20 relative overflow-hidden">
<div class="absolute -right-4 -top-4 size-24 bg-primary/10 rounded-full blur-2xl"></div>
<div class="flex items-center gap-4 mb-4">
<div class="relative">
<div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full border-4 border-white dark:border-navy-custom shadow-md size-20" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuBhsrqgTmG9tnrSnG5hpisFxrd99wsnpi746Hs-LA3HOnnn6VXjrULLVpX8UqdmY7zCwKyXUQp6qsSALCVJmoRWiIXnXFU37Cxdn_FqDKkJ4l77bop9WOK_va87XkCOjDiyTB8JoJotPFatHdKjn5q07wmDQDYbKfhIpjR4TMfj7i0g1MBcycl0b14FyqvXF8slFxvp9ujUsSNL-h9yiCtPMFs0HhbJGNo5W-38XS2qmo9WAbWRH9qx1R7MfPoIyLI1WSON7kbWDN0");'></div>
<div class="absolute -bottom-1 -right-1 bg-primary text-navy-custom text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-navy-custom">FIRE</div>
</div>
<div>
<h3 class="text-xs font-bold text-primary tracking-widest uppercase mb-1">Main Archetype</h3>
<p class="text-2xl font-bold text-navy-custom dark:text-white leading-tight">열정 탐험가형</p>
</div>
</div>
<div class="bg-white/50 dark:bg-navy-custom/40 rounded-xl p-4 border border-white dark:border-green-custom/10">
<div class="flex items-center gap-2 mb-1">
<span class="material-symbols-outlined text-primary text-sm">favorite</span>
<p class="text-sm font-bold text-navy-custom dark:text-primary">환상의 찰떡궁합</p>
</div>
<p class="text-sm text-green-custom dark:text-white/70 leading-relaxed">
                    부모님의 포용력 있는 '토(土)' 기운이 아이의 넘치는 '화(火)' 기운을 따뜻하게 안아주는 85%의 최우수 궁합입니다.
                </p>
</div>
</div>
</div>
<div class="px-6 space-y-6">
<div class="py-2">
<div class="flex items-center gap-2 mb-2">
<div class="h-4 w-1 bg-primary rounded-full"></div>
<h4 class="text-base font-bold text-navy-custom dark:text-white">'열정 탐험가형'이란?</h4>
</div>
<p class="text-sm text-green-custom dark:text-white/70 leading-relaxed bg-primary/5 p-4 rounded-xl border-l-4 border-primary">
                높은 활동성과 화(Fire)의 추진력을 가진 아이입니다. 세상에 대한 호기심이 무궁무진하며, 스스로 목표를 정했을 때 엄청난 몰입도를 보여주는 미래의 리더 타입입니다.
            </p>
</div>
<div class="grid gap-4">
<div class="bg-white dark:bg-navy-custom/40 rounded-2xl p-5 shadow-sm border border-green-custom/10">
<div class="flex items-center gap-3 mb-4">
<div class="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
<span class="material-symbols-outlined">rocket_launch</span>
</div>
<h3 class="text-navy-custom dark:text-white font-bold">에너지 맞춤 놀이 제안</h3>
</div>
<ul class="space-y-3">
<li class="flex items-start gap-2 text-sm">
<span class="text-primary font-bold">01.</span>
<p class="text-green-custom dark:text-white/80"><strong class="text-navy-custom dark:text-white">다이나믹 장애물 코스:</strong> 거실이나 야외에 매트, 상자를 활용해 아이만의 루트를 만들고 기록에 도전하게 하세요.</p>
</li>
<li class="flex items-start gap-2 text-sm">
<span class="text-primary font-bold">02.</span>
<p class="text-green-custom dark:text-white/80"><strong class="text-navy-custom dark:text-white">감정 컬러 페인팅:</strong> 넘치는 화 에너지를 전지에 자유롭게 색으로 표현하며 정서적 이완을 돕습니다.</p>
</li>
</ul>
</div>
<div class="bg-white dark:bg-navy-custom/40 rounded-2xl p-5 shadow-sm border border-green-custom/10">
<div class="flex items-center gap-3 mb-4">
<div class="size-9 bg-orange-400/10 rounded-lg flex items-center justify-center text-orange-400">
<span class="material-symbols-outlined">chat_bubble</span>
</div>
<h3 class="text-navy-custom dark:text-white font-bold">필수 대화 스크립트</h3>
</div>
<div class="space-y-3">
<div class="bg-background-light dark:bg-navy-custom/60 p-3 rounded-lg border-l-4 border-orange-400">
<p class="text-[11px] text-green-custom mb-1 font-bold">감정 읽어주기</p>
<p class="text-sm italic dark:text-white/90">"와, 정말 멋진 계획인걸! 네 눈이 반짝거리는 걸 보니 정말 신나 보여."</p>
</div>
<div class="bg-background-light dark:bg-navy-custom/60 p-3 rounded-lg border-l-4 border-orange-400">
<p class="text-[11px] text-green-custom mb-1 font-bold">행동 조절 돕기</p>
<p class="text-sm italic dark:text-white/90">"열정이 넘치는구나! 우리 딱 10초만 숨을 크게 들이마시고 다시 시작해볼까?"</p>
</div>
</div>
</div>
<div class="bg-white dark:bg-navy-custom/40 rounded-2xl p-5 shadow-sm border border-green-custom/10">
<div class="flex items-center gap-3 mb-4">
<div class="size-9 bg-green-500/10 rounded-lg flex items-center justify-center text-green-500">
<span class="material-symbols-outlined">home_work</span>
</div>
<h3 class="text-navy-custom dark:text-white font-bold">환경 · 루틴 가이드</h3>
</div>
<ul class="space-y-3">
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-green-500 text-lg">check_circle</span>
<p class="text-sm text-green-custom dark:text-white/80">잠들기 전 30분, 정적인 '쿨다운(Cool-down)' 루틴을 반드시 포함해주세요.</p>
</li>
<li class="flex items-start gap-3">
<span class="material-symbols-outlined text-green-500 text-lg">check_circle</span>
<p class="text-sm text-green-custom dark:text-white/80">아이 스스로 교구의 위치를 정하게 하여 자기 주도성을 키워주는 환경이 좋습니다.</p>
</li>
</ul>
</div>
<div class="bg-white dark:bg-navy-custom/40 rounded-2xl p-5 shadow-sm border border-green-custom/10">
<div class="flex items-center gap-3 mb-4">
<div class="size-9 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500">
<span class="material-symbols-outlined">self_care</span>
</div>
<h3 class="text-navy-custom dark:text-white font-bold">부모 멘탈 케어</h3>
</div>
<div class="p-4 bg-purple-500/5 rounded-xl border border-purple-500/10">
<p class="text-sm text-navy-custom dark:text-white leading-relaxed text-center font-medium italic">
                        "아이가 넘치는 에너지를 보여주는 것은 당신이 아이를 건강하고 안전하게 키워내고 있다는 증거입니다. 오늘도 충분히 잘하고 계세요."
                    </p>
</div>
</div>
</div>
</div>
<div class="px-6 mt-10 space-y-3 ios-bottom-padding">
<button class="flex w-full items-center justify-center rounded-2xl h-14 bg-primary text-navy-custom font-bold text-lg gap-2 shadow-lg shadow-primary/20 hover:brightness-105 active:scale-[0.98] transition-all">
<span class="material-symbols-outlined">file_download</span>
            보고서 PDF 다운로드
        </button>
<button class="flex w-full items-center justify-center rounded-2xl h-14 bg-white dark:bg-navy-custom/60 border border-green-custom/20 text-navy-custom dark:text-white font-bold text-lg gap-2 active:scale-[0.98] transition-all">
<span class="material-symbols-outlined">mail</span>
            이메일로 발송하기
        </button>
</div>
</main>

</body></html>