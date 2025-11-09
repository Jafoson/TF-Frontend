import React, { useRef, useState } from "react";
import styles from "./TextInput.module.scss";
import EyeIcon from "@/assets/icons/EyeIcon";
import IconButton from "@/components/atoms/IconButton/IconButton";
import EyeClosedIcon from "@/assets/icons/EyeCloseIcon";
import CloseIcon from "@/assets/icons/CloseIcon";

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  placeholder: string;
  value: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  error?: boolean;
  errorMessage?: string | string[];
  helperText?: string | string[];
};

export default function TextInput({
  label,
  placeholder,
  value,
  icon: Icon,
  error,
  errorMessage,
  helperText,
  ...props
}: TextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { type, ...restProps } = props;
  const isPassword = type === "password";
  return (
    <div data-error={error} className={styles.container}>
      {label && <label htmlFor={props.id}>{label}</label>}
      <div
        className={styles.inputContainer}
        onClick={() => inputRef.current?.focus()}
        data-error={error}
      >
        {Icon && <Icon height={24} width={24} />}
        <input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          type={isPassword ? (showPassword ? "text" : "password") : "text"}
          {...restProps}
        />
        {isPassword && (
          <IconButton
            className={styles.icon}
            iconSize={16}
            iconColor={
              error
                ? "rgb(var(--on-error-container))"
                : "rgb(var(--on-surface-variant))"
            }
            icon={showPassword ? EyeIcon : EyeClosedIcon}
            variant="text"
            type="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              setShowPassword((v) => !v);
            }}
          />
        )}
        {!isPassword && (
          <IconButton
            className={styles.icon}
            iconSize={16}
            iconColor={
              error
                ? "rgb(var(--on-error-container))"
                : "rgb(var(--on-surface-variant))"
            }
            icon={CloseIcon}
            variant="text"
            type="button"
            tabIndex={-1}
            style={{ 
              visibility: value && value.length > 0 ? 'visible' : 'hidden',
              opacity: value && value.length > 0 ? 1 : 0
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (props.onChange) {
                props.onChange({
                  target: { value: "" },
                } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
          />
        )}
      </div>
      {error &&
        errorMessage &&
        (Array.isArray(errorMessage) ? (
          errorMessage.length > 0 && (
            <ul className={styles.error}>
              {errorMessage.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )
        ) : (
          <div className={styles.error}>{errorMessage}</div>
        ))}
      {!error &&
        helperText &&
        (Array.isArray(helperText) ? (
          helperText.length > 0 && (
            <ul className={styles.helperText}>
              {helperText.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          )
        ) : (
          <div className={styles.helperText}>{helperText}</div>
        ))}
    </div>
  );
}
