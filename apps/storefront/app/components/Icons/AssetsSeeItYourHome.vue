<template>
  <div class="svg-container">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 615.34 215.02"
      role="img"
      aria-label="Banner reading See it on your home"
    >
      <defs>
        <style>
          .cls-1 {
            mix-blend-mode: screen;
          }
          .cls-1,
          .cls-2 {
            opacity: 0.75;
          }
          .cls-1,
          .cls-2,
          .cls-3 {
            isolation: isolate;
          }
          .cls-4 {
            font-family: "Poppins-ExtraBoldItalic", Poppins, sans-serif;
            font-size: 44.23px;
            font-style: italic;
            font-weight: 700;
          }
          .cls-5 {
            fill: none;
            stroke: url(#linear-gradient);
            stroke-miterlimit: 3;
            stroke-width: 11px;
          }
          .cls-6 {
            fill: #fff;
          }
          .cls-2 {
            fill: #2b2868;
            mix-blend-mode: multiply;
          }
          .cls-7 {
            fill: #f19024;
          }
          .cls-8 {
            fill: #1d2e5b;
          }
        </style>
        <linearGradient
          id="linear-gradient"
          x1="90.71"
          y1="202.14"
          x2="509.3"
          y2="6.95"
          gradientTransform="translate(0 217.27) scale(1 -1)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#f99f22" />
          <stop offset="0.12" stop-color="#fde7a5" />
          <stop offset="0.27" stop-color="#f99f22" />
          <stop offset="0.37" stop-color="#fffaed" />
          <stop offset="0.49" stop-color="#f99f22" />
          <stop offset="0.59" stop-color="#fffaed" />
          <stop offset="0.84" stop-color="#f99f22" />
          <stop offset="0.9" stop-color="#ffe9ba" />
          <stop offset="1" stop-color="#f99f22" />
        </linearGradient>
      </defs>
      <g class="cls-3">
        <g id="Layer_1" data-name="Layer 1">
          <g>
            <polygon
              class="cls-5"
              points="530.77 150.87 27.05 172.39 64.66 84.25 570.72 52.14 530.77 150.87"
            />
            <polygon
              class="cls-8"
              points="530.77 150.87 27.05 172.39 64.66 84.25 570.72 52.14 530.77 150.87"
            />
            <polygon
              class="cls-2"
              points="530.77 150.87 27.05 172.39 64.66 84.25 570.72 52.14 530.77 150.87"
            />
            <image
              id="image1"
              class="cls-3"
              width="1000"
              height="449"
              transform="translate(211.5 11.79) scale(0.16)"
              xlink:href="data:image/png;base64,iVBOR....AAABJRU5ErkJggg=="
            />
            <text
              class="cls-4"
              transform="translate(61.19 139.97) rotate(-2.48)"
            >
              <tspan class="cls-6" x="0" y="0">SEE IT ON</tspan>
              <tspan class="cls-7" x="212.07" y="0">YOUR HOME</tspan>
            </text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "SvgBanner",
};
</script>

<style scoped>
.svg-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

svg {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>
