import React from "react";
import { Button } from "primereact/button";
import { getProviders, signIn } from "next-auth/react";

export async function getServerSideProps(context: any) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default function Login({ providers }: any) {
  return (
    <div>
      <Button
        onClick={() => signIn(providers.google.id, { callbackUrl: "/" })}
        label={`Sign In with ${providers.google.name}`}
        icon="pi pi-google"
      />
    </div>
  );
}
