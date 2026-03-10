import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getUpload } from "../api/client";
import { Loader2, XCircle } from "lucide-react";

const POLL_INTERVAL_MS = 2000;

const statusMessages: Record<string, string> = {
  pending: "Queuing your request...",
  processing: "Analyzing your fridge and generating a recipe...",
  completed: "Recipe ready! Redirecting...",
  failed: "Something went wrong.",
};

export default function ProcessingScreen() {
  const { uploadId } = useParams<{ uploadId: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState("pending");
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!uploadId) return;

    async function poll() {
      try {
        const upload = await getUpload(uploadId!);
        setStatus(upload.status);

        if (upload.status === "completed") {
          if (intervalRef.current) clearInterval(intervalRef.current);
          if (upload.recipe_id) {
            navigate(`/recipes/${upload.recipe_id}`, { replace: true });
          } else {
            navigate("/recipes", { replace: true });
          }
        } else if (upload.status === "failed") {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setError("Recipe generation failed. Please try again.");
        }
      } catch {
        // Network error — keep polling, it may recover
      }
    }

    poll();
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [uploadId, navigate]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      {status !== "failed" ? (
        <>
          <div
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl"
            style={{ backgroundColor: "rgba(0,163,136,0.08)" }}
          >
            <Loader2
              className="h-7 w-7 animate-spin"
              style={{ color: "#00A388" }}
            />
          </div>

          <h2 className="mb-2 text-xl font-semibold tracking-tight text-text-main">
            {statusMessages[status] ?? "Processing..."}
          </h2>
          <p className="text-sm text-text-muted">
            This usually takes 10-30 seconds. Please don't close the page.
          </p>
        </>
      ) : (
        <>
          <div
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl"
            style={{ backgroundColor: "rgba(212,140,132,0.1)" }}
          >
            <XCircle className="h-7 w-7" style={{ color: "#D48C84" }} />
          </div>

          <h2 className="mb-2 text-xl font-semibold tracking-tight text-text-main">
            Generation failed
          </h2>
          <p
            className="mb-6 text-sm font-medium"
            style={{ color: "#D48C84" }}
          >
            {error}
          </p>

          <Link
            to="/upload"
            className="rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary-600"
            style={{
              boxShadow: "0 8px 24px rgba(0,163,136,0.25)",
              transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
          >
            Try again
          </Link>
        </>
      )}
    </div>
  );
}
