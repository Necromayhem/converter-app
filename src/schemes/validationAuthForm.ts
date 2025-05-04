import * as yup from 'yup';
import { ObjectSchema } from 'yup';

interface formValues {
  email: string;
  password: string;
}

const schema: ObjectSchema<formValues> = yup.object({
  email: yup.string().email("Введите корректный email").required("Email обязателен"),
  password: yup.string()
    .min(6, "Пароль должен быть не менее 6 символов")
    .max(64, "Пароль не должен превышать 64 символа")
    .required("Пароль обязателен")
});

export default schema;