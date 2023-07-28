import { object, string } from "yup";
import valid from "card-validator";
import { VALIDATION_TEXT } from "utils/constants";

const validationSchema = object().shape({
  cardNumber: string()
    .required(VALIDATION_TEXT.REQUIRED)
    .test(
      "isValidCard",
      VALIDATION_TEXT.INVALID_CARD_NUMBER,
      (value) => valid.number(value).isValid
    ),
  "cc-exp-month": string().required(VALIDATION_TEXT.REQUIRED),
  "cc-exp-year": string()
    .required(VALIDATION_TEXT.REQUIRED)
    .when("cc-exp-month", (expiredMonth) =>
      string()
        .required(VALIDATION_TEXT.REQUIRED)
        .test(
          "isValidExpire",
          VALIDATION_TEXT.INVALID_EXPIRATION_YEAR,
          (expiredYear) => {
            if (expiredYear && expiredMonth) {
              return valid.expirationDate(`${expiredMonth}/${expiredYear}`, 20)
                .isValid;
            }
            return true;
          }
        )
    ),
  "cc-csc": string()
    .required(VALIDATION_TEXT.REQUIRED)
    .min(3, VALIDATION_TEXT.INVALID_CVC),
});

export default validationSchema;
