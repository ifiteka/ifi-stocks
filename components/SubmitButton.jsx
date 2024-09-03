import { useFormStatus } from "react-dom";

const SubmitButton = ({ text = "Submit", className, disabled, ...props }) => {
  const status = useFormStatus();

  return (
    <button
      {...props}
      disabled={status.pending || disabled}
      type="submit"
      className={`px-4 py-3 border border-neutral-400 rounded-lg ${className}`}
    >
      {text}
    </button>
  );
};

export default SubmitButton;
