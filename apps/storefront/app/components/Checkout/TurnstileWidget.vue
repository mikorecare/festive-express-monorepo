<template>
  <div class="mt-4 px-3 bg-gray-50 rounded-lg">
    <div class="flex justify-center min-h-max">
      <NuxtTurnstile
        ref="turnstileRef"
        v-model="token"
        :site-key="siteKey"
        :options="{
          theme: 'light',
          size: 'normal',
        }"
        @success="onSuccess"
        @error="onError"
        @expired="onExpired"
      />
    </div>
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

const turnstileRef = ref<any>(null);
const token = ref<string>("");

const onSuccess = (t: string) => {
  token.value = t;
  emit("success", t);
};

const onError = () => {
  emit("error");
};

const onExpired = () => {
  token.value = "";
  emit("expired");
};

const resetTurnstile = () => {
  if (turnstileRef.value) {
    turnstileRef.value.reset();
  }
  token.value = "";
};

const getResponse = (): string | null => {
  return token.value || null;
};

defineExpose({
  reset: resetTurnstile,
  getResponse: getResponse,
});
</script>
