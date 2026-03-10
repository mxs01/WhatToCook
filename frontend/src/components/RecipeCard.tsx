import type { RecipeResponse } from "../api/client";
import { Link } from "react-router-dom";
import { Clock, UtensilsCrossed } from "lucide-react";

interface RecipeCardProps {
  recipe: RecipeResponse;
}

const difficultyStyle: Record<string, { bg: string; text: string }> = {
  easy: { bg: "rgba(0,163,136,0.1)", text: "#00A388" },
  medium: { bg: "rgba(208,169,125,0.15)", text: "#C89B6C" },
  hard: { bg: "rgba(212,140,132,0.12)", text: "#D48C84" },
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
  const diff = difficultyStyle[recipe.difficulty.toLowerCase()] ?? {
    bg: "rgba(142,142,147,0.1)",
    text: "#8E8E93",
  };

  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-[#F0F0F2] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image */}
      {recipe.image_url ? (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={`/api/images/${recipe.image_url}`}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="relative flex h-48 w-full items-center justify-center bg-gradient-to-br from-[#F5F5F7] to-[#EBECEE]">
          <UtensilsCrossed className="h-12 w-12 text-[#D1D1D6]" />
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug tracking-tight text-[#1C1C1E] transition-colors duration-300 group-hover:text-[#00A388]">
          {recipe.title}
        </h3>
        <p className="mb-5 line-clamp-2 flex-1 text-sm leading-relaxed text-[#8E8E93]">
          {recipe.description}
        </p>

        {/* Footer */}
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ backgroundColor: diff.bg, color: diff.text }}
          >
            {recipe.difficulty}
          </span>
          <span className="rounded-full bg-[#F5F5F7] px-2.5 py-1 text-xs font-medium text-[#8E8E93]">
            {recipe.cuisine}
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs font-medium text-[#8E8E93]">
            <Clock className="h-3.5 w-3.5" />
            {totalTime}m
          </span>
        </div>
      </div>
    </Link>
  );
}
