/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lonely-if */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
import { useRef, useState, useEffect } from "react";

const BACKSPACE = 8;
const DELETE = 46;
const SPACEBAR = 32;

const isStyleObject = (obj) => typeof obj === "object";
const getClasses = (...classes) =>
  classes.filter((c) => !isStyleObject(c) && c !== false).join(" ");
const SingleOtpInput = (props) => {
  const {
    focus,
    shouldAutoFocus,
    placeholder,
    separator,
    isLastChild,
    inputStyle,
    isDisabled = true,
    hasErrored,
    errorStyle,
    focusStyle,
    disabledStyle,
    isInputNum,
    index,
    value,
    className = "",
    isInputSecure,
    isActive,
    ...rest
  } = props;
  const inputRef = useRef();
  useEffect(() => {
    if (inputRef?.current && focus && shouldAutoFocus) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (inputRef?.current && focus) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
    if (inputRef?.current && !focus) {
      inputRef.current?.blur();
    }
  }, [focus]);

  const getType = () => {
    const { isInputSecure, isInputNum } = props;

    if (isInputSecure) {
      return "password";
    }

    if (isInputNum) {
      return "tel";
    }

    return "text";
  };

  return (
    <div
      className={`${className} ${isActive ? "active-otp-input" : ""}`}
      style={{ display: "flex", alignItems: "center" }}
    >
      <input
        aria-label={`${index === 0 ? "Please enter verification code. " : ""}${
          isInputNum ? "Digit" : "Character"
        } ${index + 1}`}
        autoComplete="off"
        style={Object.assign(
          isStyleObject(inputStyle) && inputStyle,
          focus && isStyleObject(focusStyle) && focusStyle,
          isDisabled && isStyleObject(disabledStyle) && disabledStyle,
          hasErrored && isStyleObject(errorStyle) && errorStyle
        )}
        placeholder={placeholder}
        className={getClasses(
          inputStyle,
          focus && focusStyle,
          isDisabled && disabledStyle,
          hasErrored && errorStyle
        )}
        type={getType()}
        maxLength="1"
        ref={inputRef}
        disabled={isDisabled}
        value={value || ""}
        {...rest}
      />
      {!isLastChild && separator}
    </div>
  );
};

const OtpInput = (props) => {
  const [activeInput, setActiveInput] = useState(0);
  const {
    numInputs = 4,
    placeholder,
    onChange = (otp) => console.log(otp),
    isDisabled = false,
    shouldAutoFocus = false,
    value = "",
    inputStyle,
    focusStyle,
    separator,
    disabledStyle,
    hasErrored,
    errorStyle,
    isInputNum,
    className,
    isInputSecure = false,
    containerStyle,
  } = props;

  const getOtpValue = () => (value ? value.toString().split("") : []);

  const getPlaceholderValue = () => {
    if (typeof placeholder === "string") {
      if (placeholder.length === numInputs) {
        return placeholder;
      }
      if (placeholder.length > 0) {
        console.error(
          "Length of the placeholder should be equal to the number of inputs."
        );
      }
    }
  };
  const handleOtpChange = (otp) => {
    const otpValue = otp.join("");

    onChange(otpValue);
  };

  const isInputValueValid = (value) => {
    const isTypeValid = props.isInputNum
      ? !isNaN(parseInt(value, 10))
      : typeof value === "string";

    return isTypeValid && value.trim().length === 1;
  };

  // Focus on input by index
  const focusInput = (input) => {
    const activeInput = Math.max(Math.min(numInputs - 1, input), 0);

    setActiveInput(activeInput);
  };

  // Focus on next input
  const focusNextInput = () => {
    focusInput(activeInput + 1);
  };

  // Focus on previous input
  const focusPrevInput = () => {
    focusInput(activeInput - 1);
  };

  // Change OTP value at focused input
  const changeCodeAtFocus = (value) => {
    const otp = getOtpValue();
    otp[activeInput] = value[0];

    handleOtpChange(otp);
  };

  // Handle pasted OTP
  const handleOnPaste = (e) => {
    e.preventDefault();

    if (isDisabled) {
      return;
    }

    const otp = getOtpValue();
    let nextActiveInput = activeInput;

    // Get pastedData in an array of max size (num of inputs - current position)
    const pastedData = e.clipboardData
      .getData("text/plain")
      .slice(0, numInputs - activeInput)
      .split("");

    // Paste data from focused input onwards
    for (let pos = 0; pos < numInputs; ++pos) {
      if (pos >= activeInput && pastedData.length > 0) {
        otp[pos] = pastedData.shift();
        nextActiveInput++;
      }
    }

    setActiveInput(nextActiveInput);
    focusInput(nextActiveInput);
    handleOtpChange(otp);
  };

  const handleOnChange = (e) => {
    const { value } = e.target;

    if (isInputValueValid(value)) {
      changeCodeAtFocus(value);
    }
  };

  // Handle cases of backspace, delete, left arrow, right arrow, space
  const handleOnKeyDown = (e) => {
    if (e.keyCode === BACKSPACE || e.key === "Backspace") {
      e.preventDefault();
      changeCodeAtFocus("");
      focusPrevInput();
    } else if (e.keyCode === DELETE || e.key === "Delete") {
      e.preventDefault();
      changeCodeAtFocus("");
    } else if (
      e.keyCode === SPACEBAR ||
      e.key === " " ||
      e.key === "Spacebar" ||
      e.key === "Space"
    ) {
      e.preventDefault();
    }
  };

  // The content may not have changed, but some input took place hence change the focus
  const handleOnInput = (e) => {
    if (isInputValueValid(e.target.value)) {
      focusNextInput();
    } else {
      // This is a workaround for dealing with keyCode "229 Unidentified" on Android.

      if (!props.isInputNum) {
        const { nativeEvent } = e;

        if (
          nativeEvent.data === null &&
          nativeEvent.inputType === "deleteContentBackward"
        ) {
          e.preventDefault();
          changeCodeAtFocus("");
          focusPrevInput();
        }
      }
    }
  };

  const renderInputs = () => {
    const inputs = [];
    const otp = getOtpValue();
    const placeholder = getPlaceholderValue();
    const dataCy = props["data-cy"];
    const dataTestId = props["data-testid"];

    for (let i = 0; i < numInputs; i++) {
      inputs.push(
        <SingleOtpInput
          placeholder={placeholder && placeholder[i]}
          key={i}
          index={i}
          focus={otp.length < numInputs ? activeInput === i : false}
          value={otp && otp[i]}
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
          onInput={handleOnInput}
          onPaste={handleOnPaste}
          onFocus={(e) => {
            setActiveInput(i);
            e.target.select();
          }}
          separator={separator}
          inputStyle={inputStyle}
          focusStyle={focusStyle}
          isLastChild={i === numInputs - 1}
          disabled={i !== activeInput}
          isDisabled={isDisabled}
          disabledStyle={disabledStyle}
          hasErrored={hasErrored}
          errorStyle={errorStyle}
          shouldAutoFocus={shouldAutoFocus}
          isInputNum={isInputNum}
          isInputSecure={isInputSecure}
          isActive={i <= activeInput}
          className={className}
          data-cy={dataCy && `${dataCy}-${i}`}
          data-testid={dataTestId && `${dataTestId}-${i}`}
        />
      );
    }

    return inputs;
  };

  return (
    <div
      style={{ ...(isStyleObject(containerStyle) && containerStyle) }}
      className={!isStyleObject(containerStyle) ? containerStyle : ""}
    >
      {renderInputs()}
    </div>
  );
};

export default OtpInput;
