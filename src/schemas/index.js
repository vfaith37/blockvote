import * as yup from "yup";

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
// min 5 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

const SUPPORTED_FORMATS = {
  image: ["jpg", "gif", "png", "jpeg", "svg", "webp"],
};

export const signUpSchema = yup.object().shape({
  firstname: yup
    .string()
    .trim()
    .min(3, "Invalid Name")
    .required("First Name required!"),
  lastname: yup
    .string()
    .trim()
    .min(3, "Invalid Name")
    .required("Last Name required!"),
  name: yup
    .string()
    .trim()
    .min(3, "Invalid Organization")
    .required("Organization required!"),
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup
    .string()
    .min(5)
    .matches(passwordRules, { message: "Please create a stronger password" })
    .required("Required"),
  confirmpassword: yup
    .string()
    .equals([yup.ref("password"), null], "Password doesn't match 1"),
  acceptedTos: yup
    .boolean()
    .oneOf([true], "Please accept the terms of service"),
});

export const otpSchema = yup.object().shape({
  otp1: yup.number("Must be an Integer").required("Required"),
  otp2: yup.number("Must be an Integer").required("Required"),
  otp3: yup.number("Must be an Integer").required("Required"),
  otp4: yup.number("Must be an Integer").required("Required"),
  otp5: yup.number("Must be an Integer").required("Required"),
});

export const signInSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup
    .string()
    .min(5)
    //   .matches(passwordRules, { message: "Please create a stronger password" })
    .required("Required"),
});

export const candidateSchema = yup.object().shape({
  firstname: yup
    .string()
    .trim()
    .min(3, "Invalid Name")
    .required("First Name required!"),
  lastname: yup
    .string()
    .trim()
    .min(3, "Invalid Name")
    .required("Last Name required!"),
  position: yup
    .string()
    .trim()
    .min(3, "Mininimum of 3 characters")
    .required("Position required!"),
  photo: yup
    .mixed()
    .nullable()
    .required("Required")
    .test(
      "FILE_SIZE",
      "Uploaded file too big.",
      (value) => !value || (value && value.size <= 1024 * 1024)
    )
    .test(
      "is-valid-size",
      "Max allowed size is 100KB",
      (value) =>
        // value && value.size <= MAX_FILE_SIZE
        (value) =>
          !value || (value && SUPPORTED_FORMATS.includes(value?.type))
    ),
});

export const electionSchema = yup.object().shape({
  electionname: yup
    .string()
    .trim()
    .min(3, "Invalid Name")
    .required("First Name required!"),
  electiontype: yup
    .string()
    .trim()
    .min(3, "Invalid Type")
    .required("Election Type required!"),
  description: yup
    .string()
    .trim()
    .min(3, "Mininimum of 3 characters")
    .required("Description required!"),
});
