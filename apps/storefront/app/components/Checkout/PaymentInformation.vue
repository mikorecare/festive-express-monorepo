<template>
  <div class="bg-white rounded-2xl p-6 shadow-md">
    <h3 class="text-lg font-bold text-navy mb-4 flex items-center">
      <i class="fas fa-credit-card mr-2"></i> Payment Information
    </h3>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Cardholder Name *</label
        >
        <input
          :value="modelValue.card_name"
          @input="
            updateField('card_name', ($event.target as HTMLInputElement).value)
          "
          @blur="$emit('validate', 'card_name')"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          :class="{ 'border-red-500': errors.card_name }"
          placeholder="John Doe"
        />
        <p v-if="errors.card_name" class="text-red-500 text-sm mt-1">
          {{ errors.card_name }}
        </p>
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1"
          >Card Number *</label
        >
        <div class="flex">
          <span
            class="inline-flex items-center px-3 border border-r-0 rounded-l-lg bg-gray-50 transition-colors duration-300"
            :style="{
              borderColor: cardBorderColor,
              borderTopColor: cardBorderColor,
              borderBottomColor: cardBorderColor,
              borderLeftColor: cardBorderColor,
            }"
          >
            <div
              v-html="cardSvg"
              class="w-7 h-5 flex items-center justify-center"
            ></div>
          </span>
          <input
            :value="modelValue.card_number"
            @input="handleCardNumberInput"
            @blur="$emit('validate', 'card_number')"
            type="text"
            class="flex-1 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-300"
            :style="{
              borderColor: errors.card_number ? '#EF4444' : cardBorderColor,
              borderTopColor: errors.card_number ? '#EF4444' : cardBorderColor,
              borderBottomColor: errors.card_number
                ? '#EF4444'
                : cardBorderColor,
              borderRightColor: errors.card_number
                ? '#EF4444'
                : cardBorderColor,
            }"
            placeholder="0000 0000 0000 0000"
            maxlength="19"
          />
        </div>
        <div class="flex justify-between mt-1">
          <p v-if="errors.card_number" class="text-red-500 text-sm">
            {{ errors.card_number }}
          </p>
          <p
            v-else-if="cardType"
            class="text-sm font-semibold"
            :style="{ color: cardColor }"
          >
            {{ cardType }}
          </p>
          <p v-else class="text-sm text-gray-400">Enter card number</p>
          <span v-if="isValidCard" class="text-green-500 text-sm">
            <i class="fas fa-check-circle"></i> Valid
          </span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"
            >Expiry Date *</label
          >
          <input
            :value="modelValue.card_expiry"
            @input="handleExpiryInput"
            @blur="$emit('validate', 'card_expiry')"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.card_expiry }"
            placeholder="MM/YY"
            maxlength="5"
          />
          <p v-if="errors.card_expiry" class="text-red-500 text-sm mt-1">
            {{ errors.card_expiry }}
          </p>
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1"
            >CVV *</label
          >
          <input
            :value="modelValue.card_cvv"
            @input="
              updateField('card_cvv', ($event.target as HTMLInputElement).value)
            "
            @blur="$emit('validate', 'card_cvv')"
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            :class="{ 'border-red-500': errors.card_cvv }"
            placeholder="•••"
            maxlength="4"
          />
          <p v-if="errors.card_cvv" class="text-red-500 text-sm mt-1">
            {{ errors.card_cvv }}
          </p>
        </div>
      </div>
      <div class="flex items-center">
        <input
          :checked="modelValue.billing_same"
          @change="
            updateField(
              'billing_same',
              ($event.target as HTMLInputElement).checked,
            )
          "
          type="checkbox"
          id="billingSame"
          class="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
        />
        <label for="billingSame" class="ml-2 text-sm text-gray-700">
          Billing address is same as installation address
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface FormData {
  card_name: string;
  card_number: string;
  card_expiry: string;
  card_cvv: string;
  billing_same: boolean;
}

interface ValidationErrors {
  card_name: string;
  card_number: string;
  card_expiry: string;
  card_cvv: string;
}

const props = defineProps<{
  modelValue: FormData;
  errors: ValidationErrors;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: FormData): void;
  (e: "validate", field: string): void;
}>();

