import { signOut } from "@/auth"
import { redirect } from "next/navigation";

export function SignOutButton() {
  return (
    <form
        action={async () => {
        "use server"
        await signOut()
        redirect("/");
        }}
    >
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 cursor-pointer">Sign Out</button>
    </form>
  )
}
