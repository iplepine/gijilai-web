<!DOCTYPE html>

<html class="light" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;family=Noto+Sans+KR:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
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
                    },
                    fontFamily: {
                        "display": ["Plus Jakarta Sans", "Noto Sans KR", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        body {
            font-family: 'Plus Jakarta Sans', 'Noto Sans KR', sans-serif;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark text-[#0d1b1b] dark:text-white">
<div class="relative flex h-auto min-h-screen w-full max-w-[480px] mx-auto flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden pb-10">
<!-- TopAppBar -->
<div class="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10">
<div class="text-[#0d1b1b] dark:text-white flex size-12 shrink-0 items-center cursor-pointer">
<span class="material-symbols-outlined">arrow_back_ios</span>
</div>
<h2 class="text-[#0d1b1b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">공유하기</h2>
</div>
<div class="h-4"></div>
<!-- HeadlineText -->
<div class="px-4">
<h3 class="text-[#0d1b1b] dark:text-white tracking-light text-2xl font-bold leading-tight text-center pb-2 pt-5 font-display">발견의 기쁨을 나누세요</h3>
<!-- BodyText -->
<p class="text-[#4c9a9a] dark:text-[#a0caca] text-base font-normal leading-normal pb-6 pt-1 text-center">아이의 잠재력을 배우자와 함께 확인해보세요.</p>
</div>
<!-- Card: Summary with Masked Info -->
<div class="p-4 @container">
<div class="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start shadow-lg bg-white dark:bg-[#1a2e2e] overflow-hidden">
<div class="w-full bg-center bg-no-repeat aspect-video bg-cover" data-alt="Illustration of a happy child exploring stars and mountains" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuADwQwLfMxAypDxitwSQKVzigh1ZkfjT8e4zmQu6oHf96C5O9Kw7qc8pSPDvmyP2CXAovXI2CLQH_ZBADcxfT6XlvGC3frVwbQzi67BJhXQDe9djvKCNrGX4w_kBOVg58z-f0BuOLmu_M-TQU79ZWEgrt0vNa11i48q5_c5JbAN-5UWnZxU2fjz4hRHS4mNMRP6hucdqbCf8FvMTAdmK4Tytx3wcYgogZ-90e7VG--4chAvH67eXemXTTR8z8YzxuyyeqCbQoomVpk");'>
<div class="w-full h-full bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
<div class="bg-white/90 px-4 py-2 rounded-full shadow-sm">
<span class="text-primary font-bold text-sm">기질 분석 완료</span>
</div>
</div>
</div>
<div class="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-6 px-6">
<p class="text-[#0d1b1b] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] mb-2">우리 아이는 "열정 탐험가형"이래요!</p>
<div class="flex flex-col gap-2">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-sm">check_circle</span>
<p class="text-[#4c9a9a] dark:text-[#a0caca] text-sm font-medium leading-normal">사주와 기질로 보는 맞춤형 육아 가이드</p>
</div>
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-sm">lock</span>
<p class="text-[#4c9a9a] dark:text-[#a0caca] text-sm font-normal leading-normal">아이의 개인정보는 안전하게 보호됩니다.</p>
</div>
</div>
</div>
</div>
</div>
<!-- Referral Link Section -->
<div class="px-4 py-4">
<div class="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col gap-3">
<div class="flex justify-between items-center">
<span class="text-xs font-bold text-primary uppercase tracking-wider">추천인 코드</span>
<span class="text-xs text-[#4c9a9a]">클릭하여 복사</span>
</div>
<div class="flex items-center justify-between bg-white dark:bg-[#1a2e2e] rounded-lg p-3 border border-[#e0eeee] dark:border-[#2a4444] cursor-pointer">
<code class="text-[#0d1b1b] dark:text-white font-bold">PARENT-2024-X9Z2</code>
<span class="material-symbols-outlined text-primary size-5">content_copy</span>
</div>
</div>
</div>
<div class="h-4"></div>
<!-- Primary Sharing Buttons -->
<div class="px-4 flex flex-col gap-3">
<!-- KakaoTalk Share (Native Feel) -->
<button class="flex w-full items-center justify-center gap-3 rounded-xl h-14 bg-[#FEE500] text-[#3c1e1e] text-base font-bold transition-transform active:scale-95">
<span class="material-symbols-outlined">chat_bubble</span>
<span>카카오톡으로 공유하기</span>
</button>
<!-- SingleButton (Spouse Match) -->
<div class="flex py-1">
<button class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 flex-1 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] shadow-md transition-transform active:scale-95">
<span class="material-symbols-outlined mr-2">favorite</span>
<span class="truncate">배우자와도 궁합을 확인해보세요</span>
</button>
</div>
</div>
<!-- Other Share Options -->
<div class="px-4 mt-8">
<p class="text-center text-[#4c9a9a] text-xs font-medium mb-4 uppercase tracking-widest">더 많은 공유 옵션</p>
<div class="flex justify-center gap-6">
<div class="flex flex-col items-center gap-2">
<div class="size-12 rounded-full bg-white dark:bg-[#1a2e2e] shadow-sm flex items-center justify-center border border-[#e0eeee] dark:border-[#2a4444]">
<span class="material-symbols-outlined text-[#0d1b1b] dark:text-white">link</span>
</div>
<span class="text-[10px] text-[#4c9a9a]">링크 복사</span>
</div>
<div class="flex flex-col items-center gap-2">
<div class="size-12 rounded-full bg-white dark:bg-[#1a2e2e] shadow-sm flex items-center justify-center border border-[#e0eeee] dark:border-[#2a4444]">
<span class="material-symbols-outlined text-[#0d1b1b] dark:text-white">image</span>
</div>
<span class="text-[10px] text-[#4c9a9a]">이미지 저장</span>
</div>
<div class="flex flex-col items-center gap-2">
<div class="size-12 rounded-full bg-white dark:bg-[#1a2e2e] shadow-sm flex items-center justify-center border border-[#e0eeee] dark:border-[#2a4444]">
<span class="material-symbols-outlined text-[#0d1b1b] dark:text-white">more_horiz</span>
</div>
<span class="text-[10px] text-[#4c9a9a]">더보기</span>
</div>
</div>
</div>
<div class="h-10"></div>
</div>
</body></html>