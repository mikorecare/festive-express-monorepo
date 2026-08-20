<template>
  <div class="mt-4 p-3 bg-gray-50 rounded-lg">
    <div class="flex justify-center min-h-[85px]">
      <NuxtTurnstile
        :site-key="siteKey"
        data-theme="light"
        size="normal"
        @success="onSuccess"
        @error="onError"
        @expired="onExpired"
      />
    </div>
    <p v-if="errors.turnstile" class="text-red-500 text-sm text-center mt-2">
      {{ errors.turnstile }}
    </p>
    <p v-if="status" class="text-center mt-2" :class="statusClass">
      <i :class="statusIcon"></i> {{ status }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  siteKey: string;
  errors: { turnstile: string };
  status: string;
  statusType: string;
  statusClass: string;
  statusIcon: string;
}>();

const emit = defineEmits<{
  (e: "success", token: string): void;
  (e: "error"): void;
  (e: "expired"): void;
}>();

const onSuccess = (token: string) => {
  emit("success", token);
};

const onError = () => {
  emit("error");
};

const onExpired = () => {
  emit("expired");
};
</script>
