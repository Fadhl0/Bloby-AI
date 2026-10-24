<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 341"
    width="200"
    height="150"
  >
    <rect
      x="50"
      y="28"
      width="415"
      height="259"
      rx="85"
      ry="85"
      fill="#A399FF"
    />
    <path d="M165 47 H365 A75 75 0 0 1 439 122 V165 A75 75 0 0 1 365 240 H315 L150 280 V240 A75 75 0 0 1 75 165 V137 A90 90 0 0 1 165 47 Z" fill="#E0E0E0" />
    <g class="look">
      <rect
        class="eye"
        x="228"
        y="97"
        width="44"
        height="96"
        rx="22"
        ry="22"
        fill="#000"
      />
      <rect
        class="eye"
        x="298"
        y="97"
        width="44"
        height="96"
        rx="22"
        ry="22"
        fill="#000"
      />
    </g>
  </svg>
</template>

<style scoped>
.look { animation: look 4s infinite; }
.eye { transform-box: fill-box; transform-origin: center; animation: blink 4s infinite; }
@keyframes look {
  0.0% { transform: translateX(0px); }
  16.67% { transform: translateX(0px); }
  25.0% { transform: translateX(-40px); }
  45.83% { transform: translateX(-40px); }
  56.67% { transform: translateX(0px); }
  65.0% { transform: translateX(0px); }
  73.33% { transform: translateX(40px); }
  90.0% { transform: translateX(40px); }
  100.0% { transform: translateX(0px); }
}
@keyframes blink {
  0.0% { transform: scaleY(1); }
  6.67% { transform: scaleY(1); }
  9.17% { transform: scaleY(0.08); }
  11.67% { transform: scaleY(1); }
  37.5% { transform: scaleY(1); }
  40.0% { transform: scaleY(0.08); }
  42.5% { transform: scaleY(1); }
  83.33% { transform: scaleY(1); }
  85.83% { transform: scaleY(0.08); }
  88.33% { transform: scaleY(1); }
  100.0% { transform: scaleY(1); }
}
</style>
