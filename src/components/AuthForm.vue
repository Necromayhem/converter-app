<script setup>
import { ref } from "vue";

const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleSubmit = () => {
  console.log("Текущие значения формы:");
  console.log("Name:", form.value.name);
  console.log("Email:", form.value.email);
  console.log("Password:", form.value.password);
  console.log("Confirm:", form.value.confirmPassword);
};
</script>

<template>
  <div class="container">
    <div class="register-form">
      <h2>Авторизация</h2>

      <form @submit.prevent="handleSubmit">

        <div class="form-group">
          <input type="email" placeholder="Ваша почта" v-model="form.email" />
        </div>

        <div class="form-group password-group">
          <input
            :type="showPassword ? 'text' : 'password'"
            placeholder="Пароль"
            v-model="form.password"
          />
          <span class="toggle-password" @click="showPassword = !showPassword">
            <img
              :src="`/icons/${showPassword ? 'close-eye' : 'open-eye'}.svg`"
            />
          </span>
        </div>
        <div class="form-group password-group">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Пароль ещё раз"
            v-model="form.confirmPassword"
          />
          <span class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
            <img
              :src="`/icons/${showConfirmPassword ? 'close-eye' : 'open-eye'}.svg`"
            />
          </span>
        </div>

        <button class="btn-register" type="submit">Вход</button>
        <div class="login-wrapper">
          <span class="login auth">Создать новый аккаунт</span>
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
</style>
