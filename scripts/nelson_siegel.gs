/**
 * Nelson-Siegel 수익률 곡선 모델 파라미터 추정
 *
 * 수식: y(τ) = β₀ + β₁ × [(1-e^(-τ/λ))/(τ/λ)] + β₂ × [(1-e^(-τ/λ))/(τ/λ) - e^(-τ/λ)]
 */
function nelsonSiegel(maturities, yields, fixedLambda) {
  var tau = flatten_(maturities);
  var y = flatten_(yields);

  if (tau.length !== y.length) {
    throw new Error("만기와 수익률 배열의 길이가 다릅니다.");
  }
  if (tau.length < 3) {
    throw new Error("최소 3개 이상의 데이터가 필요합니다.");
  }

  // --- λ 고정 vs 최적화 ---
  if (fixedLambda !== undefined && fixedLambda !== null && fixedLambda !== "") {
    var lambda = Number(fixedLambda);
    var betas = fitBetas_(tau, y, lambda);
    var rmse = calcRMSE_(tau, y, betas[0], betas[1], betas[2], lambda);
    return [[betas[0], betas[1], betas[2], lambda, rmse]];
  }

  // λ 그리드 서치 → 최소 RMSE
  var bestRMSE = Infinity;
  var bestResult = null;

  // 0.1 ~ 8.0 범위를 0.05 간격으로 탐색
  for (var lam = 0.1; lam <= 8.0; lam += 0.05) {
    var b = fitBetas_(tau, y, lam);
    var err = calcRMSE_(tau, y, b[0], b[1], b[2], lam);
    if (err < bestRMSE) {
      bestRMSE = err;
      bestResult = [b[0], b[1], b[2], lam];
    }
  }

  // 미세 탐색 (best ± 0.05, 0.005 간격)
  var coarseLam = bestResult[3];
  for (var lam2 = Math.max(0.01, coarseLam - 0.05); lam2 <= coarseLam + 0.05; lam2 += 0.005) {
    var b2 = fitBetas_(tau, y, lam2);
    var err2 = calcRMSE_(tau, y, b2[0], b2[1], b2[2], lam2);
    if (err2 < bestRMSE) {
      bestRMSE = err2;
      bestResult = [b2[0], b2[1], b2[2], lam2];
    }
  }

  bestResult.push(bestRMSE);
  return [bestResult]; // [[β₀, β₁, β₂, λ, RMSE]]
}


/**
 * 주어진 λ에서 OLS(최소자승법)로 β₀, β₁, β₂ 추정
 * Nelson-Siegel은 λ가 고정되면 β에 대해 선형이므로 OLS로 정확히 풀 수 있음
 */
function fitBetas_(tau, y, lambda) {
  var n = tau.length;

  // 디자인 행렬 X (n×3) 구성
  var X = [];
  for (var i = 0; i < n; i++) {
    var t = tau[i] / lambda;
    var expTerm = Math.exp(-t);
    var factor1 = (t === 0) ? 1 : (1 - expTerm) / t;
    var factor2 = factor1 - expTerm;
    X.push([1, factor1, factor2]);
  }

  // OLS: β = (X'X)⁻¹ X'y
  var Xt = transpose_(X);          // 3×n
  var XtX = matMul_(Xt, X);        // 3×3
  var Xty = matVecMul_(Xt, y);     // 3×1
  var XtXinv = invert3x3_(XtX);    // 3×3
  var betas = matVecMul_(XtXinv, Xty); // [β₀, β₁, β₂]

  return betas;
}


/**
 * Nelson-Siegel 모델 값 계산
 */
function nsYield_(tau, beta0, beta1, beta2, lambda) {
  var t = tau / lambda;
  var expTerm = Math.exp(-t);
  var factor1 = (t === 0) ? 1 : (1 - expTerm) / t;
  var factor2 = factor1 - expTerm;
  return beta0 + beta1 * factor1 + beta2 * factor2;
}


/**
 * RMSE 계산
 */
function calcRMSE_(tau, y, beta0, beta1, beta2, lambda) {
  var sum = 0;
  for (var i = 0; i < tau.length; i++) {
    var diff = y[i] - nsYield_(tau[i], beta0, beta1, beta2, lambda);
    sum += diff * diff;
  }
  return Math.sqrt(sum / tau.length);
}


/**
 * 추정된 파라미터로 특정 만기의 수익률 예측
 */
function nsPredict(maturity, beta0, beta1, beta2, lambda) {
  return nsYield_(maturity, beta0, beta1, beta2, lambda);
}


/**
 * 검증용 테스트 함수 — Apps Script 에디터에서 testNelsonSiegel() 실행
 */
