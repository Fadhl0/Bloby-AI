<!-- eslint-disable better-tailwindcss/no-unknown-classes -->
<template>
  <div class="size-7">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 250"
      width="100%"
      height="100%"
    >

      <!--
        Background (Optional, remove this rect if you want a transparent background)
      -->
      <rect width="100%" height="100%" fill="transparent" />

      <!-- Heat / Steam Animation (Smooth upward motion, no teleporting) -->
      <g>
        <!-- Steam Line 1 -->
        <path class="steam" d="M 85 95 Q 105 75 85 55 T 85 15">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 30; 0 0; 0 -30"
            keyTimes="0; 0.5; 1"
            dur="1.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          />
          <animate
            attributeName="opacity"
            values="0; 1; 0"
            keyTimes="0; 0.5; 1"
            dur="1.5s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          />
        </path>

        <!-- Steam Line 2 -->
        <path class="steam" d="M 130 90 Q 150 65 130 40 T 130 0">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 30; 0 0; 0 -30"
            keyTimes="0; 0.5; 1"
            dur="1.8s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          />
          <animate
            attributeName="opacity"
            values="0; 1; 0"
            keyTimes="0; 0.5; 1"
            dur="1.8s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          />
        </path>

        <!-- Steam Line 3 -->
        <path class="steam" d="M 175 95 Q 195 75 175 55 T 175 15">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 30; 0 0; 0 -30"
            keyTimes="0; 0.5; 1"
            dur="1.3s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          />
          <animate
            attributeName="opacity"
            values="0; 1; 0"
            keyTimes="0; 0.5; 1"
            dur="1.3s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
          />
        </path>
      </g>

      <!-- Wok Shaking Group (Left-to-Right with pause) -->
      <g>
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; -7 0; 7 0; -7 0; 7 0; -7 0; 7 0; 0 0; 0 0"
          keyTimes="0; 0.05; 0.15; 0.25; 0.35; 0.45; 0.55; 0.65; 1"
          dur="1.25s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1"
        />

        <!--
      Wok/Pan Body and Handle (Single path with transparent hole via evenodd)
    -->
        <path
          class="pan"
          fill-rule="evenodd"
          d="
      M 30 115
      L 280 115
      L 360 115
      Q 380 115 380 125
      Q 380 135 360 135
      L 280 135
      Q 260 180 180 180
      L 80 180
      Q 30 180 30 115
      Z
      M 360 120
      A 5 5 0 1 0 360 130
      A 5 5 0 1 0 360 120
      Z"
        />
      </g>

      <!-- Flying Food Elements (Only squares and triangles, no circles) -->

      <!-- Element 1: Small Square (Left) -->
      <g>
        <rect
          x="100"
          y="110"
          width="8"
          height="6"
          rx="1"
          class="food"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; -60 -80; -100 20"
            keyTimes="0; 0.5; 1"
            dur="0.8s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.2 0 0.8 1; 0.2 0 0.8 1"
          />
          <animate
            attributeName="opacity"
            values="0; 1; 1; 0"
            keyTimes="0; 0.1; 0.8; 1"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </rect>
      </g>

      <!-- Element 2: Small Triangle (Right) -->
      <g>
        <path d="M 180 105 L 188 110 L 182 115 Z" class="food">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 60 -90; 100 20"
            keyTimes="0; 0.5; 1"
            dur="0.9s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.2 0 0.8 1; 0.2 0 0.8 1"
            begin="0.1s"
          />
          <animate
            attributeName="opacity"
            values="0; 1; 1; 0"
            keyTimes="0; 0.1; 0.8; 1"
            dur="0.9s"
            repeatCount="indefinite"
            begin="0.1s"
          />
        </path>
      </g>

      <!-- Element 3: Small Square (Center) -->
      <g>
        <rect
          x="140"
          y="110"
          width="6"
          height="8"
          rx="1"
          class="food"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 0 -110; 0 10"
            keyTimes="0; 0.5; 1"
            dur="0.7s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.2 0 0.8 1; 0.2 0 0.8 1"
            begin="0.2s"
          />
          <animate
            attributeName="opacity"
            values="0; 1; 1; 0"
            keyTimes="0; 0.1; 0.8; 1"
            dur="0.7s"
            repeatCount="indefinite"
            begin="0.2s"
          />
        </rect>
      </g>

      <!-- Element 4: Small Triangle (Left-Center) -->
      <g>
        <path d="M 120 108 L 126 112 L 122 116 Z" class="food">
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; -30 -70; -50 10"
            keyTimes="0; 0.5; 1"
            dur="0.85s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.2 0 0.8 1; 0.2 0 0.8 1"
            begin="0.3s"
          />
          <animate
            attributeName="opacity"
            values="0; 1; 1; 0"
            keyTimes="0; 0.1; 0.8; 1"
            dur="0.85s"
            repeatCount="indefinite"
            begin="0.3s"
          />
        </path>
      </g>

      <!-- Element 5: Small Square (Right-Center) -->
      <g>
        <rect
          x="160"
          y="108"
          width="7"
          height="5"
          rx="1"
          class="food"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 30 -80; 50 15"
            keyTimes="0; 0.5; 1"
            dur="0.75s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.2 0 0.8 1; 0.2 0 0.8 1"
            begin="0.4s"
          />
          <animate
            attributeName="opacity"
            values="0; 1; 1; 0"
            keyTimes="0; 0.1; 0.8; 1"
            dur="0.75s"
            repeatCount="indefinite"
            begin="0.4s"
          />
        </rect>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.pan { fill: currentColor; }
.steam { fill: none; stroke: currentColor; stroke-width: 14; stroke-linecap: round; }
.food { fill: currentColor; }
</style>
