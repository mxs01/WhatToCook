import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listRecipes, type RecipeResponse } from "../api/client";
import RecipeCard from "./RecipeCard";
import { Plus, Loader2, Sparkles, Camera } from "lucide-react";

export default function RecipeList() {
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listRecipes()
      .then(setRecipes)
      .catch(() => setError("Failed to load recipes."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-3xl"
            style={{ backgroundColor: "rgba(0,163,136,0.08)" }}
          >
            <Loader2
              className="h-7 w-7 animate-spin"
              style={{ color: "#00A388" }}
            />
          </div>
          <p className="text-sm font-medium text-[#8E8E93]">Loading your recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-base font-medium" style={{ color: "#D48C84" }}>
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {/* Dashboard Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1C1C1E] lg:text-5xl">
              Your Recipes
            </h1>
            <p className="mt-2 text-base text-[#8E8E93]">
              {recipes.length > 0
                ? `${recipes.length} recipe${recipes.length !== 1 ? "s" : ""} generated from your fridge`
                : "Upload a fridge photo to get started"}
            </p>
          </div>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-[#1C1C1E] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            New Upload
          </Link>
        </div>

        {recipes.length === 0 ? (
          /* ── Empty state ────────────────────────────────────────────── */
          <div className="flex flex-col items-center rounded-[32px] border border-[#E5E5EA] bg-white px-8 py-24 text-center shadow-sm">
            <div
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px]"
              style={{ backgroundColor: "rgba(0,163,136,0.06)" }}
            >
              <Camera className="h-9 w-9" style={{ color: "#00A388" }} />
            </div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-[#1C1C1E]">
              No recipes yet
            </h2>
            <p className="mb-8 max-w-sm text-base text-[#8E8E93]">
              Snap a photo of your fridge and our AI will suggest delicious recipes based on what you have.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-[#00A388] px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
              style={{ boxShadow: "0 8px 32px rgba(0,163,136,0.3)" }}
            >
              <Sparkles className="h-4 w-4" />
              Upload Your First Photo
            </Link>
          </div>
        ) : (
          /* ── Recipe Grid ────────────────────────────────────────────── */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
