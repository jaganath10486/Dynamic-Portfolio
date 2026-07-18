import { memo } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>
}

export default memo(Button);
