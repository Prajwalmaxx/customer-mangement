import * as yup from 'yup';

export const customerSchema = yup.object({
  cno: yup
    .number()
    .typeError('Customer number is required.')
    .required('Customer number is required.')
    .integer('Customer number must be a whole number.')
    .positive('Customer number must be greater than zero.')
    .max(Number.MAX_SAFE_INTEGER, 'Customer number is too large.'),
  cname: yup.string().trim().required('Customer name is required.'),
  billAmt: yup.number().typeError('Bill amount is required.').required('Bill amount is required.'),
  favColor: yup.string().trim().required('Favorite colors are required.'),
  studies: yup.string().trim().required('Studies are required.'),
  phoneNumbers: yup
    .string()
    .trim()
    .required('Phone numbers are required.')
    .matches(/^[\d,\s-]+$/, 'Phone numbers must contain digits only.'),
  idDetails: yup
    .string()
    .trim()
    .required('ID details are required.')
    .matches(/.+:.+/, 'Use format: aadhar: 123456789012, panNo: ABCDE1234F'),
  companyName: yup.string().trim().required('Company name is required.'),
  companyAddrs: yup.string().trim().required('Company address is required.'),
  companyType: yup.string().trim().required('Company type is required.'),
  companySize: yup.number().typeError('Company size is required.').required('Company size is required.'),
});

export async function validateYup(schema, values) {
  try {
    await schema.validate(values, { abortEarly: false });
    return null;
  } catch (error) {
    return error.errors?.[0] ?? error.message;
  }
}
