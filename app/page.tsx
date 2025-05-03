import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import { SignInButton } from "@/components/auth/SignInButton";

const LandingPage = async () => {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {}
      <main className="flex-grow flex justify-center items-center bg-gradient-to-r from-blue-500 to-indigo-500">
        <div className="text-center text-white p-6 md:p-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Track Your Finances, Effortlessly
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            Easily manage your income, expenses, and savings goals all in one place.
          </p>
        <SignInButton />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
