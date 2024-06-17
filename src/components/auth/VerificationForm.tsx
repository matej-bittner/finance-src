"use client";
import React, { useCallback, useEffect, useState } from "react";
import Card from "@/components/auth/Card";

import CardError from "@/components/auth/CardError";

import CardSuccess from "@/components/auth/CardSuccess";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import newVerification from "@/actions/new-verification";

const VerificationForm = () => {
  const t = useTranslations("login-form");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Něco se nepovedlo.");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Něco se nepovedlo");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <section className="size-full flex items-center justify-center">
      <Card
        title="Potvrzování Emailu"
        backLink1="/"
        backText1="zpět na přihlášení"
      >
        <div className="flex items-center w-full justify-center">
          {!success && !error && <BeatLoader />}
          <CardSuccess message={success} />
          <CardError message={error} />
        </div>
      </Card>
    </section>
  );
};

export default VerificationForm;
