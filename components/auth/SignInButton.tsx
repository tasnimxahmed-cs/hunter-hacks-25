import { signIn } from "@/auth"

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("github", { redirectTo: "/dashboard" })
      }}
      className="mx-auto w-fit"
    >
      <button
        type="submit"
        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
      >
        <GitHubIcon />
        Sign in with GitHub
      </button>
    </form>
  )
}

function GitHubIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M12 0C5.37 0 0 5.373 0 12a12.001 12.001 0 008.205 11.387c.6.111.82-.26.82-.577 0-.285-.01-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.334-1.756-1.334-1.756-1.09-.745.083-.73.083-.73 1.204.085 1.837 1.236 1.837 1.236 1.07 1.835 2.809 1.305 3.495.997.108-.775.42-1.305.762-1.605-2.665-.3-5.467-1.334-5.467-5.933 0-1.311.47-2.381 1.236-3.22-.124-.302-.535-1.515.117-3.157 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.004-.403 11.51 11.51 0 013.004.403c2.29-1.552 3.296-1.23 3.296-1.23.653 1.642.242 2.855.118 3.157.77.839 1.235 1.909 1.235 3.22 0 4.61-2.807 5.63-5.48 5.922.43.37.814 1.096.814 2.21 0 1.594-.015 2.878-.015 3.27 0 .32.217.694.825.576A12.003 12.003 0 0024 12c0-6.627-5.373-12-12-12z"
        clipRule="evenodd"
      />
    </svg>
  )
}
