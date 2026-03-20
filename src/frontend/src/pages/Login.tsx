import { Printer } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Login() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "oklch(0.12 0.038 245)" }}
    >
      <div
        className="w-full max-w-sm p-8 rounded-2xl"
        style={{
          background: "oklch(0.165 0.045 245)",
          border: "1px solid oklch(0.22 0.042 245)",
        }}
      >
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "oklch(0.73 0.148 200)" }}
          >
            <Printer
              className="w-8 h-8"
              style={{ color: "oklch(0.12 0.038 245)" }}
            />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "oklch(0.935 0.018 245)" }}
          >
            TECHNO COPIER
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "oklch(0.65 0.038 245)" }}
          >
            SYSTEMS
          </p>
          <p
            className="text-sm mt-4"
            style={{ color: "oklch(0.65 0.038 245)" }}
          >
            Sign in to access the management portal
          </p>
        </div>
        <button
          type="button"
          onClick={login}
          disabled={isLoggingIn}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity disabled:opacity-60"
          style={{
            background: "oklch(0.73 0.148 200)",
            color: "oklch(0.12 0.038 245)",
          }}
        >
          {isLoggingIn ? "Connecting..." : "Sign In with Internet Identity"}
        </button>
      </div>
    </div>
  );
}
