<template>
  <section class="w-full relative overflow-hidden flex items-center min-h-[480px] bg-none max-lg:bg-[#0d2247] max-lg:border-b-6 max-lg:border-brand-orange max-lg:p-0 lg:bg-[url('/Images/why-choose-us-bg.webp')] lg:bg-cover lg:bg-right lg:bg-no-repeat">
    <div class="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center">
      
      <!-- Content Container -->
      <div class="w-full lg:w-[62%] p-6 sm:p-10 lg:py-10 lg:pr-8 lg:pl-[3.5rem]">
        <!-- Section Header with Standard Mobile Classes -->
        <div class="text-left">
          <span v-fade class="text-brand-orange font-extrabold tracking-[0.8px] block mb-1 uppercase text-2xl">
            WHY CHOOSE US?
          </span>
          <h2 v-fade class="font-extrabold text-white text-uppercase text-2xl sm:text-3xl lg:text-4xl max-sm:text-[1.2rem] max-sm:leading-[1.3] mb-[1.5rem] lg:mb-[2rem] leading-[1.15]">
            Festive Express <span class="text-brand-orange">Difference</span>
          </h2>
        </div>

        <!-- Benefits Row / Grid -->
        <div class="grid grid-cols-2 sm:flex sm:justify-between gap-6 sm:gap-[1.25rem]">
          
          <!-- Item 1: Full-Service Installation -->
          <div v-fade-left class="group flex-1 text-center flex flex-col items-center cursor-pointer">
            <div class="w-[68px] h-[68px] rounded-full flex items-center justify-center mb-[0.85rem] overflow-hidden transition-all duration-300 group-hover:scale-[1.08] group-hover:shadow-[0_0_0_3px_#0d2247,0_0_0_5px_#f7941d]">
              <img src="/Images/Icons/trained.png" alt="Full-Service Installation" class="w-full h-full object-contain group-hover:animate-[spin_0.8s_ease-in-out_1]" />
            </div>
            <h3 class="text-white text-[0.9rem] font-bold leading-[1.2] mb-[0.35rem]">
              Full-Service<br class="hidden sm:inline">Installation
            </h3>
            <p class="text-[#ff890b] text-[0.9rem] font-semibold leading-[1.25] m-0">
              Installed Safely by<br class="hidden sm:inline">Trained Technicians
            </p>
          </div>

          <!-- Item 2: Licensed & Insured -->
          <div v-fade-left class="group flex-1 text-center flex flex-col items-center cursor-pointer">
            <div class="w-[68px] h-[68px] rounded-full flex items-center justify-center mb-[0.85rem] overflow-hidden transition-all duration-300 group-hover:scale-[1.08] group-hover:shadow-[0_0_0_3px_#0d2247,0_0_0_5px_#f7941d]">
              <img src="/Images/Icons/secured.png" alt="Licensed & Insured" class="w-full h-full object-contain group-hover:animate-[spin_0.8s_ease-in-out_1]" />
            </div>
            <h3 class="text-white text-[0.9rem] font-bold leading-[1.2] mb-[0.35rem]">
              Licensed &amp;<br class="hidden sm:inline">Insured
            </h3>
            <p class="text-[#ff890b] text-[0.9rem] font-semibold leading-[1.25] m-0">
              Your Home Is<br class="hidden sm:inline">Fully Protected
            </p>
          </div>

          <!-- Item 3: Professional Grade Lighting -->
          <div v-fade-left class="group flex-1 text-center flex flex-col items-center cursor-pointer">
            <div class="w-[68px] h-[68px] rounded-full flex items-center justify-center mb-[0.85rem] overflow-hidden transition-all duration-300 group-hover:scale-[1.08] group-hover:shadow-[0_0_0_3px_#0d2247,0_0_0_5px_#f7941d]">
              <img src="/Images/Icons/service.png" alt="Professional Grade Lighting" class="w-full h-full object-contain group-hover:animate-[spin_0.8s_ease-in-out_1]" />
            </div>
            <h3 class="text-white text-[0.9rem] font-bold leading-[1.2] mb-[0.35rem]">
              Professional<br class="hidden sm:inline">Grade Lighting
            </h3>
            <p class="text-[#ff890b] text-[0.9rem] font-semibold leading-[1.25] m-0">
              Built to Last Year<br class="hidden sm:inline">After Year
            </p>
          </div>

          <!-- Item 4: Ongoing Local Support -->
          <div v-fade-left class="group flex-1 text-center flex flex-col items-center cursor-pointer">
            <div class="w-[68px] h-[68px] rounded-full flex items-center justify-center mb-[0.85rem] overflow-hidden transition-all duration-300 group-hover:scale-[1.08] group-hover:shadow-[0_0_0_3px_#0d2247,0_0_0_5px_#f7941d]">
              <img src="/Images/Icons/location.png" alt="Ongoing Local Support" class="w-full h-full object-contain group-hover:animate-[spin_0.8s_ease-in-out_1]" />
            </div>
            <h3 class="text-white text-[0.9rem] font-bold leading-[1.2] mb-[0.35rem]">
              Ongoing Local<br class="hidden sm:inline">Support
            </h3>
            <p class="text-[#ff890b] text-[0.9rem] font-semibold leading-[1.25] m-0">
              We're Here<br class="hidden sm:inline">Long After Install
            </p>
          </div>

        </div>
      </div>

      <!-- Mobile Photo Frame (Visible on Mobile/Tablet Only) -->
      <div class="block lg:hidden w-full h-[240px] overflow-hidden border-t-4 border-brand-orange">
        <img src="/Images/why-choose-us-bg-2.webp" alt="Festive Express Decorated Home" class="w-full h-full object-cover" />
      </div>

    </div>
  </section>
</template>