// Card SVG icons
const cardSvgs: Record<string, string> = {
  visa: `<svg width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="27" height="18" rx="2" fill="#1434CB"/>
    <rect x="0.5" y="0.5" width="26" height="17" rx="1.5" stroke="black" stroke-opacity="0.2"/>
    <path d="M16.6781 5.48601C15.187 5.48601 13.8545 6.25887 13.8545 7.68678C13.8545 9.32432 16.2177 9.43742 16.2177 10.2601C16.2177 10.6065 15.8208 10.9165 15.1428 10.9165C14.1806 10.9165 13.4614 10.4833 13.4614 10.4833L13.1537 11.9242C13.1537 11.9242 13.9822 12.2902 15.0821 12.2902C16.7123 12.2902 17.9951 11.4794 17.9951 10.027C17.9951 8.29668 15.622 8.18694 15.622 7.42337C15.622 7.15203 15.9479 6.85472 16.6239 6.85472C17.3867 6.85472 18.009 7.16982 18.009 7.16982L18.3102 5.77813C18.3102 5.77813 17.633 5.48601 16.6781 5.48601ZM3.03611 5.59104L3 5.80111C3 5.80111 3.6273 5.91591 4.19229 6.14493C4.91975 6.40754 4.97158 6.56041 5.09409 7.03524L6.42916 12.1819H8.21882L10.9759 5.59104H9.19037L7.41876 10.0722L6.69584 6.27376C6.62954 5.83903 6.29372 5.59104 5.88266 5.59104H3.03611ZM11.6939 5.59104L10.2932 12.1819H11.9959L13.3917 5.59104H11.6939ZM21.1904 5.59104C20.7798 5.59104 20.5623 5.81086 20.4026 6.19498L17.9081 12.1819H19.6937L20.0391 11.184H22.2144L22.4245 12.1819H24L22.6255 5.59104H21.1904ZM21.4226 7.37168L21.9519 9.84487H20.5339L21.4226 7.37168Z" fill="white"/>
  </svg>`,

  mastercard: `<svg width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="27" height="18" rx="2" fill="#252525"/>
    <rect x="0.5" y="0.5" width="26" height="17" rx="1.5" stroke="white" stroke-opacity="0.2"/>
    <path d="M11.2017 4.81709H15.7983V13.0763H11.2017V4.81709Z" fill="#FF5F00"/>
    <path d="M11.4936 8.94668C11.4936 7.26857 12.2815 5.78016 13.4927 4.81707C12.6026 4.11664 11.479 3.69346 10.2532 3.69346C7.34936 3.69346 5 6.04282 5 8.94668C5 11.8505 7.34936 14.1999 10.2532 14.1999C11.479 14.1999 12.6026 13.7767 13.4927 13.0763C12.2815 12.1278 11.4936 10.6248 11.4936 8.94668Z" fill="#EB001B"/>
    <path d="M22 8.94668C22 11.8505 19.6506 14.1999 16.7468 14.1999C15.521 14.1999 14.3974 13.7767 13.5073 13.0763C14.733 12.1132 15.5064 10.6248 15.5064 8.94668C15.5064 7.26857 14.7184 5.78016 13.5073 4.81707C14.3974 4.11664 15.521 3.69346 16.7468 3.69346C19.6506 3.69346 22 6.05741 22 8.94668Z" fill="#F79E1B"/>
  </svg>`,

  "american express": `<svg width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="27" height="18" rx="2" fill="#016FD0"/>
    <rect x="0.5" y="0.5" width="26" height="17" rx="1.5" stroke="black" stroke-opacity="0.2"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M26.74 13.35V15.306H24.256L23.338 14.232L22.384 15.306H15.328V9.588H13L15.91 3H18.742L19.426 4.494V3H22.942L23.53 4.566L24.106 3H26.74V3.92999H24.706L23.782 6.36601L23.536 7.02599L22.354 3.92999H20.32V8.72998L18.208 3.92999H16.57L14.446 8.72998H15.838L16.21 7.806H18.538L18.91 8.72998H20.32H21.544V5.604L21.538 4.97399L21.778 5.604L22.948 8.72998H24.112L25.288 5.604L25.516 4.98V8.72998H26.74V10.608L25.384 11.97L26.74 13.35ZM16.312 14.376V9.59397H20.32V10.632H17.536V11.472H20.266V12.504H17.536V13.338H20.32V14.376H16.312ZM26.368 14.376H24.778L23.326 12.816L21.868 14.376H20.32L22.558 11.994L20.32 9.59397H21.916L23.356 11.148L24.802 9.59397H26.368L24.124 11.976L26.368 14.376Z" fill="white"/>
    <path d="M17.374 4.95599L17.134 5.55601L16.636 6.76798H18.112L17.614 5.55601L17.374 4.95599Z" fill="white"/>
  </svg>`,

  discover: `<svg width="27" height="18" viewBox="0 0 27 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="27" height="18" rx="2" fill="#231F20"/>
    <rect x="0.5" y="0.5" width="26" height="17" rx="1.5" stroke="white" stroke-opacity="0.2"/>
    <path d="M27 12C27 12 20.9955 16.1424 10 18H27V12Z" fill="#F48120"/>
    <path d="M3.05339 6.95041H2V10.6406H3.05339C3.61027 10.6406 4.01284 10.5064 4.36844 10.2179C4.79114 9.86903 5.03939 9.34569 5.03939 8.80222C5.03268 7.70858 4.22083 6.95041 3.05339 6.95041ZM3.89878 9.72813C3.67066 9.92941 3.38215 10.0233 2.91249 10.0233H2.71791V7.5811H2.91249C3.37544 7.5811 3.65724 7.66161 3.89878 7.87632C4.14703 8.09773 4.29464 8.43991 4.29464 8.79551C4.29464 9.15111 4.14703 9.50672 3.89878 9.72813Z" fill="white"/>
    <path d="M6.08603 6.95041H5.36812V10.6406H6.08603V6.95041Z" fill="white"/>
    <path d="M7.84393 8.3661C7.41452 8.20508 7.28704 8.09773 7.28704 7.90315C7.28704 7.66832 7.51516 7.49387 7.8238 7.49387C8.0385 7.49387 8.21966 7.5811 8.40081 7.7958L8.77654 7.30601C8.46791 7.03763 8.09889 6.89673 7.68961 6.89673C7.03879 6.89673 6.53558 7.35297 6.53558 7.95683C6.53558 8.46675 6.77041 8.72841 7.44136 8.96996C7.72316 9.0706 7.86406 9.13769 7.93786 9.17795C8.07876 9.27188 8.15256 9.40607 8.15256 9.56039C8.15256 9.86231 7.91773 10.0837 7.59568 10.0837C7.25349 10.0837 6.97841 9.90928 6.81067 9.59394L6.34772 10.0435C6.67648 10.5333 7.07905 10.748 7.62252 10.748C8.36727 10.748 8.89731 10.2515 8.89731 9.53355C8.91073 8.93641 8.66248 8.66803 7.84393 8.3661Z" fill="white"/>
    <path d="M9.13222 8.80222C9.13222 9.88916 9.98432 10.7278 11.078 10.7278C11.3866 10.7278 11.655 10.6675 11.977 10.5131V9.66775C11.6885 9.95625 11.4336 10.0703 11.1115 10.0703C10.3869 10.0703 9.87026 9.54697 9.87026 8.79551C9.87026 8.08431 10.4003 7.52742 11.078 7.52742C11.4201 7.52742 11.6818 7.6482 11.977 7.94341V7.09802C11.6617 6.93699 11.4 6.8699 11.0914 6.8699C10.0112 6.8699 9.13222 7.72871 9.13222 8.80222Z" fill="white"/>
    <path d="M17.6934 9.43291L16.7071 6.95041H15.9221L17.4854 10.7345H17.8746L19.4647 6.95041H18.6864L17.6934 9.43291Z" fill="white"/>
    <path d="M19.7935 10.6406H21.8332V10.0166H20.5114V9.02363H21.7862V8.39965H20.5114V7.5811H21.8332V6.95041H19.7935V10.6406Z" fill="white"/>
    <path d="M24.6847 8.04404C24.6847 7.35296 24.2083 6.95711 23.3763 6.95711H22.3095V10.6473H23.0275V9.16452H23.1214L24.1144 10.6473H25L23.8393 9.09072C24.3828 8.97666 24.6847 8.60764 24.6847 8.04404ZM23.2354 8.6546H23.0275V7.53412H23.2489C23.6984 7.53412 23.9399 7.72199 23.9399 8.0843C23.9399 8.45332 23.6984 8.6546 23.2354 8.6546Z" fill="white"/>
    <path d="M14.1843 10.7748C15.27 10.7748 16.1501 9.89465 16.1501 8.80892C16.1501 7.7232 15.27 6.84305 14.1843 6.84305C13.0986 6.84305 12.2184 7.7232 12.2184 8.80892C12.2184 9.89465 13.0986 10.7748 14.1843 10.7748Z" fill="#F48120"/>
  </svg>`,

  "diners club": `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 780 500" version="1.1" xml:space="preserve" viewBox="180.06 83.35 419.87 333.3"><path d="m599.93 251.45c0-99.416-82.979-168.13-173.9-168.1h-78.241c-92.003-0.033-167.73 68.705-167.73 168.1 0 90.931 75.729 165.64 167.73 165.2h78.241c90.913 0.437 173.9-74.293 173.9-165.2z" fill="#0079BE"/><path d="m348.28 97.432c-84.069 0.026-152.19 68.308-152.22 152.58 0.021 84.258 68.145 152.53 152.22 152.56 84.088-0.025 152.23-68.301 152.24-152.56-0.011-84.274-68.15-152.55-152.24-152.58z" fill="#ffffff"/><path d="m252.07 249.6c0.08-41.18 25.747-76.296 61.94-90.25v180.48c-36.193-13.946-61.861-49.044-61.94-90.229zm131 90.275v-180.52c36.208 13.921 61.915 49.057 61.98 90.256-0.066 41.212-25.772 76.322-61.98 90.269z" fill="#0079BE"/></svg>`,

  jcb: `<svg version="1.1" id="1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 218 182" style="enable-background:new 0 0 218 182;" xml:space="preserve">
    <style type="text/css">
      .st0{fill:#FFFFFF;}
      .st1{fill:url(#SVGID_1_);}
      .st2{fill:url(#SVGID_2_);}
      .st3{fill:url(#SVGID_3_);}
      .st4{fill:url(#SVGID_4_);}
      .st5{fill:url(#SVGID_5_);}
    </style>
    <g>
      <g>
        <path class="st0" d="M192,109.3c0,14-11.4,25.4-25.4,25.4H28.4V34.1c0-14,11.4-25.4,25.4-25.4H192V109.3z"/>
        <g>
          
            <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="135.2719" y1="81.0636" x2="175.2211" y2="81.0636" gradientTransform="matrix(1.125 0 0 1.125 -14.1005 -12.4865)">
            <stop  offset="0" style="stop-color:#007940"/>
            <stop  offset="0.2285" style="stop-color:#00873F"/>
            <stop  offset="0.7433" style="stop-color:#40A737"/>
            <stop  offset="1" style="stop-color:#5CB531"/>
          </linearGradient>
          <path class="st1" d="M147,83.5h10.5c0.3,0,1-0.1,1.3-0.1c2-0.4,3.7-2.2,3.7-4.7c0-2.4-1.7-4.2-3.7-4.7c-0.3-0.1-0.9-0.1-1.3-0.1
            H147V83.5z"/>
          
            <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="135.2733" y1="74.8365" x2="175.2207" y2="74.8365" gradientTransform="matrix(1.125 0 0 1.125 -14.1005 -12.4865)">
            <stop  offset="0" style="stop-color:#007940"/>
            <stop  offset="0.2285" style="stop-color:#00873F"/>
            <stop  offset="0.7433" style="stop-color:#40A737"/>
            <stop  offset="1" style="stop-color:#5CB531"/>
          </linearGradient>
          <path class="st2" d="M156.3,17.2c-10,0-18.2,8.1-18.2,18.2v18.9h25.7c0.6,0,1.3,0,1.8,0.1c5.8,0.3,10.1,3.3,10.1,8.5
            c0,4.1-2.9,7.6-8.3,8.3v0.2c5.9,0.4,10.4,3.7,10.4,8.8c0,5.5-5,9.1-11.6,9.1h-28.2v37h26.7c10,0,18.2-8.1,18.2-18.2V17.2H156.3z"
            />
          
            <linearGradient id="SVGID_3_" gradientUnits="userSpaceOnUse" x1="135.2718" y1="68.0635" x2="175.2175" y2="68.0635" gradientTransform="matrix(1.125 0 0 1.125 -14.1005 -12.4865)">
            <stop  offset="0" style="stop-color:#007940"/>
            <stop  offset="0.2285" style="stop-color:#00873F"/>
            <stop  offset="0.7433" style="stop-color:#40A737"/>
            <stop  offset="1" style="stop-color:#5CB531"/>
          </linearGradient>
          <path class="st3" d="M161.2,64.1c0-2.4-1.7-4-3.7-4.3c-0.2,0-0.7-0.1-1-0.1H147v8.8h9.5c0.3,0,0.9,0,1-0.1
            C159.5,68.1,161.2,66.5,161.2,64.1z"/>
        </g>
        
          <linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="45.8469" y1="74.8365" x2="86.4106" y2="74.8365" gradientTransform="matrix(1.125 0 0 1.125 -14.1005 -12.4865)">
          <stop  offset="0" style="stop-color:#1F286F"/>
          <stop  offset="0.4751" style="stop-color:#004E94"/>
          <stop  offset="0.8261" style="stop-color:#0066B1"/>
          <stop  offset="1" style="stop-color:#006FBC"/>
        </linearGradient>
        <path class="st4" d="M55.7,17.2c-10,0-18.2,8.1-18.2,18.2v44.9c5.1,2.5,10.4,4.1,15.7,4.1c6.3,0,9.7-3.8,9.7-9V54.2h15.6v21.1
          c0,8.2-5.1,14.9-22.4,14.9c-10.5,0-18.7-2.3-18.7-2.3v38.3h26.7c10,0,18.2-8.1,18.2-18.2V17.2H55.7z"/>
        
          <linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="90.3472" y1="74.8365" x2="129.7425" y2="74.8365" gradientTransform="matrix(1.125 0 0 1.125 -14.1005 -12.4865)">
          <stop  offset="0" style="stop-color:#6C2C2F"/>
          <stop  offset="0.1735" style="stop-color:#882730"/>
          <stop  offset="0.5731" style="stop-color:#BE1833"/>
          <stop  offset="0.8585" style="stop-color:#DC0436"/>
          <stop  offset="1" style="stop-color:#E60039"/>
        </linearGradient>
        <path class="st5" d="M106,17.2c-10,0-18.2,8.1-18.2,18.2v23.8c4.6-3.9,12.6-6.4,25.5-5.8c6.9,0.3,14.3,2.2,14.3,2.2v7.7
          c-3.7-1.9-8.1-3.6-13.8-4c-9.8-0.7-15.7,4.1-15.7,12.5c0,8.5,5.9,13.3,15.7,12.5c5.7-0.4,10.1-2.2,13.8-4v7.7
          c0,0-7.3,1.9-14.3,2.2c-12.9,0.6-20.9-1.9-25.5-5.8v42h26.7c10,0,18.2-8.1,18.2-18.2V17.2H106z"/>
      </g>
      <g>
        <g>
          <path class="st0" d="M11,151.3v13c0,2.2,0.5,3.2,0.9,3.8c1.3,1.7,3.3,2.1,4.8,2.1c5.7,0,5.7-4.4,5.7-5.9v-12.8h2.8v12.9
            c0,1.1,0,3.5-1.7,5.6c-2.1,2.6-5.2,2.9-6.8,2.9c-2,0-5.4-0.5-7.4-3.3c-0.6-0.9-1.2-2.1-1.2-5.3v-12.8H11z"/>
          <path class="st0" d="M29.8,159.3l0-1.7h2.7l0,2.3c0.3-0.6,1.4-2.6,4.7-2.6c1.3,0,5.3,0.5,5.3,5v9.9h-2.8v-9.2
            c0-1-0.1-1.8-0.8-2.5c-0.7-0.7-1.7-1-2.6-1c-2,0-3.8,1.4-3.8,4.3v8.4h-2.7V159.3z"/>
          <path class="st0" d="M47.1,151.3h3.3v3h-3.3V151.3z M47.4,157.6h2.7v14.5h-2.7V157.6z"/>
          <path class="st0" d="M68.1,157.6c0,0.6-0.1,1.9-0.1,2.4v17.8h-2.8v-7.2c-0.2,0.3-0.5,0.8-1.2,1.2c-1.2,0.8-2.6,0.9-3.3,0.9
            c-3.5,0-6.6-2.5-6.6-7.9c0-5.4,3-7.4,6.1-7.4c3,0,4.3,1.6,5,2.6l0.1-2.4H68.1z M61,159.4c-3.9,0-4,4.1-4,5.2c0,1,0.1,3.2,1.2,4.6
            c0.6,0.9,1.8,1.4,3.1,1.4c3.4,0,4-2.6,4-5.5C65.4,164,65.4,159.4,61,159.4z"/>
          <path class="st0" d="M75.9,157.6v9.4c0,1.4,0.3,3.2,3.1,3.2c1.4,0,2.6-0.5,3.4-1.6c0.6-0.9,0.6-2,0.6-2.7v-8.2h2.8v11.8
            c0,0.3,0.1,1.9,0.1,2.7h-2.8l-0.1-2.5c-0.5,1-1.5,2.6-4.6,2.6c-3.6,0-5.3-2.1-5.3-4.9v-9.8H75.9z"/>
          <path class="st0" d="M92.9,165.4c-0.1,3,1.2,5.2,4.2,5.2c1.8,0,3.2-0.9,3.4-3h2.7c-0.1,0.7-0.2,1.9-1.2,3c-0.6,0.7-2.1,1.9-5,1.9
            c-4.6,0-6.8-2.8-6.8-7.4c0-2.9,0.6-5.2,2.9-6.8c1.4-1,3.1-1.1,4-1.1c6.5,0,6.4,5.8,6.3,8.1H92.9z M100.5,163.5
            c0-1.4-0.2-4.3-3.6-4.3c-1.8,0-3.9,1.1-4,4.3H100.5z"/>
          <path class="st0" d="M107.9,151.3h2.7v20.9h-2.7V151.3z"/>
          <path class="st0" d="M122.1,172.3l-2.1,5.4h-2.8l2.2-5.6l-6.1-14.5h3.1l4.6,11.5l4.6-11.5h3L122.1,172.3z"/>
          <path class="st0" d="M143.1,164l-8.2-12.7h3.6l6.2,10.3l6.3-10.3h3.2l-8.2,12.8v8.1h-2.9V164z"/>
          <path class="st0" d="M160.1,157.3c5.8,0,7.1,4.6,7.1,7.6c0,4.3-2.4,7.8-7.4,7.8c-4.8,0-7.2-3.3-7.2-7.6
            C152.7,161.5,154.4,157.3,160.1,157.3z M159.9,170.6c2.1,0,4.4-1.5,4.4-5.9c0-3.6-1.7-5.5-4.2-5.5c-1.7,0-4.5,1.1-4.5,5.7
            C155.5,167.9,156.8,170.6,159.9,170.6z"/>
          <path class="st0" d="M174.1,157.6v9.4c0,1.4,0.3,3.2,3.1,3.2c1.4,0,2.6-0.5,3.4-1.6c0.6-0.9,0.6-2,0.6-2.7v-8.2h2.8v11.8
            c0,0.3,0.1,1.9,0.1,2.7h-2.8l-0.1-2.5c-0.5,1-1.5,2.6-4.6,2.6c-3.6,0-5.3-2.1-5.3-4.9v-9.8H174.1z"/>
          <path class="st0" d="M189.5,160.6c0-1-0.1-2-0.1-3h2.8l0.1,2.8c0.5-2,2.3-2.7,3.5-2.9c0.8-0.1,1.4-0.1,1.9-0.1v2.7
            c-0.1-0.1-0.3-0.1-0.5-0.1c-0.2,0-0.5,0-0.8,0c-3.2,0-4,1.9-4,4.4v7.7h-2.8V160.6z"/>
          <path class="st0" d="M202.3,167.9c0,1.1,0.6,2.6,3.2,2.6c1.1,0,2-0.2,2.6-0.9c0.3-0.4,0.5-0.9,0.5-1.4c0-1.4-1-1.7-3.2-2.2
            c-3-0.7-5.6-1.3-5.6-4.3c0-2.7,2.3-4.4,5.7-4.4c1.8,0,4.4,0.5,5.2,2.3c0.4,0.8,0.4,1.5,0.4,2.1h-2.8c0.1-2.2-1.8-2.4-2.8-2.4
            c-0.4,0-3,0-3,2.1c0,1.3,1.3,1.7,2.1,1.9c4,1,4.9,1.2,5.8,2c0.8,0.8,1.1,1.8,1.1,2.7c0,1.6-0.9,3-2,3.7c-1.3,0.8-2.8,1-4.3,1
            c-3,0-5.7-1.2-5.7-4.7H202.3z"/>
        </g>
      </g>
    </g>
  </svg>`,
};

