"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { useRouter } from "@/i18n/navigation";
import Button from "@/components/atoms/Button/Button";
import AuthTopBar from "@/components/layout/Topbar/AuthTopBar/AuthTopBar";
import ScrollContainer from "@/components/utils/ScrollContainer/ScrollContainer";
import { useTranslations } from "next-intl";
import CodeInput from "@/components/atoms/inputs/CodeInput/CodeInput";
import { useNotification } from "@/context/NotificationContext";
import { verifyCode, resendVerificationEmail } from "@/actions/auth";

export default function ConfirmMailPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const t = useTranslations("confirmMail");
  const { showError, showSuccess } = useNotification();

  useEffect(() => {
    // E-Mail aus localStorage laden
    const storedEmail = localStorage.getItem("email");
    console.log(storedEmail);
    if (storedEmail) {
      setEmail(storedEmail);
    }

    // Countdown für Resend Button starten
    const interval = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (code.length !== 6) {
      showError(t("INVALID_CODE"), t("INVALID_CODE_DESCRIPTION"));
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("code", code);

      const result = await verifyCode(formData);

      if (!result.success) {
        showError(
          t(result.code || "VERIFICATION_ERROR"),
          t(result.code + "_DESCRIPTION" || "VERIFICATION_ERROR_DESCRIPTION")
        );
        return;
      }
      router.push("/verify/success");
    } catch (err) {
      console.error(err);
      showError(
        "INTERNAL_SERVER_ERROR",
        t("INTERNAL_SERVER_ERROR_DESCRIPTION")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!canResend || !email) return;

    console.log("Resend E-Mail wird gesendet für:", email);
    setIsResendLoading(true);
    setCanResend(false);
    setResendCountdown(30);

    try {
      const formData = new FormData();
      formData.append("email", email);
      console.log("FormData erstellt mit E-Mail:", formData.get("email"));

      const result = await resendVerificationEmail(formData);

      if (!result.success) {
        showError(
          t(result.code || "RESEND_ERROR"),
          t(result.code + "_DESCRIPTION" || "RESEND_ERROR_DESCRIPTION")
        );
        setCanResend(true);
        setResendCountdown(0);
        return;
      }

      showSuccess(t("RESEND_SUCCESS"), t("RESEND_SUCCESS_DESCRIPTION"));

      // Neuen Countdown starten
      const interval = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      showError(
        "INTERNAL_SERVER_ERROR",
        t("INTERNAL_SERVER_ERROR_DESCRIPTION")
      );
      setCanResend(true);
      setResendCountdown(0);
    } finally {
      setIsResendLoading(false);
    }
  };

  const getResendButtonTitle = () => {
    if (canResend) {
      return t("resendEmail");
    }
    return `${t("resendEmail")} (${resendCountdown}s)`;
  };

  return (
    <>
      <AuthTopBar
        hasBackButton
        backButtonOnClick={() => router.push("/register")}
      />
      <ScrollContainer>
        <h4 className={styles.title}>{t("title")}</h4>
        <p className={styles.subtitle}>{t("subtitle")}</p>
        <p className={styles.description}>{t("description", { email })}</p>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleVerify}>
            <CodeInput length={6} value={code} onChange={setCode} />
            <Button
              title={t("continue")}
              variant="filled"
              fullWidth
              className={styles.continueButton}
              disabled={code.length !== 6}
              loading={isLoading}
            />
          </form>
          <Button
            title={getResendButtonTitle()}
            variant="text"
            fullWidth
            className={styles.resendEmailButton}
            disabled={!canResend}
            loading={isResendLoading}
            onClick={handleResendEmail}
          />
        </div>
      </ScrollContainer>
    </>
  );
}
