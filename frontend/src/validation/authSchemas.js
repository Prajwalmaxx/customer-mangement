import * as yup from 'yup';

const passwordSchema = yup
  .string()
  .required('Password is required.')
  .min(8, 'Password must be at least 8 characters.')
  .matches(/[A-Za-z]/, 'Password must contain at least one letter.')
  .matches(/\d/, 'Password must contain at least one number.');

export const loginSchema = yup.object({
  email: yup.string().trim().required('Email is required.').email('Enter a valid email address.'),
  password: passwordSchema,
});

export const signupSchema = yup.object({
  name: yup.string().trim().required('Please enter your full name.'),
  email: yup.string().trim().required('Email is required.').email('Enter a valid email address.'),
  password: passwordSchema,
  confirmPassword: yup
    .string()
    .required('Please confirm your password.')
    .oneOf([yup.ref('password')], 'Passwords do not match.'),
});

export async function validateYup(schema, values) {
  try {
    await schema.validate(values, { abortEarly: false });
    return null;
  } catch (error) {
    return error.errors?.[0] ?? error.message;
  }
}
