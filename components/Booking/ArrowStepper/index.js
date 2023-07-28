import PropTypes from "prop-types";
import NextLink from "next/link";
import clsx from "clsx";
import _findIndex from "lodash/findIndex";

const ArrowStepper = ({ steps = [], activeStep, chooseStep }) => {
  const currentStep = _findIndex(steps, ["objectId", activeStep]);

  const renderStepLayout = (data) =>
    data.map((step, index) => (
      <div
        className={clsx("li", {
          "active-step": activeStep === step.objectId,
          "disable-step": index > currentStep,
        })}
        key={step.objectId}
      >
        {step.link ? (
          <NextLink href={step.link}>
            <a onClick={() => chooseStep(step.objectId)}>{step.label}</a>
          </NextLink>
        ) : (
          step.label
        )}
      </div>
    ));

  return <div className="arrow-stepper">{renderStepLayout(steps)}</div>;
};

ArrowStepper.propTypes = {
  steps: PropTypes.array.isRequired,
  activeStep: PropTypes.string.isRequired,
};
export default ArrowStepper;
