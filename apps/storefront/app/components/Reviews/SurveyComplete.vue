<template>
  <div class="flex flex-col items-center justify-center text-center">
    <NuxtImg
      src="/Images/reviews/survey-done.png"
      alt="Survey Complete"
      format="webp"
      quality="85"
      loading="lazy"
      class="mb-8 max-w-4xl w-full h-auto"
      style="display: block !important; line-height: 0 !important"
      :img-attrs="{
        style: 'display: block; width: 100%; height: auto;',
      }"
    />

    <NuxtLink
      to="/"
      class="inline-block bg-[#F49321] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#e07e0e] transition-colors no-underline"
    >
      Go to Home
    </NuxtLink>
  </div>
</template>
