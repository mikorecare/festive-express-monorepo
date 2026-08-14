<template>
  <div class="packages-page min-h-screen bg-white font-sans text-slate-800">
    <!-- Hero Section -->
    <section class="page-hero snow-bg relative bg-slate-900 py-16 text-white overflow-hidden">
      <div class="hero-overlay absolute inset-0 bg-black/40 z-10">
        <div class="container mx-auto px-4 h-full flex items-center justify-center">
          <div class="hero-content text-center max-w-2xl mx-auto">
            <h1 v-fade class="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Holiday Lighting Package Programs
            </h1>
            <p v-fade class="breadcrumb text-base md:text-lg text-slate-200">
              Choose the perfect package for your home
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <p class="text-lg text-slate-600 animate-pulse">Loading package programs...</p>
    </div>

    <!-- Horizontal Package Sections -->
    <div v-else class="package-sections-container flex flex-col">
      <section
        v-for="pkg in orderedPackages"
        :key="pkg.id"
        :id="getPackageSlug(pkg.name)"
        class="package-section py-16 border-b border-slate-200"
        :class="[getPackageSlug(pkg.name), { 'bg-alt bg-slate-50': getPackageSlug(pkg.name) === 'jolly' }]"
      >
        <div class="container mx-auto px-4 max-w-7xl">
          <!-- Package Section Header -->
          <div class="section-header flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b-2 border-slate-200 gap-4">
            <div class="header-left relative flex items-center gap-4">
              <!-- <span class="badge inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white bg-emerald-600" :class="getPackageSlug(pkg.name)">
                {{ getBadgeText(pkg.name) }}
              </span> -->
              <!-- <h2 class="package-title text-2xl font-bold">{{ pkg.name }}</h2> -->
              <img
                class="pkg-title-img h-12 md:h-16 w-auto object-contain drop-shadow-md"
                :src="getPackageTitleImage(pkg.name)"
                :alt="pkg.name"
              >
            </div>
            <div class="package-price font-color-orange text-3xl md:text-4xl font-extrabold text-amber-500">
              ${{ pkg.price || '0.00' }}
            </div>
          </div>

          <!-- Horizontal 2-Column Product Detail Layout -->
          <div class="horizontal-layout grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Left Column: Interactive Image Preview & Color Picker -->
            <div class="media-column lg:col-span-7 flex flex-col bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
              <div class="image-wrapper relative bg-slate-100 cursor-pointer overflow-hidden group" @click="openLightbox(pkg)">
                <img
                  :src="getColorImageUrl(pkg.name, selectedColors[pkg.id])"
                  :alt="pkg.name"
                  class="main-image w-full h-[320px] sm:h-[420px] object-cover block border-4 border-amber-500 rounded-2xl"
                  @error="handleImageError"
                />

                <div class="lights-badge absolute right-4 bottom-4 w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center z-20 shadow-lg" aria-hidden="true">
                  <img
                    class="sparkle-img absolute -left-8 -top-2 w-24 h-24 object-contain -z-10 pointer-events-none"
                    src="/Images/Holiday-Lighting-Package/starburst.png"
                    alt=""
                  >
                  <img
                    class="lights-icon-img w-12 h-12 object-contain"
                    :src="getPackageIcon(pkg.name)"
                    alt=""
                  >
                </div>

                <!-- Hotspots -->
                <button
                  v-for="spot in getHotspotsForPackage(pkg.name)"
                  :key="spot.key"
                  type="button"
                  class="hotspot group/spot absolute z-30 w-7 h-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                  :class="{ active: activeInclusions[pkg.id] === spot.key }"
                  :style="{ top: spot.top, left: spot.left }"
                  @click.stop="activateHotspot(pkg.id, spot.key)"
                >
                  <span 
                    class="hotspot-dot block w-4 h-4 mx-auto mt-1 rounded-full border-2 border-white shadow-md transition-all duration-200"
                    :class="activeInclusions[pkg.id] === spot.key ? 'bg-amber-500 scale-125' : 'bg-slate-900 group-hover/spot:bg-amber-500 group-hover/spot:scale-110'"
                  ></span>
                  <span 
                    v-if="activeInclusions[pkg.id] === spot.key"
                    class="hotspot-pulse absolute inset-0 rounded-full border-2 border-amber-500 animate-ping opacity-75"
                  ></span>
                </button>

                <!-- Hotspot Popup Card -->
                <div
                  v-if="getActiveSpot(pkg.id, pkg.name)"
                  class="hotspot-popup absolute z-40 w-44 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden -translate-x-1/2 -translate-y-full transition-all duration-200"
                  :style="{ top: getActiveSpot(pkg.id, pkg.name)?.top, left: getActiveSpot(pkg.id, pkg.name)?.left }"
                  @click.stop
                >
                  <button 
                    type="button" 
                    class="hotspot-close absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center opacity-80 hover:bg-amber-500 hover:opacity-100 transition-colors" 
                    @click.stop="activeInclusions[pkg.id] = null"
                  >
                    ×
                  </button>
                  <div class="hotspot-popup-img-wrap w-full h-24 bg-slate-100 p-2 flex items-center justify-center" v-if="getActiveSpot(pkg.id, pkg.name)?.thumb">
                    <img 
                      :src="getActiveSpot(pkg.id, pkg.name)?.thumb" 
                      :alt="getActiveSpot(pkg.id, pkg.name)?.label" 
                      class="hotspot-popup-img max-w-full max-h-full object-contain block" 
                    />
                  </div>
                  <div class="hotspot-popup-body p-2.5 text-center">
                    <h4 class="hotspot-popup-title text-xs font-bold text-slate-900 leading-tight">
                      {{ getActiveSpot(pkg.id, pkg.name)?.label }}
                    </h4>
                  </div>
                </div>
              </div>

              <!-- C-9 Color Selection Options -->
              <div class="color-overlay p-5 bg-white border-t border-slate-200 text-center">
                <h4 class="color-title text-sm font-bold text-slate-900 mb-3">Select C-9 Light Color</h4>
                <div class="color-options flex justify-center flex-wrap gap-3">
                  <div
                    v-for="color in colors"
                    :key="color.name"
                    class="color-option flex flex-col items-center gap-1.5 cursor-pointer px-3.5 py-2 rounded-xl border-2 transition-all"
                    :class="{ 'active border-amber-500 bg-amber-50': selectedColors[pkg.id] === color.name, 'border-transparent bg-slate-50 hover:bg-slate-100': selectedColors[pkg.id] !== color.name }"
                    @click="selectedColors[pkg.id] = color.name"
                  >
                    <div class="color-swatch w-8 h-8 rounded-full border-2 border-slate-300 shadow-inner" :style="{ backgroundColor: color.hex }"></div>
                    <span class="color-label text-xs font-semibold text-slate-700">{{ color.name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Details, Inclusions & Purchase Action -->
            <div class="details-column lg:col-span-5 flex flex-col gap-6">
              <div 
                v-if="pkg.description" 
                class="package-description text-base text-slate-600 leading-relaxed whitespace-pre-line" 
                v-html="pkg.description"
              ></div>

              <div class="inclusions-block mt-4">
                <h3 class="text-lg font-bold text-slate-900 mb-3">Package Inclusions:</h3>
                <ul v-if="pkg.variations && pkg.variations.length" class="inclusions-list space-y-3 list-none p-0 m-0">
                  <li v-for="(variation, vIndex) in pkg.variations" :key="vIndex" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      v-for="(option, oIndex) in variation.options"
                      :key="oIndex"
                      class="feature-line flex items-center gap-2.5 p-2.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-[#F49322] hover:bg-[#fff7ed] transition-colors"
                      @click="highlightInclusion(pkg.id, option.name)"
                    >
                      <span v-if="!option.image_url" class="check-icon text-emerald-500 font-bold">✔</span>
                      <img
                        v-if="option.image_url"
                        :src="getImageUrl(option.image_url)"
                        class="option-preview w-8 h-8 object-contain flex-shrink-0"
                        :alt="option.name"
                      >
                      <span class="text-xs font-semibold text-slate-700 leading-snug">{{ option.name }}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <button @click="scrollToSpecs" class="info-btn group inline-flex items-center justify-center gap-2 bg-transparent text-slate-900 border-2 border-slate-900 px-6 py-3 text-sm font-semibold rounded-lg cursor-pointer hover:bg-slate-900 transition-all duration-200">
                For More Product Information
                <span class="arrow-down text-base transition-transform duration-200 group-hover:translate-y-1">↓</span>
              </button>

              <div class="p-info-card p-4 bg-blue-50 border border-dashed border-blue-200 rounded-xl">
                <p class="info-text m-0 text-xs sm:text-sm text-blue-800 flex items-start gap-2.5 leading-relaxed">
                  <i class="fas fa-info-circle text-blue-500 text-base flex-shrink-0 mt-0.5"></i>
                  Includes commercial-grade LEDs, custom fit sizing, professional installation, maintenance, and seasonal removal.
                </p>
              </div>

              <div class="action-block">
                <!-- <button
                  class="btn-primary btn-large w-full bg-slate-900 hover:bg-amber-500 text-white font-bold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  :disabled="pkg.stock <= 0"
                  @click="addToCartHandler(pkg)"
                >
                  {{ pkg.stock <= 0 ? 'Out of Stock' : `Add ${pkg.name} to Cart` }}
                </button> -->

                <button
                  class="btn-primary btn-large w-full bg-slate-900 hover:bg-amber-500 text-white font-bold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  :disabled="pkg.stock <= 0 || addingToCartId === pkg.id"
                  @click="addToCartHandler(pkg)"
                >
                  <span v-if="addingToCartId === pkg.id" class="button-loader inline-flex items-center justify-center gap-2">
                    <i class="fas fa-spinner fa-spin"></i> Adding...
                  </span>
                  <span v-else>
                    {{ pkg.stock <= 0 ? 'Out of Stock' : `Add ${pkg.name} to Cart` }}
                  </span>
                </button>

              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Product Information Section -->
      <section id="product-specs" class="product-info-section py-20 bg-slate-50">
        <div class="container mx-auto px-4 max-w-7xl">
          <div class="section-header2 text-center mb-12">
            <h2 class="text-3xl font-extrabold text-slate-900 mb-3">Product Specifications</h2>
            <p class="section-subtitle text-slate-600 text-base max-w-2xl mx-auto">Discover the professional-grade materials and engineering behind every installation.</p>
          </div>

          <div class="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- C-9 Roofline Lights -->
            <div class="product-card bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
              <div class="product-header bg-slate-900 text-white p-5 flex justify-between items-center">
                <h3 class="text-lg font-bold text-white m-0">C-9 Roofline Lights</h3>
                <span class="badge text-xs bg-slate-800 text-slate-200 font-semibold px-2.5 py-1 rounded-md">Roofline & Trim</span>
              </div>
              <div class="product-body p-6 flex flex-col flex-grow">
                <p class="description text-slate-600 text-sm leading-relaxed mb-4">
                  Professional quality, durability, and energy efficiency. Polystyrene lenses make them ultra-strong, while SMD technology delivers brilliant brightness. These cool-to-the-touch bulbs are built to last season after season.
                </p>
                <div class="options-tag bg-[#f0f4f8] text-[#0c2340] px-3 py-2 rounded-[6px] text-[0.88rem] mb-5"><strong>Color Options:</strong> Warm White, Pure White, Champagne</div>
                
                <div class="spec-block mb-4">
                  <h4 class="text-base font-bold text-[#0c2340] mb-2.5 pb-0.75 border-b-2 border-[#f49322] inline-block">Features</h4>
                  <ul class="list-disc list-inside text-xs text-slate-600 space-y-1.5 p-0 m-0">
                    <li>C-9 LED Premium Bulbs with E17 base</li>
                    <li>SMD LED technology for brilliant light</li>
                    <li>Diamond-cut pattern facets generating light halos</li>
                    <li>Average bulb life: 60,000 hours</li>
                    <li>Nickel base to prevent corrosion</li>
                    <li>Rated for Indoor & Outdoor use</li>
                  </ul>
                </div>

                <div class="spec-block mt-auto">
                  <h4 class="text-base font-bold text-[#0c2340] mb-2.5 pb-0.75 border-b-2 border-[#f49322] inline-block">Specifications</h4>
                  <div class="spec-grid grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
                    <div><span class="font-bold text-slate-900">Voltage:</span> 120V</div>
                    <div><span class="font-bold text-slate-900">Watts/Bulb:</span> 0.65W</div>
                    <div><span class="font-bold text-slate-900">Kelvin:</span> 3000K</div>
                    <div><span class="font-bold text-slate-900">Lumens:</span> 37</div>
                    <div><span class="font-bold text-slate-900">Dimmable:</span> Yes</div>
                    <div><span class="font-bold text-slate-900">Diode Count:</span> 3</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 5mm Wide Angle LED String Lights -->
            <div class="product-card bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
              <div class="product-header bg-slate-900 text-white p-5 flex justify-between items-center">
                <h3 class="text-lg font-bold text-white m-0">5mm Wide Angle LED Lights</h3>
                <span class="badge text-xs bg-slate-800 text-slate-200 font-semibold px-2.5 py-1 rounded-md">Commercial Grade</span>
              </div>
              <div class="product-body p-6 flex flex-col flex-grow">
                <p class="description text-slate-600 text-sm leading-relaxed mb-4">
                  IP67 water-tight string lights engineered for the harshest weather conditions. Features shatterproof acrylic bulbs with non-fading infused color and heavy-duty 20 gauge wire for end-to-end reliability.
                </p>
                <div class="options-tag bg-[#f0f4f8] text-[#0c2340] px-3 py-2 rounded-[6px] text-[0.88rem] mb-5"><strong>Color Options:</strong> Warm White, Pure White, Champagne</div>

                <div class="spec-block mb-4">
                  <h4 class="text-base font-bold text-[#0c2340] mb-2.5 pb-0.75 border-b-2 border-[#f49322] inline-block">Features</h4>
                  <ul class="list-disc list-inside text-xs text-slate-600 space-y-1.5 p-0 m-0">
                    <li>IP67 Rated: Waterproof and dust-tight</li>
                    <li>Bulb lifespan up to 100,000 hours</li>
                    <li>ENERGY STAR® certified (Up to 90% energy savings)</li>
                    <li>Heavy-duty 20 gauge wire with tighter wire twists</li>
                    <li>Connect up to 432 watts end-to-end</li>
                    <li>Contractor Pack pre-balled sets for efficient install</li>
                  </ul>
                </div>

                <div class="spec-block mt-auto">
                  <h4 class="text-base font-bold text-[#0c2340] mb-2.5 pb-0.75 border-b-2 border-[#f49322] inline-block">Specifications</h4>
                  <div class="spec-grid grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
                    <div><span class="font-bold text-slate-900">Spacing:</span> 4" apart</div>
                    <div><span class="font-bold text-slate-900">Length:</span> 17 ft total</div>
                    <div><span class="font-bold text-slate-900">Wire:</span> 20 Gauge Green</div>
                    <div><span class="font-bold text-slate-900">Voltage:</span> 120V</div>
                    <div><span class="font-bold text-slate-900">Color Temp:</span> 3000K</div>
                    <div><span class="font-bold text-slate-900">Rating:</span> WeatherPRO™ Commercial</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 24" Prelit Wreath -->
            <div class="product-card bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
              <div class="product-header bg-slate-900 text-white p-5 flex justify-between items-center">
                <h3 class="text-lg font-bold text-white m-0">24” Sequoia Fir Wreath</h3>
                <span class="badge text-xs bg-slate-800 text-slate-200 font-semibold px-2.5 py-1 rounded-md">Greenery & Decor</span>
              </div>
              <div class="product-body p-6 flex flex-col flex-grow">
                <p class="description text-slate-600 text-sm leading-relaxed mb-4">
                  Features 200 PVC tips on a galvanized metal wire frame that will not rust. Flame retardant, non-allergenic, fade- and crush-resistant 2-ply needles maintain a lush, full appearance every season.
                </p>
                <div class="options-tag bg-[#f0f4f8] text-[#0c2340] px-3 py-2 rounded-[6px] text-[0.88rem] mb-5"><strong>Color Options:</strong> Warm White, Pure White</div>

                <div class="spec-block mb-4">
                  <h4 class="text-base font-bold text-[#0c2340] mb-2.5 pb-0.75 border-b-2 border-[#f49322] inline-block">Features</h4>
                  <ul class="list-disc list-inside text-xs text-slate-600 space-y-1.5 p-0 m-0">
                    <li>Sequoia Fir artificial Christmas wreath with 200 PVC tips</li>
                    <li>Galvanized metal wire frame prevents rust</li>
                    <li>Flame retardant and non-allergenic materials</li>
                    <li>Prelit with 50 energy-saving LED lights</li>
                    <li>UL Listed for quality and safety assurance</li>
                  </ul>
                </div>

                <div class="spec-block mt-auto">
                  <h4 class="text-base font-bold text-[#0c2340] mb-2.5 pb-0.75 border-b-2 border-[#f49322] inline-block">Specifications</h4>
                  <div class="spec-grid grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
                    <div><span class="font-bold text-slate-900">Size:</span> 24" Outer Diameter</div>
                    <div><span class="font-bold text-slate-900">Inner Dia:</span> 6 in</div>
                    <div><span class="font-bold text-slate-900">Frame Dia:</span> 14 in</div>
                    <div><span class="font-bold text-slate-900">Weight:</span> 6 lbs</div>
                    <div><span class="font-bold text-slate-900">Lights:</span> 50 LEDs</div>
                    <div><span class="font-bold text-slate-900">Rating:</span> Indoor / Outdoor</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 18" Commercial Bow -->
            <div class="product-card bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
              <div class="product-header bg-slate-900 text-white p-5 flex justify-between items-center">
                <h3 class="text-lg font-bold text-white m-0">12” Structural Bow</h3>
                <span class="badge text-xs bg-slate-800 text-slate-200 font-semibold px-2.5 py-1 rounded-md">Greenery & Decor</span>
              </div>
              <div class="product-body p-6 flex flex-col flex-grow">
                <p class="description text-slate-600 text-sm leading-relaxed mb-4">
                  A sturdy, commercial-grade structural bow featuring a durable 3D nylon design in vibrant red with gold trim. Designed to keep its shape and hold securely on large outdoor wreaths all season.
                </p>

                <div class="spec-block mb-4">
                  <h4 class="text-base font-bold text-[#0c2340] mb-2.5 pb-0.75 border-b-2 border-[#f49322] inline-block">Features</h4>
                  <ul class="list-disc list-inside text-xs text-slate-600 space-y-1.5 p-0 m-0">
                    <li>Sturdy commercial-grade 3D nylon design</li>
                    <li>Red finish with rich gold trim</li>
                    <li>4-loop structural construction</li>
                    <li>Indoor / Outdoor weather resistant</li>
                  </ul>
                </div>

                <div class="spec-block mt-auto">
                  <h4 class="text-base font-bold text-[#0c2340] mb-2.5 pb-0.75 border-b-2 border-[#f49322] inline-block">Specifications</h4>
                  <div class="spec-grid grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
                    <div><span class="font-bold text-slate-900">Color:</span> Red / Gold Trim</div>
                    <div><span class="font-bold text-slate-900">Loop Count:</span> 4</div>
                    <div><span class="font-bold text-slate-900">Material:</span> 3D Nylon</div>
                    <div><span class="font-bold text-slate-900">Application:</span> Wreaths & Displays</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Ground Lights & Stakes -->
            <div class="product-card bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
              <div class="product-header bg-slate-900 text-white p-5 flex justify-between items-center">
                <h3 class="text-lg font-bold text-white m-0">Ground & Pathway Lights</h3>
                <span class="badge text-xs bg-slate-800 text-slate-200 font-semibold px-2.5 py-1 rounded-md">Landscaping</span>
              </div>
              <div class="product-body p-6 flex flex-col flex-grow">
                <p class="description text-slate-600 text-sm leading-relaxed mb-4">
                  Utilizes the same ultra-bright C-9 bulbs as our roofline displays. Mounted with professional-grade offset stakes engineered to hammer easily into tough soil, keeping walkways straight and secure.
                </p>

                <div class="spec-block mb-4">
                  <h4 class="text-base font-bold text-[#0c2340] mb-2.5 pb-0.75 border-b-2 border-[#f49322] inline-block">Features</h4>
                  <ul class="list-disc list-inside text-xs text-slate-600 space-y-1.5 p-0 m-0">
                    <li>Manufactured with UV-additive polymers for weather durability</li>
                    <li>Special offset stake design for easy installation in hard ground</li>
                    <li>Keeps lights upright and perfectly aligned all season</li>
                    <li>Gives driveways and paths a clean, crisp border</li>
                  </ul>
                </div>

                <div class="spec-block mt-auto">
                  <h4 class="text-base font-bold text-[#0c2340] mb-2.5 pb-0.75 border-b-2 border-[#f49322] inline-block">Specifications</h4>
                  <div class="spec-grid grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
                    <div><span class="font-bold text-slate-900">Bulb Compatibility:</span> C7, C9</div>
                    <div><span class="font-bold text-slate-900">Bulb Type:</span> C9 LED</div>
                    <div><span class="font-bold text-slate-900">Stake Type:</span> Heavy Duty Offset</div>
                    <div><span class="font-bold text-slate-900">Application:</span> Walkways & Driveways</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Light Bursts -->
            <div class="product-card bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
              <div class="product-header bg-slate-900 text-white p-5 flex justify-between items-center">
                <h3 class="text-lg font-bold text-white m-0">36" LED Light Bursts</h3>
                <span class="badge text-xs bg-slate-800 text-slate-200 font-semibold px-2.5 py-1 rounded-md">Landscaping</span>
              </div>
              <div class="product-body p-6 flex flex-col flex-grow">
                <p class="description text-slate-600 text-sm leading-relaxed mb-4">
                  Natural-looking brown lighted branches with warm white LEDs. Features a 1-in-5 twinkle effect that adds depth, warmth, and organic elegance to garden beds, walkways, or floral arrangements.
                </p>

                <div class="spec-block mb-4">
                  <h4 class="text-base font-bold text-[#0c2340] mb-2.5 pb-0.75 border-b-2 border-[#f49322] inline-block">Features</h4>
                  <ul class="list-disc list-inside text-xs text-slate-600 space-y-1.5 p-0 m-0">
                    <li>36" brown branches with 140 warm white LED lights</li>
                    <li>Dynamic 1-in-5 twinkle lighting effect</li>
                    <li>Continuous-lit technology (if one light goes out, rest stay lit)</li>
                    <li>Includes mounting ground stakes</li>
                  </ul>
                </div>

                <div class="spec-block mt-auto">
                  <h4 class="text-base font-bold text-[#0c2340] mb-2.5 pb-0.75 border-b-2 border-[#f49322] inline-block">Specifications</h4>
                  <div class="spec-grid grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-600">
                    <div><span class="font-bold text-slate-900">Height:</span> 36 in</div>
                    <div><span class="font-bold text-slate-900">Quantity:</span> 6 per order</div>
                    <div><span class="font-bold text-slate-900">Lead Wire:</span> 120 in</div>
                    <div><span class="font-bold text-slate-900">Voltage:</span> Low Voltage (Transformer)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Lightbox Modal -->
    <div v-if="activeLightboxImage" class="lightbox fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-6 cursor-zoom-out" @click.self="closeLightbox">
      <button class="lightbox-close absolute top-5 right-6 text-white text-4xl bg-transparent border-none cursor-pointer hover:text-amber-500 transition-colors" @click="closeLightbox">×</button>
      <img
        :src="activeLightboxImage"
        alt="Preview Fullscreen"
        class="lightbox-image max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'sonner'

const config = useRuntimeConfig()
const supabase = useSupabaseClient()
const db = supabase as any
const { addToCart } = useCart()

interface PackageOption {
  name: string
  image_url?: string | null
}

interface PackageVariation {
  id?: number
  name: string
  options: PackageOption[]
}

interface PackageProduct {
  id: number
  name: string
  description: string | null
  price: number | string
  stock: number
  image_url: string | null
  is_package?: boolean
  variations: PackageVariation[]
}

const packages = ref<PackageProduct[]>([])
const loading = ref(true)
const selectedColors = ref<Record<number, string>>({})
const activeInclusions = ref<Record<number, string | null>>({})
const activeLightboxImage = ref<string | null>(null)
const addingToCartId = ref<number | null>(null)

const colors = [
  { name: 'Warm White', hex: '#f5e8c7' },
  { name: 'Pure White', hex: '#f8f9fa' },
  { name: 'Champagne', hex: '#f0e4d2' },
]

useHead({
  title: 'Holiday Lighting Packages - Festive Express',
})

type Hotspot = {
  key: string
  label: string
  top: string
  left: string
  thumb?: string
  packages: string[]
}

const allHotspots: Hotspot[] = [
  { key: 'c9', label: 'C-9 Roofline Lights', top: '32%', left: '72%', thumb: '/Images/Holiday-Lighting-Package/c9lights.png', packages: ['joy', 'jolly', 'merry'] },
  { key: 'wreath', label: '24" Mixed Noble Wreath', top: '33%', left: '55%', thumb: '/Images/Holiday-Lighting-Package/mixed-noble-wreath.png', packages: ['jolly', 'merry'] },
  { key: 'bow', label: '12" Velvet Red Bow', top: '30%', left: '57%', thumb: '/Images/Holiday-Lighting-Package/velvet-red-bow.png', packages: ['jolly', 'merry'] },
  { key: 'ground', label: 'Ground Stake Lights', top: '83%', left: '45%', thumb: '/Images/Holiday-Lighting-Package/ground-lights.png', packages: ['jolly', 'merry'] },
  { key: 'minis', label: '5mm Mini Lights', top: '62%', left: '88%', thumb: '/Images/Holiday-Lighting-Package/5mm-minis.png', packages: ['merry'] },
  { key: 'bursts', label: 'Light Bursts', top: '71%', left: '66%', thumb: '/Images/Holiday-Lighting-Package/light-bursts.png', packages: ['merry'] },
]

const getPackageSlug = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('merry')) return 'merry'
  if (n.includes('jolly')) return 'jolly'
  return 'joy'
}

