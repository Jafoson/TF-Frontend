"use client";

import React, { useState, useTransition } from "react";
import styles from "./page.module.scss";
import TextInput from "@/components/atoms/inputs/TextInput/TextInput";
import Checkbox from "@/components/atoms/inputs/Checkbox/Checkbox";
import { Link } from "@/i18n/navigation";
import Button from "@/components/atoms/Button/Button";
import { AppleLogoIcon, GoogleLogoIcon, LockIcon } from "@/assets/icons";
import AuthTopBar from "@/components/layout/Topbar/AuthTopBar/AuthTopBar";
import ScrollContainer from "@/components/utils/ScrollContainer/ScrollContainer";
import { useTranslations } from "next-intl";
import MailIcon from "@/assets/icons/MailIcon";
import { loginUser, loginWithGoogle, loginWithApple } from "@/actions/auth";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "@/i18n/navigation";

export default function LoginPage() {
  const t = useTranslations("login");
  const { showSuccess, showError } = useNotification();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<boolean>(false);
  const [data, setData] = useState({
    remember: {
      value: false,
      title: t("rememberMe"),
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usernameOrEmail || !password) {
      showError(t("error"), t("fillAllFields"));
      return;
    }

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("usernameOrEmail", usernameOrEmail);
        formData.append("password", password);

        const result = await loginUser(formData);

        if (result.success) {
          showSuccess(t("success"), t("loginSuccessful"));
          router.push("/"); // Zur Hauptseite weiterleiten
        } else {
          setError(true);
          showError(
            t(result.code || "LOGIN_ERROR"),
            t(result.code + "_DESCRIPTION" || "LOGIN_ERROR_DESCRIPTION")
          );
        }
      } catch (error) {
        console.error("Login error:", error);
        setError(true);
        showError(t("error"), t("unexpectedError"));
      }
    });
  };

  return (
    <>
      <AuthTopBar />
      <ScrollContainer>
        <h4 className={styles.title}>{t("title")}</h4>
        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <TextInput
              type="email"
              label={t("mail")}
              placeholder={t("mailPlaceholder")}
              value={usernameOrEmail}
              onChange={(value) => {
                setUsernameOrEmail(
                  typeof value === "string" ? value : value.target.value
                );
                setError(false);
              }}
              icon={MailIcon}
              error={error}
            />
            <TextInput
              type="password"
              label={t("password")}
              placeholder={t("passwordPlaceholder")}
              value={password}
              onChange={(value) => {
                setPassword(
                  typeof value === "string" ? value : value.target.value
                );
                setError(false);
              }}
              icon={LockIcon}
              error={error}
            />
            <div className={styles.checkboxContainer}>
              <Checkbox data={data} onChange={setData} />
              <Link className={styles.forgotPassword} href="/forgot-password">
                {t("forgotPassword")}
              </Link>
            </div>
            <Button
              title={t("login")}
              variant="filled"
              fullWidth
              disabled={!usernameOrEmail || !password || isPending}
              loading={isPending}
              {...({
                type: "submit",
              } as React.ButtonHTMLAttributes<HTMLButtonElement>)}
            />
          </form>
        </div>
        <div className={styles.orContainer}>
          <hr />
          <h6>{t("or")}</h6>
          <hr />
        </div>
        <div className={styles.socialContainer}>
          <Button
            title={t("loginWithGoogle")}
            variant="outlined"
            icon={GoogleLogoIcon}
            onClick={() => loginWithGoogle()}
          />
          <Button
            title={t("loginWithApple")}
            variant="outlined"
            icon={AppleLogoIcon}
            onClick={() => loginWithApple()}
          />
        </div>
        <div className={styles.footer}>
          <span>
            {t("dontHaveAccount")} <Link href="/register">{t("register")}</Link>
          </span>
        </div>
      </ScrollContainer>
    </>
  );
}
