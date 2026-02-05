<!DOCTYPE html>

<html class="light" lang="ko"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&amp;family=Noto+Sans+KR:wght@300;400;500;700&amp;display=swap" rel="stylesheet"/>
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
                        "display": ["Spline Sans", "Noto Sans KR", "sans-serif"]
                    },
                    borderRadius: {"DEFAULT": "1rem", "lg": "2rem", "xl": "3rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        .loading-dots:after {
            content: '.';
            animation: dots 1.5s steps(5, end) infinite;
        }
        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60% { content: '...'; }
            80%, 100% { content: ''; }
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
  </head>
<body class="bg-background-light dark:bg-background-dark font-display text-[#0d1b1b] dark:text-white">
<div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden max-w-md mx-auto shadow-2xl bg-background-light dark:bg-background-dark">
<!-- TopAppBar -->
<div class="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
<div class="text-[#0d1b1b] dark:text-white flex size-12 shrink-0 items-center cursor-pointer">
<span class="material-symbols-outlined">arrow_back_ios</span>
</div>
<h2 class="text-[#0d1b1b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">분석 및 결제</h2>
</div>
<!-- Main Content -->
<div class="flex-1 overflow-y-auto">
<!-- Summary Card -->
<div class="p-4 @container">
<div class="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start shadow-[0_4px_16px_rgba(0,0,0,0.05)] bg-white dark:bg-[#1a2e2e] overflow-hidden border border-gray-100 dark:border-gray-800">
<div class="w-full bg-center bg-no-repeat aspect-video bg-cover" data-alt="Illustration of a happy family with stars and data charts" style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAfsps7kpHLZgVeDUYHTMbCpodziFIHl3ordyxAPsYJfo7OUDCO2_ri_oqS9lclriLMyCUQwrPVGIX9HBt08ZxGsYXuASgJzy4tOban7P6VQdT5nkdDhHrxr1xqlXU0jRbSSip3e9EZ-OhYQSSmT0q52EdnSxN9oIC6EWAhkCupwS9YW4XqkrykEgCxposzTxx2a_Oz1k8QktNPtqUzbgaonpONOBD6840CCj7AVxKOZ6Ab2yDwt8TVdSBT034O6gI2UrzaDEIDIFs");'>
</div>
<div class="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-5 px-5">
<p class="text-[#0d1b1b] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">입력하신 정보로 이런 분석을 제공합니다</p>
<div class="mt-3 space-y-3">
<div class="flex items-center gap-3">
<div class="bg-primary/20 p-2 rounded-full">
<span class="material-symbols-outlined text-primary text-sm">psychology</span>
</div>
<p class="text-[#4c9a9a] dark:text-primary/80 text-sm font-medium">아이의 과학적 기질 분석</p>
</div>
<div class="flex items-center gap-3">
<div class="bg-primary/20 p-2 rounded-full">
<span class="material-symbols-outlined text-primary text-sm">favorite</span>
</div>
<p class="text-[#4c9a9a] dark:text-primary/80 text-sm font-medium">부모 기질 궁합 리포트</p>
</div>
<div class="flex items-center gap-3">
<div class="bg-primary/20 p-2 rounded-full">
<span class="material-symbols-outlined text-primary text-sm">auto_awesome</span>
</div>
<p class="text-[#4c9a9a] dark:text-primary/80 text-sm font-medium">사주 명식 풀이 및 맞춤 솔루션</p>
</div>
</div>
</div>
</div>
</div>
<!-- Loading State Section (Excitement Builder) -->
<div class="px-6 py-8">
<div class="flex flex-col items-center justify-center text-center space-y-4">
<div class="relative">
<div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
<div class="absolute inset-0 flex items-center justify-center">
<span class="material-symbols-outlined text-primary">analytics</span>
</div>
</div>
<div class="space-y-1 h-12">
<!-- Simulated status cycling -->
<p class="text-primary font-bold text-lg animate-pulse">기질 데이터 분석 중<span class="loading-dots"></span></p>
<p class="text-xs text-gray-500 dark:text-gray-400">거의 다 준비되었습니다!</p>
</div>
</div>
</div>
<!-- Payment Details Header -->
<h3 class="text-[#0d1b1b] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">결제 상세</h3>
<!-- Price Breakdown -->
<div class="px-4 mx-4 bg-white dark:bg-[#1a2e2e] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
<div class="flex justify-between gap-x-6 py-4 border-b border-gray-50 dark:border-gray-700">
<div class="flex flex-col">
<p class="text-[#0d1b1b] dark:text-white text-sm font-bold">리포트 평생 소장권</p>
<p class="text-[#4c9a9a] text-xs">한정 기간 할인가 적용</p>
</div>
<p class="text-[#0d1b1b] dark:text-white text-lg font-bold text-right">$1</p>
</div>
<div class="flex justify-between gap-x-6 py-4">
<p class="text-[#4c9a9a] text-sm font-normal">총 결제 금액</p>
<p class="text-primary text-xl font-black text-right">$1.00</p>
</div>
</div>
<div class="p-4 space-y-3">
<div class="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500 px-2">
<span class="material-symbols-outlined text-[14px] mt-0.5">info</span>
<p>결제 즉시 분석 리포트가 생성되며, 마이페이지에서 언제든지 다시 확인하실 수 있습니다.</p>
</div>
</div>
</div>
<!-- Sticky Bottom Button -->
<div class="p-4 bg-background-light dark:bg-background-dark border-t border-gray-100 dark:border-gray-800">
<div class="flex py-3">
<button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 flex-1 bg-primary text-[#0d1b1b] text-lg font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/30 active:scale-95 transition-transform">
<span class="truncate">결제하고 리포트 받기</span>
</button>
</div>
</div>
<!-- Space for iOS Home Bar -->
<div class="h-8 bg-background-light dark:bg-background-dark"></div>
</div>
</body></html>