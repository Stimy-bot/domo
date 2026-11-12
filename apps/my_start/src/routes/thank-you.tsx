import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/thank-you")({
  component: ThankYouPage,
});

function ThankYouPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Decrement countdown visual state every second
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Perform redirect after 5 seconds
    const redirectTimeout = setTimeout(() => {
      navigate({ to: "/" });
    }, 5000);

    // Clean up timers on unmount
    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimeout);
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-4">
      <main className="island-shell rise-in flex flex-col items-center justify-center max-w-200 min-h-[60vh] px-4 text-center rounded-lg">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Message Received!
        </h1>
        <div>
          <h2>
            Thank you for reaching out.<br></br>
            We’ve received your submission and sent a confirmation email to your
            inbox.
          </h2>
          <p className="text-left mx-22 pb-10">
            <strong className="text-shadow-teal-300">Quote Requests:</strong> We'll review your project details
            and respond with an estimate within 24 hours.<br></br>
            <strong>General Contact & Comments:</strong> We'll get back to you
            as soon as possible.
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Redirecting to the home page in{" "}
          <span className="font-semibold">{countdown}</span> second
          {countdown !== 1 ? "s" : ""}...
        </p>

        <Link to="/" className="demo-button">
          Return Home Now
        </Link>
      </main>
    </div>
  );
}
