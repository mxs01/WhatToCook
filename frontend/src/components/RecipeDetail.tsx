import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getRecipe, type RecipeDetailResponse } from "../api/client";
import {
  ArrowLeft,
  Clock,
  Flame,
  ChefHat,
  Users,
  Loader2,
  Check,
  UtensilsCrossed,
  Timer,
  BookOpen,
} from "lucide-react";

const difficultyStyle: Record<string, { bg: string; text: string; label: string }> = {
  easy: { bg: "rgba(0,163,136,0.1)", text: "#00A388", label: "Easy" },
  medium: { bg: "rgba(208,169,125,0.15)", text: "#C89B6C", label: "Medium" },
  hard: { bg: "rgba(212,140,132,0.12)", text: "#D48C84", label: "Hard" },
};

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<RecipeDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getRecipe(id)
      .then(setRecipe)
      .catch(() => setError("Failed to load recipe."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-3xl"
            style={{ backgroundColor: "rgba(0,163,136,0.08)" }}
          >
            <Loader2 className="h-7 w-7 animate-spin" style={{ color: "#00A388" }} />
          </div>
          <p className="text-sm font-medium text-[#8E8E93]">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
        <div
          className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl"
          style={{ backgroundColor: "rgba(212,140,132,0.08)" }}
        >
          <UtensilsCrossed className="h-7 w-7" style={{ color: "#D48C84" }} />
        </div>
        <p className="mb-2 text-lg font-bold text-[#1C1C1E]">
          {error ? "Something went wrong" : "Recipe not found"}
        </p>
        <p className="mb-6 text-sm text-[#8E8E93]">{error ?? "This recipe may have been removed."}</p>
        <Link
          to="/recipes"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#1C1C1E] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to recipes
        </Link>
      </div>
    );
  }

  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
  const diff = difficultyStyle[recipe.difficulty.toLowerCase()] ?? {
    bg: "rgba(142,142,147,0.1)",
    text: "#8E8E93",
    label: recipe.difficulty,
  };

  const hasImage = recipe.images.length > 0;

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Back navigation */}
      <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-10">
        <Link
          to="/recipes"
          className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-[#8E8E93] shadow-sm backdrop-blur-sm transition-all duration-300 hover:text-[#1C1C1E] hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          All Recipes
        </Link>
      </div>

      {/* Split layout */}
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className={`flex flex-col gap-10 ${hasImage ? "lg:flex-row" : ""}`}>
          {/* ── Left: Sticky Image ──────────────────────────────────── */}
          {hasImage && (
            <div className="lg:w-[45%] xl:w-[48%]">
              <div className="lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-[32px] shadow-xl">
                  <img
                    src={`/api/images/${recipe.images[0].image_key}`}
                    alt={recipe.title}
                    className="h-auto w-full object-cover lg:h-[calc(100vh-8rem)] lg:max-h-[700px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Right: Content ─────────────────────────────────────── */}
          <div className={hasImage ? "flex-1 lg:w-[55%]" : "mx-auto max-w-3xl w-full"}>
            {/* Hero header */}
            <div className="mb-8">
              {/* Badges */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-3 py-1.5 text-xs font-semibold"
                  style={{ backgroundColor: diff.bg, color: diff.text }}
                >
                  {diff.label}
                </span>
                <span className="rounded-full bg-[#EBECEE] px-3 py-1.5 text-xs font-medium text-[#8E8E93]">
                  {recipe.cuisine}
                </span>
              </div>

              {/* Title */}
              <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-[#1C1C1E] lg:text-4xl">
                {recipe.title}
              </h1>

              {/* Description */}
              <p className="text-base leading-relaxed text-[#8E8E93] lg:text-lg">
                {recipe.description}
              </p>
            </div>

            {/* Stat cards */}
            <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex flex-col items-center rounded-2xl bg-white p-5 shadow-sm">
                <Clock className="mb-2 h-5 w-5 text-[#6B9EAF]" />
                <span className="text-xl font-bold text-[#1C1C1E]">{recipe.prep_time_minutes}</span>
                <span className="mt-0.5 text-xs font-medium text-[#8E8E93]">min prep</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-white p-5 shadow-sm">
                <Flame className="mb-2 h-5 w-5 text-[#D48C84]" />
                <span className="text-xl font-bold text-[#1C1C1E]">{recipe.cook_time_minutes}</span>
                <span className="mt-0.5 text-xs font-medium text-[#8E8E93]">min cook</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-white p-5 shadow-sm">
                <Timer className="mb-2 h-5 w-5 text-[#D0A97D]" />
                <span className="text-xl font-bold text-[#1C1C1E]">{totalTime}</span>
                <span className="mt-0.5 text-xs font-medium text-[#8E8E93]">min total</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-white p-5 shadow-sm">
                <Users className="mb-2 h-5 w-5 text-[#9A85A3]" />
                <span className="text-xl font-bold text-[#1C1C1E]">{recipe.servings}</span>
                <span className="mt-0.5 text-xs font-medium text-[#8E8E93]">servings</span>
              </div>
            </div>

            {/* ── Ingredients ────────────────────────────────────────── */}
            <section className="mb-8 overflow-hidden rounded-[28px] border border-[#F0F0F2] bg-white shadow-sm">
              <div className="border-b border-[#F5F5F7] px-8 py-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(0,163,136,0.08)" }}
                  >
                    <ChefHat className="h-4.5 w-4.5" style={{ color: "#00A388" }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-[#1C1C1E]">Ingredients</h2>
                    <p className="text-xs text-[#8E8E93]">{recipe.ingredients_json.length} items</p>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-[#F5F5F7]">
                {recipe.ingredients_json.map((ing, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 px-8 py-3.5 transition-colors duration-200 hover:bg-[#FAFAFA]"
                  >
                    <div
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "rgba(0,163,136,0.1)" }}
                    >
                      <Check className="h-3 w-3" style={{ color: "#00A388" }} strokeWidth={3} />
                    </div>
                    <div className="flex flex-1 items-baseline gap-2">
                      <span className="text-sm font-semibold text-[#1C1C1E]">
                        {ing.amount} {ing.unit}
                      </span>
                      <span className="text-sm text-[#8E8E93]">{ing.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Instructions ───────────────────────────────────────── */}
            <section className="mb-8 overflow-hidden rounded-[28px] border border-[#F0F0F2] bg-white shadow-sm">
              <div className="border-b border-[#F5F5F7] px-8 py-5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: "rgba(107,158,175,0.1)" }}
                  >
                    <BookOpen className="h-4.5 w-4.5" style={{ color: "#6B9EAF" }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-[#1C1C1E]">Instructions</h2>
                    <p className="text-xs text-[#8E8E93]">{recipe.instructions_json.length} steps</p>
                  </div>
                </div>
              </div>
              <div className="px-8 py-6">
                <ol className="space-y-6">
                  {recipe.instructions_json.map((step, idx) => (
                      <li key={step.step} className="flex gap-5">
                        <div className="flex flex-col items-center">
                          <span
                            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
                            style={{ backgroundColor: "#00A388" }}
                          >
                            {step.step}
                          </span>
                          {idx < recipe.instructions_json.length - 1 && (
                            <div className="mt-2 w-px flex-1 bg-[#EBECEE]" />
                          )}
                        </div>
                        <p className="flex-1 pt-1 text-[15px] leading-relaxed text-[#1C1C1E]">
                          {step.text}
                        </p>
                      </li>
                    ))}
                </ol>
              </div>
            </section>

            {/* ── References ─────────────────────────────────────────── */}
            {recipe.references.length > 0 && (
              <section className="overflow-hidden rounded-[28px] border border-[#F0F0F2] bg-white shadow-sm">
                <div className="border-b border-[#F5F5F7] px-8 py-5">
                  <h2 className="text-lg font-bold tracking-tight text-[#1C1C1E]">Sources</h2>
                </div>
                <div className="divide-y divide-[#F5F5F7]">
                  {recipe.references.map((ref, i) => (
                    <div key={i} className="px-8 py-4">
                      <div className="mb-2">
                        <span
                          className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: "rgba(0,163,136,0.08)",
                            color: "#00A388",
                          }}
                        >
                          {(ref.relevance_score * 100).toFixed(0)}% match
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-[#8E8E93]">{ref.snippet}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
