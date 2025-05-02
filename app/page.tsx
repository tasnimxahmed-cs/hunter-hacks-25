"use client";

import React from "react";
import { signIn } from "next-auth/react";

const LandingPage = () => {
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
          <button
            className="bg-white text-blue-500 px-8 py-3 rounded-full font-semibold text-lg"
            onClick={() => signIn("github")}
          >
            Sign in with GitHub
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
