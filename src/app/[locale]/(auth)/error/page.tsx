import React from "react";
import Card from "@/components/auth/Card";

const AuthErrorPage = () => {
  return (
    <div className="size-full flex items-center justify-center">
      <Card
        title="Něco se nepovelo"
        backLink1="/"
        backText1="Zpět na přihlášení"
      >
        <div className=""></div>
      </Card>
    </div>
  );
};

export default AuthErrorPage;