// Card brand colors from the SVG icons
const cardBrandColors: Record<string, string> = {
  visa: "#1434CB",
  mastercard: "#252525",
  "american express": "#016FD0",
  discover: "#231F20",
  "diners club": "#0079BE",
  jcb: "#007940",
};

const cardType = computed(() => {
  const number = props.modelValue.card_number.replace(/\D/g, "");
  if (!number) return "";

  const targetPatterns = [
    { name: "Visa", regex: /^4/ },
    { name: "Mastercard", regex: /^(5[1-5]|2[2-7])/ },
    { name: "American Express", regex: /^3[47]/ },
    {
      name: "Discover",
      regex:
        /^(6011|65|64[4-9]|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]))/,
    },
    { name: "Diners Club", regex: /^3(0[0-5]|[689])/ },
    { name: "JCB", regex: /^(352[89]|35[3-8][0-9])/ },
  ];

  for (const card of targetPatterns) {
    if (card.regex.test(number)) {
      return card.name;
    }
  }

  return "";
});

const cardColor = computed(() => {
  const type = cardType.value.toLowerCase();
  return cardBrandColors[type] || "#6B7280";
});

const cardBorderColor = computed(() => {
  if (props.errors.card_number) {
    return "#EF4444";
  }
  const type = cardType.value.toLowerCase();
  return cardBrandColors[type] || "#D1D5DB";
});

