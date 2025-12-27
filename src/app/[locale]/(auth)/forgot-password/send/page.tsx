"use client";

import React from "react";
import styles from "./page.module.scss";
import { useRouter } from "@/i18n/navigation";
import Button from "@/components/atoms/Button/Button";
import AuthTopBar from "@/components/layout/Topbar/AuthTopBar/AuthTopBar";
import ScrollContainer from "@/components/utils/ScrollContainer/ScrollContainer";
import { useTranslations } from "next-intl";
import { SendMailIcon } from "@/assets/icons";

export default function ForgotPasswordMailSendPage() {
  const router = useRouter();
  const t = useTranslations("forgotPasswordMailSend");
  return (
    <>
      <AuthTopBar />
      <ScrollContainer>
        <h4 className={styles.title}>{t("title")}</h4>
        <SendMailIcon className={styles.successIcon} height={128} width={128} />
        <p className={styles.subtitle}>{t("subtitle")}</p>
        <p className={styles.description}>{t("description")}</p>
        <div className={styles.formContainer}>
          <Button
            title={t("continue")}
            variant="filled"
            fullWidth
            className={styles.continueButton}
            onClick={() => router.push("/login")}
          />
          <Button
            title={t("resendEmail")}
            variant="text"
            fullWidth
            className={styles.resendEmailButton}
            onClick={() => router.push("/forgot-password")}
          />
        </div>
      </ScrollContainer>
    </>
  );
}
