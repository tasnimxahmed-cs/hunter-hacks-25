import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignInButton } from "@/components/auth/SignInButton";
import Image from "next/image";

const LandingPage = async () => {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="flex flex-col min-h-screen bg-[#ABC4FF] text-[#183476] relative">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-[#ABC4FF] z-10">
        <h1 className="text-4xl md:text-6xl font-bold">Waddle</h1>
        <nav className="flex items-center gap-6 text-sm md:text-base">
          <a href="#about" className="text-xl md:text-2xl hover:underline">About</a>
          <a href="#contact" className="text-xl md:text-2xl hover:underline">Contact</a>
          <SignInButton />
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow relative flex items-center justify-end px-6 md:px-12 py-12 bg-[#E2EAFC] text-[#183476] z-10">
        {/* Background image of penguin money */}
        <div className="absolute inset-0 z-0 bg-[url('/penguin-money.png')] bg-no-repeat bg-left bg-contain opacity-90" />

        {/* Text content on top */}
        <div className="relative z-10 max-w-xl text-right ml-auto space-y-6">
          <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Budgeting Made <br className="hidden md:block" />Cute and Easy
          </h2>
          <p className="text-md md:text-lg leading-relaxed">
            Easy to use budgeting app made with user friendliness in mind.<br />
            Just connect your GitHub and Bank to get started!
          </p>
          <div className="w-full text-right">
            <SignInButton className="ml-auto" />
          </div>
        </div>

        {/* Waving Penguin bottom right */}
        {/* <div className="absolute bottom-0 right-0 z-20">
          <Image
            src="/penguin-waving.png"
            alt="Waving penguin"
            width={160}
            height={160}
          />
        </div> */}
      </main>
    </div>
  );
};

export default LandingPage;
