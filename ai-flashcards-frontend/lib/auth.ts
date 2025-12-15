import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

// Validate required environment variables
const requiredEnvVars = {
  KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
  KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0 && process.env.NODE_ENV !== "test") {
  console.error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      // Initial sign in - store tokens
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at;
      }

      // Check if token is expired and refresh if needed
      if (token.expiresAt && Date.now() >= (token.expiresAt as number) * 1000) {
        try {
          // Attempt to refresh the token
          if (token.refreshToken) {
            const response = await fetch(
              `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                  grant_type: "refresh_token",
                  refresh_token: token.refreshToken as string,
                  client_id: process.env.KEYCLOAK_CLIENT_ID!,
                  client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
                }),
              }
            );

            if (response.ok) {
              const refreshedTokens = await response.json();
              token.accessToken = refreshedTokens.access_token;
              token.refreshToken =
                refreshedTokens.refresh_token || token.refreshToken;
              token.idToken = refreshedTokens.id_token || token.idToken;
              token.expiresAt =
                Math.floor(Date.now() / 1000) + refreshedTokens.expires_in;
            } else {
              // Refresh failed, clear tokens
              token.accessToken = undefined;
              token.refreshToken = undefined;
              token.idToken = undefined;
            }
          }
        } catch (error) {
          console.error("Token refresh error:", error);
          // Clear tokens on error
          token.accessToken = undefined;
          token.refreshToken = undefined;
          token.idToken = undefined;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Include tokens in session
      if (token) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.idToken = token.idToken as string;
        session.expiresAt = token.expiresAt as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
  },
  debug: process.env.DEBUG_AUTH === "true",
  events: {
    async signIn({ user, account }) {
      if (process.env.DEBUG_AUTH === "true") {
        console.log("User signed in:", user.email);
      }
    },
    async signOut() {
      if (process.env.DEBUG_AUTH === "true") {
        console.log("User signed out");
      }
    },
  },
});
