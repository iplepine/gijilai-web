<!DOCTYPE html>
<html class="light" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>기질과 사주 육아 코칭</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;700;900&amp;family=Noto+Sans+KR:wght@400;500;700;900&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "primary": "#11d4d4",
                        "background-light": "#fdfdfb",
                        "background-dark": "#0d1b1b",
                        "navy": "#0d1b1b",
                        "deep-green": "#1a4d4d"
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
        body {
            font-family: 'Public Sans', 'Noto Sans KR', sans-serif;
            -webkit-tap-highlight-color: transparent;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .ios-shadow {
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        }
        .floating-cta {
            padding-bottom: env(safe-area-inset-bottom);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark text-navy dark:text-white transition-colors duration-300">
<div class="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-32">
<nav class="sticky top-0 z-50 flex items-center bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-xl p-4 justify-between border-b border-gray-100 dark:border-gray-800">
<div class="text-navy dark:text-white flex size-10 items-center justify-center">
<span class="material-symbols-outlined">menu</span>
</div>
<h2 class="text-navy dark:text-white text-base font-bold flex-1 text-center">기질×사주 분석</h2>
<div class="size-10 flex items-center justify-center">
<span class="material-symbols-outlined">account_circle</span>
</div>
</nav>
<header class="px-5 pt-8 pb-6 flex flex-col items-center text-center @container">
<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-deep-green dark:text-primary text-[11px] font-bold mb-4">
<span class="material-symbols-outlined text-[14px] font-bold">verified</span>
                SCIENTIFIC &amp; TRADITIONAL
            </div>
<h1 class="text-navy dark:text-white text-[28px] font-black leading-tight tracking-tight mb-4">
                아이 기질 × 사주 통합 분석<br/>
<span class="text-primary">우리 가족을 위한 맞춤 양육 가이드</span>
</h1>
<p class="text-gray-600 dark:text-gray-400 text-base font-medium leading-relaxed mb-8">
                10분 설문으로 전문 상담센터 수준의<br/>리포트를 받아보세요.
            </p>
<div class="w-full relative rounded-2xl overflow-hidden aspect-[4/3] mb-8 ios-shadow">
<div class="absolute inset-0 bg-cover bg-center" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuCdSHZDt1bcAu2tcOFLEnLvD4mWm2Xvnu1Wif1pGXL_U8tcKcQ9hZ3dALvlEPiCN11ROGmb5JjbrUMt9o4plWLofle3F5g8lbsy-LdUbvmGKRPOhmXLjfou2x69P2Npl47m4jfyrCtHg6UPQBnEZhVl9QspIzsrVY5XzzjDKnv9p83MuHP_t8sQACPyA8UwzCqpuF6av9hfi0gj05pz2DwDNHABUyXy2X5lZpGUbjldrEqE6CERU2tScjaUXwnVhkC_oaudqRDVp4Q");'></div>
<div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
</div>
<div class="grid grid-cols-1 gap-4 w-full mb-8">
<div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 ios-shadow">
<div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">psychology</span>
</div>
<div class="text-left">
<p class="text-sm font-bold text-navy dark:text-white">과학적 기질 진단</p>
<p class="text-xs text-gray-500">CBQ 기반 정교한 심리 분석</p>
</div>
</div>
<div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 ios-shadow">
<div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">auto_awesome</span>
</div>
<div class="text-left">
<p class="text-sm font-bold text-navy dark:text-white">전통 명리 솔루션</p>
<p class="text-xs text-gray-500">타고난 기운과 성향의 조화</p>
</div>
</div>
<div class="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 ios-shadow">
<div class="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">auto_graph</span>
</div>
<div class="text-left">
<p class="text-sm font-bold text-navy dark:text-white">맞춤 훈육 가이드</p>
<p class="text-xs text-gray-500">상담센터 수준의 상세 솔루션</p>
</div>
</div>
</div>
<div class="w-full space-y-3">
<button class="w-full h-16 bg-primary text-navy font-black text-lg rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all">
                    지금 접수하고 리포트 받기 – $1
                </button>
<button class="w-full h-14 bg-white dark:bg-gray-800 text-navy dark:text-white font-bold text-base rounded-2xl border border-gray-200 dark:border-gray-700 active:scale-[0.98] transition-all">
                    샘플 리포트 미리보기
                </button>
<div class="pt-2">
<p class="text-[13px] text-gray-600 dark:text-gray-400 font-medium flex items-center justify-center gap-1.5">
<span class="material-symbols-outlined text-[16px] text-primary">group</span>
                        이미 12,430명의 부모님이 리포트를 확인했습니다
                    </p>
<p class="text-[11px] text-gray-400 mt-2 uppercase tracking-tight">
                        CBQ, Goodness of Fit 이론 기반
                    </p>
</div>
</div>
</header>
<section class="bg-gray-50 dark:bg-gray-900/40 py-10 px-5">
<div class="grid grid-cols-3 gap-3">
<div class="text-center p-3">
<p class="text-2xl font-black text-navy dark:text-white">12K+</p>
<p class="text-[10px] text-gray-500 uppercase font-bold">누적 분석</p>
</div>
<div class="text-center p-3 border-x border-gray-200 dark:border-gray-800">
<p class="text-2xl font-black text-navy dark:text-white">98%</p>
<p class="text-[10px] text-gray-500 uppercase font-bold">만족도</p>
</div>
<div class="text-center p-3">
<p class="text-2xl font-black text-navy dark:text-white">4.9</p>
<p class="text-[10px] text-gray-500 uppercase font-bold">평균 평점</p>
</div>
</div>
</section>
<section class="py-12 px-5">
<h2 class="text-xl font-black mb-6 text-center">부모님들의 실제 후기</h2>
<div class="flex flex-col gap-4">
<div class="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ios-shadow">
<div class="flex gap-0.5 text-primary mb-3">
<span class="material-symbols-outlined text-[14px]">star</span>
<span class="material-symbols-outlined text-[14px]">star</span>
<span class="material-symbols-outlined text-[14px]">star</span>
<span class="material-symbols-outlined text-[14px]">star</span>
<span class="material-symbols-outlined text-[14px]">star</span>
</div>
<p class="text-[14px] leading-relaxed text-gray-700 dark:text-gray-300 mb-4 font-medium">
                        "아이의 고집이 왜 센지 몰랐는데, 사주와 기질을 동시에 분석해보니 비로소 이해가 갔어요. 알려주신 훈육법대로 하니 아이와의 마찰이 확 줄었습니다."
                    </p>
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-cover" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCalypbe1oKz0oGatm7fv55aH9IaFsCIjCPCSsHBlWk45lMnFJLqln6JlhUsIbvgmpTKH7wkqPC9G5PAgEXS1VHosP0OSPSwnarw1xuxq_VixE_anCuWDMHrBrOGqIf9fO6Z7gUR9AdET6B3uP3VNV-Tg2p-QcHlcIIb8isS40sSMRzzePbJPs2z_3u4M0Sm6UBhvMsK2PzGcg3X_17x9PY13AiQi_hVgmSjCwnVVG46aBIocUyEleeBigrQLby_uQMOL1FJR4jdXM');"></div>
<span class="text-xs font-bold">김지현 님 (5세 여아)</span>
</div>
</div>
</div>
</section>
<footer class="py-12 px-5 text-center bg-gray-50 dark:bg-transparent">
<div class="flex justify-center gap-8 mb-6 opacity-40">
<span class="material-symbols-outlined text-3xl text-navy dark:text-white">verified_user</span>
<span class="material-symbols-outlined text-3xl text-navy dark:text-white">lock</span>
<span class="material-symbols-outlined text-3xl text-navy dark:text-white">credit_card</span>
</div>
<p class="text-[11px] text-gray-400 leading-relaxed">
                © 2024 기질과 사주 육아 코칭. All rights reserved.<br/>
                본 분석 결과는 육아 참고용이며 의학적 진단을 대체할 수 없습니다.
            </p>
</footer>
<div class="fixed bottom-0 left-0 right-0 z-[100] p-4 bg-gradient-to-t from-background-light via-background-light/95 to-transparent dark:from-background-dark dark:via-background-dark/95 floating-cta">
<div class="max-w-md mx-auto">
<button class="w-full h-14 bg-primary text-navy font-black text-base rounded-2xl shadow-2xl flex items-center justify-center gap-2 active:scale-95 transition-all">
<span>분석 시작하기</span>
<span class="bg-navy/10 px-2 py-0.5 rounded-md text-xs font-bold">$1</span>
<span class="material-symbols-outlined text-[20px]">arrow_forward</span>
</button>
</div>
</div>
</div>

</body></html>