const orderedPackages = computed(() => {
  const order = ['joy', 'jolly', 'merry']
  return [...packages.value].sort(
    (a, b) => order.indexOf(getPackageSlug(a.name)) - order.indexOf(getPackageSlug(b.name))
  )
})

/** Supabase Storage public URL — no apiBase / imageBase Laravel */
const getImageUrl = (url: string | null | undefined) => {
  if (!url) return '/Images/placeholder.png'
  if (url.startsWith('http') || url.startsWith('/')) return url

  const path = url
    .replace(/^\//, '')
    .replace(/^products\//i, '')
    .replace(/^Products\//i, '')

  const supabaseUrl =
    (config.public.supabaseUrl as string) ||
    (config.public.supabase as any)?.url ||
    ''
  const bucket = (config.public.storageBucket as string) || 'Products'

  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (img) img.src = '/Images/Colors/default-house.jpg'
}

const handlePreviewError = (e: Event, pkg: PackageProduct) => {
  const img = e.target as HTMLImageElement
  if (!img) return
  img.src = pkg.image_url
    ? getImageUrl(pkg.image_url)
    : '/Images/Colors/default-house.jpg'
}

/** Static color mockups in /public (OK) */
const getColorImageUrl = (pkgName: string, colorName?: string) => {
  const packageSlug =
    getPackageSlug(pkgName).charAt(0).toUpperCase() + getPackageSlug(pkgName).slice(1)
  const colorSlug = (colorName || 'Warm White')
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('-')
  return `/Images/Colors/${packageSlug}-${colorSlug}.jpg`
}

const BASE = '/Images/Holiday-Lighting-Package'

/** Fallback only when product.image_url is empty */
const getPackageTitleImage = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('jolly')) return `${BASE}/Jolly.png`
  if (n.includes('merry')) return `${BASE}/Merry.png`
  return `${BASE}/Joy.png`
}

const getPackageIcon = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('jolly')) return `${BASE}/Icon2.png`
  if (n.includes('merry')) return `${BASE}/Icon3.png`
  return `${BASE}/Icon1.png`
}

