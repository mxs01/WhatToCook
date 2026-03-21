# Missing API Endpoints for WhatToCook

Based on the synthesis of the Stitch UI designs and the current backend API implementation, the following API endpoints are missing and are required to fully support the frontend applications (Mobile & Web):

## 1. Text-to-Recipe Generation (Flux-Generierung)
The current API only supports recipe generation via fridge image upload (`POST /api/uploads/fridge`). The UI designs suggest the ability to generate or search recipes based on textual input, preferences, or from a general "Landing Page" prompt.

**Missing Endpoint:**
- `POST /api/recipes/generate`
- **Request Body:** `{ "prompt": string, "preferences": object }`
- **Response:** Job ID or Recipe object stream.

## 2. Macro Analysis (Makro-Analyse)
The UI displays nutritional information (Macros) for the recipes, but the current `RecipeDetailResponse` schema does not include any fields for calories, protein, carbs, or fats.

**Missing Endpoint/Schema Update:**
- `GET /api/recipes/{recipe_id}/nutrition` 
- Alternatively, include `nutrition: { calories: number, protein: number, carbs: number, fat: number }` in the existing `RecipeDetailResponse`.

## 3. Recipe Search / Filtering
While `GET /api/recipes` exists, it lacks robust filtering necessary for a "Recipe Gallery" or "Dashboard" where users might filter by tags, ingredients, or cuisines.

**Missing Query Parameters on `GET /api/recipes`:**
- `?search=<query>`
- `?cuisine=<cuisine>`
- `?tags=<tags>`

## 4. User Profiles & Preferences
There is a `users_router`, but we typically need endpoints for the user to manage their dietary preferences, which influence recipe generation.

**Missing Endpoint:**
- `GET /api/users/me/preferences`
- `PUT /api/users/me/preferences`
