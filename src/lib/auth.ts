import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth/next";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { pbkdf2Sync } from "crypto";

// Dynamic URL detection for production compatibility
const getBaseUrl = () => {
  // For production, always use the production domain
  if (process.env.NODE_ENV === "production") {
    return "https://zumenzu.com";
  }

  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        usernameOrEmail: {
          label: "Username or Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.usernameOrEmail || !credentials?.password) {
          return null;
        }

        // Find user by username or email
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: credentials.usernameOrEmail },
              { email: credentials.usernameOrEmail },
            ],
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Check password - support both bcrypt and crypto hashing
        let isPasswordValid = false;

        if (user.passwordHash.includes(":")) {
          // Node.js crypto format: hash:salt
          const [hash, salt] = user.passwordHash.split(":");
          const computedHash = pbkdf2Sync(
            credentials.password,
            salt,
            1000,
            64,
            "sha512"
          ).toString("hex");
          isPasswordValid = computedHash === hash;
        } else {
          // bcrypt format
          isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
        }

        if (!isPasswordValid || !user.isActive) {
          return null;
        }

        // Update login streak and last login date
        const now = new Date();
        const lastLogin = user.lastLoginDate;
        let newLoginStreak = user.loginStreak;

        if (lastLogin) {
          const daysDiff = Math.floor(
            (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (daysDiff === 1) {
            newLoginStreak += 1;
          } else if (daysDiff > 1) {
            newLoginStreak = 1;
          }
        } else {
          newLoginStreak = 1;
        }

        const newMaxStreak = Math.max(user.maxLoginStreak, newLoginStreak);

        // Update user login data
        await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginDate: now,
            loginStreak: newLoginStreak,
            maxLoginStreak: newMaxStreak,
          },
        });

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          level: user.level,
          experience: user.experience,
          currentDiamonds: user.currentDiamonds,
          totalDiamonds: user.totalDiamonds,
          loginStreak: newLoginStreak,
          maxLoginStreak: newMaxStreak,
          isPremium: user.isPremium,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user already exists with this email
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            include: { accounts: true },
          });

          if (existingUser) {
            // Check if this Google account is already linked
            const googleAccount = existingUser.accounts.find(
              (acc) =>
                acc.provider === "google" &&
                acc.providerAccountId === account.providerAccountId
            );

            if (!googleAccount) {
              // Link the Google account to existing user
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token,
                  access_token: account.access_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state,
                },
              });
            }
            return true;
          } else {
            // Create new user manually to ensure it works
            const username = user.email!.split("@")[0];

            // Ensure username is unique
            let finalUsername = username;
            let counter = 1;
            while (
              await prisma.user.findUnique({
                where: { username: finalUsername },
              })
            ) {
              finalUsername = `${username}_${counter}`;
              counter++;
            }

            // Create new user
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                username: finalUsername,
                currentDiamonds: 100,
                totalDiamonds: 100,
                loginStreak: 1,
                maxLoginStreak: 1,
                lastLoginDate: new Date(),
                isActive: true,
                role: "user",
                level: 1,
                experience: 0,
                isPremium: false,
              },
            });

            // Create account record
            await prisma.account.create({
              data: {
                userId: newUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                refresh_token: account.refresh_token,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            });

            return true;
          }
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, user }) {
      console.log("🔄 Session callback called (database strategy)");
      console.log("📧 Session email:", session.user?.email);
      console.log("👤 User from DB:", JSON.stringify(user, null, 2));

      if (session.user?.email) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
              id: true,
              username: true,
              email: true,
              role: true,
              level: true,
              experience: true,
              currentDiamonds: true,
              totalDiamonds: true,
              loginStreak: true,
              maxLoginStreak: true,
              isPremium: true,
              isActive: true,
            },
          });

          if (dbUser) {
            session.user = {
              ...session.user,
              id: dbUser.id,
              username: dbUser.username,
              role: dbUser.role,
              level: dbUser.level,
              experience: dbUser.experience,
              currentDiamonds: dbUser.currentDiamonds,
              totalDiamonds: dbUser.totalDiamonds,
              loginStreak: dbUser.loginStreak,
              maxLoginStreak: dbUser.maxLoginStreak,
              isPremium: dbUser.isPremium,
            };
          }
        } catch (error) {
          console.error("Error in session callback:", error);
        }
      }

      console.log(
        "✅ Final session user:",
        JSON.stringify(session.user, null, 2)
      );
      return session;
    },
  },
  session: {
    strategy: "database",
    maxAge: 7 * 24 * 60 * 60, // 7 days for better security
    updateAge: 24 * 60 * 60, // Update session every 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // Remove domain restriction for localhost development
        domain:
          process.env.NODE_ENV === "production" ? ".zumenzu.com" : undefined,
        maxAge: 7 * 24 * 60 * 60, // 7 days
      },
    },
    callbackUrl: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.callback-url"
          : "next-auth.callback-url",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain:
          process.env.NODE_ENV === "production" ? ".zumenzu.com" : undefined,
      },
    },
    csrfToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Host-next-auth.csrf-token"
          : "next-auth.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  debug: process.env.NODE_ENV === "development",
  events: {
    async createUser({ user }) {
      // When a new user is created via Google OAuth
      if (user.email && !user.username) {
        const username = user.email.split("@")[0];

        // Ensure username is unique
        let finalUsername = username;
        let counter = 1;
        while (
          await prisma.user.findUnique({ where: { username: finalUsername } })
        ) {
          finalUsername = `${username}_${counter}`;
          counter++;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            username: finalUsername,
            currentDiamonds: 100, // Starting diamonds
            totalDiamonds: 100,
            loginStreak: 1,
            maxLoginStreak: 1,
            lastLoginDate: new Date(),
          },
        });
      }
    },
  },
};

// Helper function for API route authentication (backward compatibility)
export async function verifyAuth(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return {
        success: false,
        error: "Not authenticated",
        user: null,
      };
    }

    return {
      success: true,
      user: {
        id: session.user.id,
        username: session.user.username,
        email: session.user.email,
        role: session.user.role,
        level: session.user.level,
        experience: session.user.experience,
        currentDiamonds: session.user.currentDiamonds,
        totalDiamonds: session.user.totalDiamonds,
        loginStreak: session.user.loginStreak,
        maxLoginStreak: session.user.maxLoginStreak,
        isPremium: session.user.isPremium,
      },
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    return {
      success: false,
      error: "Authentication failed",
      user: null,
    };
  }
}
