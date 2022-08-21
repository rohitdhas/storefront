/* eslint-disable @next/next/no-html-link-for-pages */
import { getProviders, signIn } from "next-auth/react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";

export async function getServerSideProps(context: any) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default function Login({ providers }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast: any = useRef<Toast>();

  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) return;
    setIsLoading(true);

    signIn(providers.credentials.id, { redirect: false, email, password }).then(
      ({ ok, error }: any) => {
        setIsLoading(false);
        if (ok) {
          router.push("/");
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: error,
          });
        }
      }
    );
  };

  return (
    <div className="h-screen flex justify-center align items-center">
      <Toast ref={toast} />
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 rounded-md p-4 w-[400px] bg-opacity-80"
      >
        <div className="text-xl font-bold text-center my-2 text-slate-800">
          Sign In to Topstore!
        </div>
        <span className="p-float-label my-7">
          <InputText
            id="email"
            value={email}
            className="w-full"
            type={"email"}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email">Email</label>
        </span>
        <span className="p-float-label my-7">
          <Password
            id="pass"
            value={password}
            required
            toggleMask
            feedback={false}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="pass">Password</label>
        </span>
        <Button
          onClick={handleSubmit}
          className="w-full mb-4"
          label="Sign In"
          loading={isLoading}
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            signIn(providers.google.id, { callbackUrl: "/" });
          }}
          label={`Sign In with ${providers.google.name}`}
          icon="pi pi-google"
          className="w-full mb-4 p-button-outlined p-button-secondary"
        />
        <p className="text-center text-slate-700 text-sm my-2">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="underline text-blue-700 hover:no-underline hover:text-blue-800"
          >
            Create Here!
          </a>{" "}
        </p>
      </form>
    </div>
  );
}
