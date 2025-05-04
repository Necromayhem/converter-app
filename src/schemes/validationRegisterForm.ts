import * as yup from 'yup';
import { ObjectSchema } from 'yup';

interface formValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const schema: ObjectSchema<formValues> = yup.object({
  name: yup.string().required("Пожалуйста, введите ваше имя"),
  email: yup.string().email("Введите корректный email").required("Email обязателен"),
  password: yup.string()
    .min(6, "Пароль должен быть не менее 6 символов")
    .max(64, "Пароль не должен превышать 64 символа")
    .required("Пароль обязателен"),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password")], "Пароли не совпадают")
    .required("Подтвердите пароль"),
});

export default schema;