const cardSvg = computed(() => {
  const type = cardType.value.toLowerCase();
  return cardSvgs[type] || cardSvgs.visa;
});

// Luhn Algorithm for checking correct credit card numbers before sending it to actual payment gateway
const validateLuhn = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, "");

  if (!digits || digits.length < 13 || digits.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

const isValidCard = computed(() => {
  const number = props.modelValue.card_number.replace(/\s/g, "");
  if (number.length < 13) return false;
  return validateLuhn(number);
});

const updateField = (field: keyof FormData, value: any) => {
  emit("update:modelValue", {
    ...props.modelValue,
    [field]: value,
  });
};

const handleCardNumberInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, "");
  const maxLength = cardType.value === "American Express" ? 15 : 16;
  if (value.length > maxLength) {
    value = value.slice(0, maxLength);
  }

  let formatted = "";
  if (cardType.value === "American Express") {
    if (value.length > 0) formatted += value.slice(0, 4);
    if (value.length > 4) formatted += " " + value.slice(4, 10);
    if (value.length > 10) formatted += " " + value.slice(10, 15);
  } else {
    // Standard format: 1234 1234 1234 1234
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " ";
      }
      formatted += value.charAt(i);
    }
  }

  emit("update:modelValue", {
    ...props.modelValue,
    card_number: formatted,
  });
};

const handleExpiryInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, "");

  if (value.length > 4) {
    value = value.slice(0, 4);
  }

  if (value.length >= 2) {
    const month = parseInt(value.slice(0, 2));
    if (month > 12) {
      value = "12" + value.slice(2);
    }
    if (month < 1 && value.length >= 2) {
      value = "01" + value.slice(2);
    }
  }

  if (value.length >= 2) {
    const month = value.slice(0, 2);
    const year = value.slice(2);
    emit("update:modelValue", {
      ...props.modelValue,
      card_expiry: month + (year ? "/" + year : ""),
    });
  } else {
    emit("update:modelValue", {
      ...props.modelValue,
      card_expiry: value,
    });
  }
};

defineExpose({
  validateLuhn,
  isValidCard,
  cardType,
});
</script>
