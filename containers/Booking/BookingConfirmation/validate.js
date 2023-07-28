import { object, string } from "yup";
import { VALIDATION_TEXT, REGEX } from "utils/constants";

const validationSchema = object().shape({
  fullName: string().trim().required(VALIDATION_TEXT.REQUIRED),
  phone: string().required(VALIDATION_TEXT.REQUIRED),
  furigana: string()
    .trim()
    .required(VALIDATION_TEXT.REQUIRED)
    .matches(REGEX.HIRAGANA, VALIDATION_TEXT.HIRAGANA_FORMAT),
});

export default validationSchema;
