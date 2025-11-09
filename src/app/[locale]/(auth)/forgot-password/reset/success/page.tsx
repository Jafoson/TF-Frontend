"use client";

import React from "react";
import styles from "./page.module.scss";
import Button from "@/components/atoms/Button/Button";
import AuthTopBar from "@/components/layout/Topbar/AuthTopBar/AuthTopBar";
import ScrollContainer from "@/components/utils/ScrollContainer/ScrollContainer";
import { SuccessIcon } from "@/assets/icons";

export default function ConfirmMailSuccessPage() {
  return (
    <>
      <AuthTopBar />
      <ScrollContainer>
        <h4 className={styles.title}>Passwort erfolgreich geändert</h4>
        <SuccessIcon className={styles.successIcon} height={128} width={128} />
        <p className={styles.description}>
          Sie können sich jetzt mit Ihrem neuen Passwort anmelden.
        </p>
        <div className={styles.formContainer}>
          <Button
            title="Zum Login"
            variant="filled"
            fullWidth
            className={styles.continueButton}
          />
        </div>
      </ScrollContainer>
    </>
  );
}

// TODO: Add translation