const getHotspotsForPackage = (pkgName: string) => {
  const slug = getPackageSlug(pkgName)
  return allHotspots.filter((s) => s.packages.includes(slug))
}

const getActiveSpot = (pkgId: number, pkgName: string) => {
  const key = activeInclusions.value[pkgId]
  if (!key) return null
  return getHotspotsForPackage(pkgName).find((s) => s.key === key) || null
}

const activateHotspot = (pkgId: number, key: string) => {
  activeInclusions.value[pkgId] =
    activeInclusions.value[pkgId] === key ? null : key
}

const highlightInclusion = (pkgId: number, optionName: string) => {
  const n = (optionName || '').toLowerCase()
  let key: string | null = null
  if (n.includes('c-9') || n.includes('roofline')) key = 'c9'
  else if (n.includes('wreath')) key = 'wreath'
  else if (n.includes('bow')) key = 'bow'
  else if (n.includes('ground') || n.includes('stake')) key = 'ground'
  else if (n.includes('mini')) key = 'minis'
  else if (n.includes('burst')) key = 'bursts'
  activeInclusions.value[pkgId] = key
}

const openLightbox = (pkg: PackageProduct) => {
  activeLightboxImage.value = getColorImageUrl(
    pkg.name,
    selectedColors.value[pkg.id]
  )
  if (import.meta.client) document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  activeLightboxImage.value = null
  if (import.meta.client) document.body.style.overflow = ''
}

