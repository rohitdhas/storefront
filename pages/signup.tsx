import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useState } from "react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function signup() {
    if (!name || !email || !password) return;
    setIsLoading(true);

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullName: name, email, password }),
    });

    const data = await response.json();
    setIsLoading(false);
    console.log(data);
  }

  return (
    <div className="h-screen flex justify-center align items-center">
      <form
        onSubmit={signup}
        className="bg-gray-100 rounded-md p-4 w-[400px] bg-opacity-80"
      >
        <div className="text-xl font-bold text-center my-2 text-slate-800">
          Create an Account!
        </div>
        <span className="p-float-label my-7">
          <InputText
            id="name"
            value={name}
            className="w-full"
            required
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="name">Full Name</label>
        </span>
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
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="pass">Password</label>
        </span>
        <Button
          onClick={signup}
          className="w-full mb-4"
          label="Sign Up"
          loading={isLoading}
        />
        <p className="text-center text-slate-700 text-sm my-2">
          Already have an account?{" "}
          <a
            href="/login"
            className="underline text-blue-700 hover:no-underline hover:text-blue-800"
          >
            Login here!
          </a>{" "}
        </p>
      </form>
    </div>
  );
}
