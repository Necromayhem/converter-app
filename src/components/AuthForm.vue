<script setup lang="ts">
import { computed, ref } from "vue";
import { useForm, useField } from "vee-validate";
import schema from '../schemes/validationAuthForm';
import { useRouter } from 'vue-router';

const router = useRouter();

const serverError = ref<string | null>(null);

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  validateOnMount: false, 
});

const {
  value: email,
  errorMessage: emailError,
  meta: emailMeta,
} = useField("email");
const {
  value: password,
  errorMessage: passwordError,
  meta: passwordMeta,
} = useField("password");
const {
  value: confirmPassword,
  errorMessage: confirmPasswordError,
  meta: confirmPasswordMeta,
} = useField("confirmPassword");

const submitted = ref(false); 
const shouldShowError = (meta: any) =>
  (submitted.value || meta.touched) && !meta.valid;
const showPasswordIcon = computed(() => !shouldShowError(passwordMeta));

const showPassword = ref(false);

const onSubmit = handleSubmit(async (values) => {
  console.log("Попытка авторизации");
  submitted.value = true;
  serverError.value = null;

  try {
    console.log("Отправка данных:", values); 

    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });

    console.log("Статус ответа:", response.status);

    const responseData = await response.json();
    console.log("Ответ сервера:", responseData); 

    if (!response.ok) {
      const errorMessage = 
        responseData.message || 
        responseData.error ||
        getValidationError(responseData.errors) ||
        "Ошибка сервера";
      throw new Error(errorMessage);
    }

    if (!responseData.accessToken) {
      throw new Error("Токен не получен");
    }

    console.log('Успешная авторизация. accessToken: ', responseData.accessToken);
    router.push('/home');

  } catch (error) {
    console.error("Ошибка авторизации:", error);
    if (error instanceof Error) {
      serverError.value = error.message;
    } else {
      serverError.value = "Неизвестная ошибка";
    }
  } finally {
    submitted.value = false;
  }
});


function getValidationError(errors: Record<string, string[]> | undefined): string | null {
  if (!errors) return null;
  return Object.values(errors).flat().join(", ");
}
</script>

<template>
  <div class="container">
    <div class="register-form">
      <h2>Авторизация</h2>
      <div v-if="serverError" class="server-error">
        {{ serverError }}
      </div>
      <form @submit.prevent="onSubmit" novalidate>

        <div class="form-group">
          <input
            type="email"
            placeholder="Ваша почта"
            v-model="email"
            formnovalidate
            :class="{
              'error-input': shouldShowError(emailMeta),
              'input-shake': shouldShowError(emailMeta),
            }"
          />
          <span v-if="shouldShowError(emailMeta)" class="error-message">
            {{ emailError }}
          </span>
        </div>

        <div class="form-group password-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            placeholder="Пароль"
            v-model="password"
            :class="{
              'error-input': shouldShowError(passwordMeta),
              'input-shake': shouldShowError(passwordMeta),
            }"
          />
          <span
            class="toggle-password"
            @click="showPassword = !showPassword"
            v-show="showPasswordIcon"
          >
            <img
              :src="`/icons/${showPassword ? 'close-eye' : 'open-eye'}.svg`"
            />
          </span>
          <span v-if="shouldShowError(passwordMeta)" class="error-message">
            {{ passwordError }}
          </span>
        </div>

        <button class="btn-register" type="submit">Вход</button>
        <div class="login-wrapper">
          <span class="login">Нет аккаунта?</span>
          <span class="login auth" @click="router.push('/register')">Создать</span>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  box-sizing: border-box;
}

.register-form {
  width: 400px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  & h2 {
    font-family: "Comfortaa", sans-serif;
    font-weight: 700;
    font-size: 35px;
    text-align: center;
    margin: 0 0 10px 0;
    color: #333;
  }
}

form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  & .form-group {
    position: relative;
    display: flex;
  }
  & .login-wrapper {
    display: block;
    justify-content: center;
    align-items: center;
  }
  & .login {
    font-size: 12px;
    line-height: 1.2;
    font-family: "Rubik", sans-serif;
    font-weight: 400;
    display: block;
    text-align: center;
    padding: 0 10px;
    white-space: nowrap;
  }
  & .auth {
    display: block;
    color: blue;
    &:hover {
      cursor: pointer;
    }
  }
}

input {
  font-size: 16px;
  font-family: "Rubik", sans-serif;
  font-weight: 500;
  flex: 1;
  padding: 12px 50px 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #42b983;
  }
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
  padding: 5px;
  background: transparent;
  border: none;
  font-size: 18px;
  .toggle-password {
    transition: opacity 0.5s ease;

    &[v-show="false"] {
      opacity: 0;
      pointer-events: none;
    }
  }

  & img {
    width: 34px;
    height: 34px;
  }
}

.btn-register {
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3aa876;
  }
}

.error-input {
  border-color: #ff4444 !important;
}

.error-message {
  display: block;
  color: #ff4444;
  font-size: 14px;
  margin-top: 5px;
  padding: 0 5px;
  font-family: "Rubik", sans-serif;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.input-shake {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translateX(-1px);
  }
  20%,
  80% {
    transform: translateX(2px);
  }
  30%,
  50%,
  70% {
    transform: translateX(-4px);
  }
  40%,
  60% {
    transform: translateX(4px);
  }
}

.server-error {
  color: #ff4444;
  background-color: #ffeeee;
  border-radius: 4px;
}
</style>
