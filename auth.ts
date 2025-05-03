import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { prisma } from "@/lib/prisma" // Ensure correct path to prisma

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    // SignIn callback: Creates or updates the user
    async signIn({ user }) {
      // Create or update user based on email (upsert)
      const dbUser = await prisma.user.upsert({
        where: { email: user.email! },
        update: {
          // Here, you can update the user's data if needed
          name: user.name ?? undefined,
        },
        create: {
          email: user.email!,
          name: user.name!,
        },
      })

      // On successful sign-in, return true (otherwise, access will be denied)
      return true
    },

    // JWT callback: Adds user id to JWT token
    async jwt({ token, user }) {
      // Only attach the dbUser.id once during the first sign-in
      if (user) {
        // Find the user by email
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })
        
        // If the user is found, attach the id to the token
        if (dbUser) {
          token.id = dbUser.id
        }
      }
      
      return token
    },

    // Session callback: Attach user id to session
    async session({ session, token }) {
      // If the token contains the id, add it to the session user object
      if (token?.id) {
        session.user.id = token.id as string
      }

      return session
    },
  },
})
