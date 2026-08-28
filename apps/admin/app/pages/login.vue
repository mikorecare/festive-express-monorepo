<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark p-4"
  >
    <div class="max-w-md w-full">
      <div
        class="bg-white p-10 sm:p-12 rounded-2xl shadow-2xl text-center border border-slate-100"
      >
        <h1 class="text-navy text-3xl font-bold mb-2">Admin Login</h1>
        <p class="text-slate-500 mb-8 font-medium">
<<<<<<< HEAD
          Welcome back to FLP Express
=======
          Welcome back to Festive Express
>>>>>>> adfd1e382fa5e69eb7b1bc5659ae9987e27fb20a
        </p>

        <!-- Email/Password Form -->
        <form @submit.prevent="login" class="space-y-6 text-left">
          <div>
            <label class="block text-slate-700 font-semibold mb-2 text-sm"
              >Email Address</label
            >
            <input
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
            />
          </div>

          <div>
            <label class="block text-slate-700 font-semibold mb-2 text-sm"
              >Password</label
            >
            <input
              v-model="form.password"
              type="password"
              placeholder="Enter password"
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
            />
          </div>

          <!-- Cloudflare Turnstile -->
          <div class="flex justify-center">
            <NuxtTurnstile
              ref="turnstileRef"
              :site-key="turnstileSiteKey"
              @verify="onVerify"
              @error="onError"
              @expired="onExpired"
              class="turnstile-wrapper"
              data-theme="light"
            />
          </div>

          <button
            type="submit"
            :disabled="isLoading || !isTurnstileVerified"
            class="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3.5 px-4 rounded-lg transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {{ isLoading ? "Logging in..." : "Login" }}
          </button>

          <!-- Divider -->
          <div class="relative flex py-2 items-center">
            <div class="flex-grow border-t border-slate-200"></div>
            <span
              class="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase"
              >Or continue with</span
            >
            <div class="flex-grow border-t border-slate-200"></div>
          </div>

          <!-- Azure Login Button -->
          <NuxtLink
            href="/api/auth/azure"
            external
            class="flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-[#2f2f2f] hover:bg-black text-white font-medium rounded-lg transition-colors no-underline"
          >
            <svg class="w-5 h-5" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H1z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H1z" />
            </svg>
            Sign in with Microsoft
          </NuxtLink>
        </form>

        <div
          v-if="error"
          class="mt-4 text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100"
        >
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "guest",
});

const supabase = useSupabaseClient();
const turnstileRef = ref<any>(null);

interface TurnstileResponse {
  success: boolean;
  message?: string;
}

const form = ref({
  email: "",
  password: "",
});

const isLoading = ref(false);
const error = ref("");
const isTurnstileVerified = ref(false);
const turnstileToken = ref("");
const config = useRuntimeConfig();
const turnstileSiteKey = config.public.turnstileSiteKey || "YOUR_SITE_KEY";

const onVerify = (token: string) => {
  isTurnstileVerified.value = true;
  turnstileToken.value = token;
  error.value = "";
  console.log("Turnstile verified successfully");
};

const onError = () => {
  isTurnstileVerified.value = false;
  turnstileToken.value = "";
  error.value = "Security verification failed. Please try again.";
  console.error("Turnstile verification failed");
};

const onExpired = () => {
  isTurnstileVerified.value = false;
  turnstileToken.value = "";
  error.value = "Security verification expired. Please complete it again.";
  console.log("Turnstile token expired");
};

const login = async () => {
  if (!isTurnstileVerified.value) {
    error.value = "Please complete the security verification";
    return;
  }

  isLoading.value = true;
  error.value = "";

  try {
    const verifyResponse = await $fetch<TurnstileResponse>("/api/auth/verify", {
      method: "POST",
      body: { token: turnstileToken.value },
    });

    if (!verifyResponse.success) {
      error.value = verifyResponse.message || "Security verification failed";
      isTurnstileVerified.value = false;
      if (turnstileRef.value) {
        turnstileRef.value.reset();
      }
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: form.value.email,
      password: form.value.password,
    });

    if (authError) {
      error.value = authError.message;
      return;
    }

    if (data.session) {
      const accessToken = useCookie("sb-access-token", {
        maxAge: 60 * 60 * 8,
        path: "/",
      });
      accessToken.value = data.session.access_token;

      const refreshToken = useCookie("sb-refresh-token", {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      refreshToken.value = data.session.refresh_token;

      const authCookie = useCookie("sb-auth", {
        maxAge: 60 * 60 * 8,
        path: "/",
      });
      authCookie.value = "true";
    }

    navigateTo("/admin");
  } catch (err: any) {
    error.value = err.message || "An unexpected error occurred during login";
  } finally {
    isLoading.value = false;
  }
};
</script>
<<<<<<< HEAD

<style scoped>
.turnstile-wrapper {
  display: flex;
  justify-content: center;
  min-height: 65px;
}
</style>
=======
>>>>>>> adfd1e382fa5e69eb7b1bc5659ae9987e27fb20a