function testNelsonSiegel() {
  // 샘플 데이터
  // 만기(년)  상수1(Slope)  상수2(Curvature)  실제금리
  var maturities = [0.25,   0.5,    1,      2,      3,      5,      10,     20,     30    ];
  var slopeConst = [0.9924, 0.9849, 0.9701, 0.9413, 0.9136, 0.8613, 0.7490, 0.5771, 0.4583];
  var curveConst = [0.0075, 0.0148, 0.0290, 0.0543, 0.0765, 0.1118, 0.1610, 0.1793, 0.1601];
  var yields     = [3.50,   3.65,   3.80,   3.95,   4.05,   4.15,   4.30,   4.45,   4.40  ];

  Logger.log("--- 입력 데이터 ---");
  Logger.log("만기\tSlope상수\tCurve상수\t실제금리");
  for (var d = 0; d < maturities.length; d++) {
    Logger.log(maturities[d] + "\t" + slopeConst[d] + "\t\t" + curveConst[d] + "\t\t" + yields[d]);
  }

  Logger.log("");

  Logger.log("=== Nelson-Siegel 파라미터 추정 ===");
  Logger.log("입력 만기: " + maturities);
  Logger.log("입력 수익률: " + yields);
  Logger.log("");

  // 1) λ 자동 최적화
  var result = nelsonSiegel(maturities, yields);
  var beta0 = result[0][0];
  var beta1 = result[0][1];
  var beta2 = result[0][2];
  var lambda = result[0][3];
  var rmse = result[0][4];

  Logger.log("--- λ 자동 최적화 ---");
  Logger.log("β₀ (장기수준) = " + beta0.toFixed(6));
  Logger.log("β₁ (단기요인) = " + beta1.toFixed(6));
  Logger.log("β₂ (중기요인) = " + beta2.toFixed(6));
  Logger.log("λ  (감쇠속도) = " + lambda.toFixed(6));
  Logger.log("RMSE          = " + rmse.toFixed(6));
  Logger.log("");

  // 2) 만기별 추정 vs 실측 비교
  Logger.log("--- 만기별 피팅 결과 (자동 λ) ---");
  Logger.log("만기\t실측\t추정\t오차");
  for (var i = 0; i < maturities.length; i++) {
    var fitted = nsPredict(maturities[i], beta0, beta1, beta2, lambda);
    var error = yields[i] - fitted;
    Logger.log(
      maturities[i] + "\t" +
      yields[i].toFixed(4) + "\t" +
      fitted.toFixed(4) + "\t" +
      error.toFixed(4)
    );
  }

  // 3) 관측되지 않은 만기 예측
  Logger.log("");
  Logger.log("--- 미관측 만기 예측 ---");
  var testMaturities = [0.1, 7, 15, 50];
  for (var j = 0; j < testMaturities.length; j++) {
    var pred = nsPredict(testMaturities[j], beta0, beta1, beta2, lambda);
    Logger.log("만기 " + testMaturities[j] + "년 → 추정 수익률: " + pred.toFixed(4) + "%");
  }
}


// ========== 선형대수 유틸리티 ==========

/** 2D/1D 배열을 1D 숫자 배열로 평탄화 */
function flatten_(arr) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      result.push(Number(arr[i][0]));
    } else {
      result.push(Number(arr[i]));
    }
  }
  return result;
}

/** 전치 행렬 */
function transpose_(M) {
  var rows = M.length, cols = M[0].length;
  var T = [];
  for (var j = 0; j < cols; j++) {
    T[j] = [];
    for (var i = 0; i < rows; i++) {
      T[j][i] = M[i][j];
    }
  }
  return T;
}

/** 행렬 곱 (A: m×n, B: n×p) → m×p */
function matMul_(A, B) {
  var m = A.length, n = B.length, p = B[0].length;
  var C = [];
  for (var i = 0; i < m; i++) {
    C[i] = [];
    for (var j = 0; j < p; j++) {
      var s = 0;
      for (var k = 0; k < n; k++) s += A[i][k] * B[k][j];
      C[i][j] = s;
    }
  }
  return C;
}

/** 행렬 × 벡터 (M: m×n, v: n) → m */
function matVecMul_(M, v) {
  var result = [];
  for (var i = 0; i < M.length; i++) {
    var s = 0;
    for (var j = 0; j < v.length; j++) s += M[i][j] * v[j];
    result.push(s);
  }
  return result;
}

/** 3×3 역행렬 (크래머 공식) */
function invert3x3_(M) {
  var a = M[0][0], b = M[0][1], c = M[0][2];
  var d = M[1][0], e = M[1][1], f = M[1][2];
  var g = M[2][0], h = M[2][1], k = M[2][2];

  var det = a * (e * k - f * h) - b * (d * k - f * g) + c * (d * h - e * g);
  if (Math.abs(det) < 1e-15) {
    throw new Error("행렬이 특이(singular)합니다. 데이터를 확인하세요.");
  }

  var inv = 1 / det;
  return [
    [(e * k - f * h) * inv, (c * h - b * k) * inv, (b * f - c * e) * inv],
    [(f * g - d * k) * inv, (a * k - c * g) * inv, (c * d - a * f) * inv],
    [(d * h - e * g) * inv, (b * g - a * h) * inv, (a * e - b * d) * inv]
  ];
}
