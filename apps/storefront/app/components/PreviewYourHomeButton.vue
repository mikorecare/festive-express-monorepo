<template>
  <NuxtLink
    to="/preview-your-home"
    class="group relative z-10 block w-fit mx-auto overflow-hidden rounded-lg transition-transform duration-200 hover:-translate-y-0.5"
  >
    <img
      src="/Images/PreviewYourHomeButton.png"
      alt="Preview Your Home"
      class="relative z-0 w-[220px] max-lg:w-[180px] h-auto drop-shadow-[0_12px_28px_rgba(224,107,0,0.35)]"
    />

    <span
      class="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-lg"
      aria-hidden="true"
    >
      <span
        class="absolute -top-1/2 -left-[150%] w-[200%] h-[200%] bg-[linear-gradient(60deg,transparent_20%,rgba(255,255,255,0.12)_40%,rgba(255,255,255,0.45)_50%,rgba(255,255,255,0.12)_60%,transparent_80%)] rotate-[25deg] animate-[glossyShineContinuous_3s_linear_infinite]"
      />
    </span>
  </NuxtLink>
</template>
