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
                        "primary": "#117a7a", // Updated to a more professional deep green for PWA
                        "primary-light": "#11d4d4",
                        "primary-dark": "#0d1b1b",
                        "background-light": "#fcfdfe",
                        "background-dark": "#102222",
                    },
                    fontFamily: {
                        "display": ["Public Sans", "Noto Sans KR", "sans-serif"]
                    },
                    borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1rem", "full": "9999px" },
                },
            },
        }
    </script>
<style type="text/tailwindcss">
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            -webkit-tap-highlight-color: transparent;
            min-height: 100dvh;
        }select, input[type="date"], input[type="time"] {
            appearance: none;
            -webkit-appearance: none;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display text-primary-dark dark:text-white flex flex-col">
<header class="sticky top-0 z-10 flex items-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-gray-100 dark:border-gray-800">
<div class="text-primary-dark dark:text-white flex size-10 shrink-0 items-center cursor-pointer">
<span class="material-symbols-outlined">arrow_back_ios</span>
</div>
<h2 class="text-lg font-bold leading-tight tracking-tight flex-1 text-center pr-10">접수 및 동의</h2>
</header>
<main class="flex-1 overflow-y-auto pb-32">
<div class="flex flex-col gap-2 p-4 pt-6">
<div class="flex justify-between items-end">
<span class="text-xs font-bold text-primary tracking-wider uppercase">Step 01</span>
<span class="text-xs font-medium opacity-50">1 / 4</span>
</div>
<div class="rounded-full bg-gray-100 dark:bg-gray-800 h-1.5 w-full overflow-hidden">
<div class="h-full rounded-full bg-primary" style="width: 25%;"></div>
</div>
</div>
<section class="mt-6 px-4">
<h3 class="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">이용 동의</h3>
<div class="bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-4">
<label class="flex items-center gap-3 cursor-pointer group">
<input class="size-5 rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600" type="checkbox"/>
<span class="text-[15px] font-medium text-gray-700 dark:text-gray-200">개인정보 수집 및 이용 동의 (필수)</span>
<span class="material-symbols-outlined text-gray-400 text-sm ml-auto">chevron_right</span>
</label>
<label class="flex items-center gap-3 cursor-pointer group">
<input class="size-5 rounded border-gray-300 text-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600" type="checkbox"/>
<span class="text-[15px] font-medium text-gray-700 dark:text-gray-200">서비스 이용약관 동의 (필수)</span>
<span class="material-symbols-outlined text-gray-400 text-sm ml-auto">chevron_right</span>
</label>
<div class="pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
<p class="text-xs text-red-500/80 leading-relaxed font-medium">
<span class="material-symbols-outlined align-middle text-xs mr-0.5">info</span>
                        본 서비스는 의학적·임상적 진단이 아닙니다.
                    </p>
</div>
</div>
</section>
<section class="mt-8 px-4">
<h3 class="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">기본 정보 입력</h3>
<div class="space-y-5">
<div>
<label class="block text-sm font-bold mb-2 ml-1 text-gray-600 dark:text-gray-400">아이와의 관계</label>
<div class="relative">
<select class="w-full h-14 pl-4 pr-10 rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary text-base appearance-none">
<option value="">선택해주세요</option>
<option value="mother">엄마</option>
<option value="father">아빠</option>
<option value="grandparent">조부모</option>
<option value="other">기타 보호자</option>
</select>
<span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
</div>
</div>
<div>
<label class="block text-sm font-bold mb-2 ml-1 text-gray-600 dark:text-gray-400">아이 성별</label>
<div class="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
<label class="flex-1">
<input class="hidden peer" name="gender" type="radio" value="male"/>
<div class="h-12 flex items-center justify-center rounded-xl font-bold text-gray-500 peer-checked:bg-white dark:peer-checked:bg-gray-700 peer-checked:text-primary peer-checked:shadow-sm transition-all cursor-pointer">남아</div>
</label>
<label class="flex-1">
<input class="hidden peer" name="gender" type="radio" value="female"/>
<div class="h-12 flex items-center justify-center rounded-xl font-bold text-gray-500 peer-checked:bg-white dark:peer-checked:bg-gray-700 peer-checked:text-primary peer-checked:shadow-sm transition-all cursor-pointer">여아</div>
</label>
</div>
</div>
<div class="grid grid-cols-2 gap-3">
<div class="col-span-1">
<label class="block text-sm font-bold mb-2 ml-1 text-gray-600 dark:text-gray-400">생년월일</label>
<div class="relative">
<input class="w-full h-14 pl-4 pr-3 rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary text-base" type="date"/>
</div>
</div>
<div class="col-span-1">
<label class="block text-sm font-bold mb-2 ml-1 text-gray-600 dark:text-gray-400">태어난 시간</label>
<div class="relative">
<input class="w-full h-14 pl-4 pr-3 rounded-2xl border-none bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-primary text-base" type="time"/>
</div>
</div>
<p class="col-span-2 text-xs text-gray-400 ml-1 mt-1">
<span class="material-symbols-outlined align-middle text-xs mr-0.5">help</span>
                        모르시면 대략 입력 가능합니다.
                    </p>
</div>
</div>
</section>
<section class="mt-10 px-4">
<div class="flex items-baseline justify-between mb-3">
<h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">주요 육아 고민</h3>
<span class="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">최대 3개</span>
</div>
<p class="text-[13px] text-gray-500 mb-4 ml-1">선택한 고민에 맞춰 솔루션을 조정합니다.</p>
<div class="flex flex-wrap gap-2.5">
<label class="cursor-pointer">
<input class="hidden peer" name="concern" type="checkbox" value="sleep"/>
<span class="inline-flex px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white transition-all text-sm font-bold shadow-sm peer-checked:shadow-primary/20">수면</span>
</label>
<label class="cursor-pointer">
<input class="hidden peer" name="concern" type="checkbox" value="discipline"/>
<span class="inline-flex px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white transition-all text-sm font-bold shadow-sm peer-checked:shadow-primary/20">훈육</span>
</label>
<label class="cursor-pointer">
<input class="hidden peer" name="concern" type="checkbox" value="social"/>
<span class="inline-flex px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white transition-all text-sm font-bold shadow-sm peer-checked:shadow-primary/20">사회성</span>
</label>
<label class="cursor-pointer">
<input class="hidden peer" name="concern" type="checkbox" value="emotion"/>
<span class="inline-flex px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white transition-all text-sm font-bold shadow-sm peer-checked:shadow-primary/20">정서 조절</span>
</label>
<label class="cursor-pointer">
<input class="hidden peer" name="concern" type="checkbox" value="tantrum"/>
<span class="inline-flex px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white transition-all text-sm font-bold shadow-sm peer-checked:shadow-primary/20">떼쓰기</span>
</label>
<label class="cursor-pointer">
<input class="hidden peer" name="concern" type="checkbox" value="language"/>
<span class="inline-flex px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white transition-all text-sm font-bold shadow-sm peer-checked:shadow-primary/20">언어 발달</span>
</label>
<label class="cursor-pointer">
<input class="hidden peer" name="concern" type="checkbox" value="eat"/>
<span class="inline-flex px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white transition-all text-sm font-bold shadow-sm peer-checked:shadow-primary/20">식습관</span>
</label>
</div>
</section>
</main>
<footer class="fixed bottom-0 left-0 right-0 p-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-gray-100 dark:border-gray-800">
<div class="max-w-md mx-auto">
<button class="w-full h-15 py-4 bg-primary text-white font-bold text-lg rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all">
                동의하고 계속하기
            </button>
</div>
</footer>

</body></html>