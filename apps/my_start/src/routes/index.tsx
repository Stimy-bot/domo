// apps/my_start/src/routes/index.tsx
import { Spinner } from "@domo/reusableComponents";
import { UiButton } from "@domo/ui-buttons";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { signIn, useSession } from "../lib/auth-client";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { data: session } = useSession();

  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "linkedin" | "github" | null
  >(null);

  const isPending = loadingProvider !== null;

  const handleSocialSignIn = async (
    provider: "google" | "linkedin" | "github",
  ) => {
    if (isPending) return;

    try {
      setLoadingProvider(provider);
      await signIn.social({ provider });
    } catch (error) {
      console.error(`Sign in with ${provider} failed:`, error);
      setLoadingProvider(null);
    }
  };

  return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-4">
      <main className="island-shell rise-in flex flex-col items-center justify-center max-w-200 min-h-[60vh] px-4 text-center rounded-lg">
      <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
      <h1 className="text-4xl font-semibold pt-5 mb-6">WELCOME ALL</h1>

      <section className="island-shell border rounded-md px-6 py-4">
        <div className="p-5 flex flex-col items-center gap-3">
          {session && <Link to="/dashboard">Dashboard</Link>}

          {!session && (
            <>
              {/* Google Sign In */}
              <UiButton
                type="button"
                disabled={isPending}
                onClick={() => handleSocialSignIn("google")}
                className={`w-full h-9 px-4 text-sm font-medium bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2 rounded-md ${
                  isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loadingProvider === "google" ? (
                  <Spinner />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <title>Google Logo</title>
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>
                  {loadingProvider === "google"
                    ? "Signing in..."
                    : "Sign in with Google"}
                </span>
              </UiButton>

              {/* LinkedIn Sign In */}
              <UiButton
                type="button"
                disabled={isPending}
                onClick={() => handleSocialSignIn("linkedin")}
                className={`w-full h-9 px-4 text-sm font-medium bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors inline-flex items-center justify-center gap-2 rounded-md ${
                  isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loadingProvider === "linkedin" ? (
                  <Spinner />
                ) : (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <title>LinkedIn Logo</title>
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                )}
                <span>
                  {loadingProvider === "linkedin"
                    ? "Signing in..."
                    : "Sign in with LinkedIn"}
                </span>
              </UiButton>

              {/* GitHub Sign In */}
              <UiButton
                type="button"
                disabled={isPending}
                onClick={() => handleSocialSignIn("github")}
                className={`w-full h-9 px-4 text-sm font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors inline-flex items-center justify-center gap-2 rounded-md ${
                  isPending ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loadingProvider === "github" ? (
                  <Spinner />
                ) : (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <title>GitHub Logo</title>
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                )}
                <span>
                  {loadingProvider === "github"
                    ? "Signing in..."
                    : "Sign in with GitHub"}
                </span>
              </UiButton>
            </>
          )}
        </div>

        {session && (
          <p className="text-center text-xs text-neutral-500 pb-2">
            Client Signed in as {session.user.name}
          </p>
        )}
      </section>

      <section className="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            "Type-Safe Routing",
            "Routes and links stay in sync across every page.",
          ],
          [
            "Server Functions",
            "Call server code from your UI without creating API boilerplate.",
          ],
          [
            "Streaming by Default",
            "Ship progressively rendered responses for faster experiences.",
          ],
          [
            "Tailwind Native",
            "Design quickly with utility-first styling and reusable tokens.",
          ],
        ].map(([title, desc], index) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl p-5"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h2 className="mb-2 text-base font-semibold text-(--sea-ink)">
              {title}
            </h2>
            <p className="m-0 text-sm text-(--sea-ink-soft)">{desc}</p>
          </article>
        ))}
      </section>
    </main>
    </div>
  );
}