const addToCartHandler = async (pkg: PackageProduct) => {
  if (addingToCartId.value === pkg.id) return
  addingToCartId.value = pkg.id
  const color = selectedColors.value[pkg.id] || 'Warm White'
  try {
    await addToCart(pkg.id, 1, true, { c9_color: color })
    toast.success('Added to cart!', {
      description: `${pkg.name} (${color})`,
    })
  } catch (error) {
    console.error('Failed to add to cart:', error)
    toast.error('Could not add to cart')
  } finally {
    addingToCartId.value = null
  }
}

const parseOptions = (options: unknown): PackageOption[] => {
  if (!options) return []
  if (typeof options === 'string') {
    try {
      const parsed = JSON.parse(options)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return Array.isArray(options) ? (options as PackageOption[]) : []
}

const normalizePackages = (rows: any[]): PackageProduct[] =>
  rows.map((p) => ({
    ...p,
    variations: (p.variations || []).map((v: any) => ({
      ...v,
      options: parseOptions(v.options),
    })),
  }))

/** Same source as fetchPackages — products + is_package */
const loadPackages = async () => {
  loading.value = true
  try {
    const { data, error } = await db
      .from('products')
      .select(
        `
        id,
        name,
        description,
        price,
        stock,
        image_url,
        is_package,
        variations (*)
      `
      )
      .eq('is_package', true)
      .order('created_at', { ascending: true })

    if (error) throw error

    packages.value = normalizePackages(data || [])

    packages.value.forEach((pkg) => {
      selectedColors.value[pkg.id] = 'Warm White'
      activeInclusions.value[pkg.id] = null
    })
  } catch (error) {
    console.error('Failed to load package programs:', error)
  } finally {
    loading.value = false
  }
}

const scrollToSpecs = () => {
  document.getElementById('product-specs')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(async () => {
  await loadPackages()

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
  }
  window.addEventListener('keydown', onKey)
  onUnmounted(() => window.removeEventListener('keydown', onKey))
})
</script>

