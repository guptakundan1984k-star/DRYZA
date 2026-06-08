import React, { useState } from "react";
import { Product } from "../types";
import { Clock, Users, ArrowRight, ChefHat, PlayCircle } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  category: "Appetizers" | "Main Courses" | "Snacks" | "Product Highlights";
  image: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  description: string;
  featuredProductIds: string[];
  featuredProductNames: string[];
  ingredients: string[];
  instructions: string[];
  nutritionalInfo?: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
}

const ALL_RECIPES: Recipe[] = [
  {
    id: "rec-1",
    title: "Garlic & Herb Roasted Potatoes",
    category: "Appetizers",
    image:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=600",
    prepTime: "10 mins",
    cookTime: "35 mins",
    servings: 4,
    description:
      "Crispy, golden roasted potatoes elevated with our premium dehydrated garlic and select herbs. A perfect appetizer or side dish for any occasion.",
    featuredProductIds: ["garlic-powder", "dryza-oregano-flakes"],
    featuredProductNames: ["Dehydrated Garlic Powder", "Oregano Flakes"],
    ingredients: [
      "2 lbs baby potatoes, halved",
      "2 tbsp olive oil",
      "1 tbsp Dryza Dehydrated Garlic Powder",
      "1 tsp Dryza Oregano Flakes",
      "1 tsp sea salt",
      "1/2 tsp black pepper",
      "Fresh parsley for garnish",
    ],
    instructions: [
      "Preheat oven to 400°F (200°C).",
      "In a large bowl, toss the halved potatoes with olive oil.",
      "Sprinkle the dehydrated garlic powder, oregano flakes, sea salt, and black pepper over the potatoes. Toss until evenly coated.",
      "Spread the potatoes in a single layer on a baking sheet.",
      "Roast for 30-35 minutes, flipping halfway, until golden and crispy.",
      "Garnish with fresh parsley before serving.",
    ],
    nutritionalInfo: {
      calories: "180 kcal",
      protein: "4g",
      carbs: "30g",
      fat: "7g",
    },
  },
  {
    id: "rec-2",
    title: "Spicy Tomato Basil Pasta",
    category: "Main Courses",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=600",
    prepTime: "5 mins",
    cookTime: "20 mins",
    servings: 2,
    description:
      "A quick and rich pasta dish featuring a deeply flavorful sauce made using our concentrated dehydrated tomato powder and zesty chili flakes.",
    featuredProductIds: ["tomato-powder", "red-chilli-flakes"],
    featuredProductNames: ["Dehydrated Tomato Powder", "Red Chilli Flakes"],
    ingredients: [
      "8 oz pasta (penne or spaghetti)",
      "3 tbsp Dryza Dehydrated Tomato Powder",
      "1 cup warm water or vegetable broth",
      "1 tsp Dryza Red Chilli Flakes",
      "2 cloves garlic, minced",
      "2 tbsp olive oil",
      "Fresh basil leaves",
      "Parmesan cheese, grated",
    ],
    instructions: [
      "Boil pasta in salted water according to package instructions. Reserve 1/2 cup of pasta water before draining.",
      "In a small bowl, whisk the dehydrated tomato powder with warm water/broth until smooth.",
      "Heat olive oil in a pan over medium heat. Sauté minced garlic until fragrant.",
      "Add the red chilli flakes and the tomato powder mixture. Simmer for 5-7 minutes until slightly thickened.",
      "Toss the drained pasta into the sauce. Add reserved pasta water if needed to adjust consistency.",
      "Serve hot, garnished with fresh basil and parmesan cheese.",
    ],
    nutritionalInfo: {
      calories: "420 kcal",
      protein: "12g",
      carbs: "65g",
      fat: "14g",
    },
  },
  {
    id: "rec-3",
    title: "Zesty Onion & Mint Yogurt Dip",
    category: "Snacks",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600",
    prepTime: "5 mins",
    cookTime: "0 mins",
    servings: 6,
    description:
      "A refreshing and savory yogurt dip that comes together in minutes. Perfect with chips, crackers, or fresh vegetables.",
    featuredProductIds: ["onion-powder", "mint-leaves"],
    featuredProductNames: ["Dehydrated Onion Powder", "Dry Mint Leaves"],
    ingredients: [
      "1 cup plain Greek yogurt",
      "1 tbsp Dryza Dehydrated Onion Powder",
      "1 tbsp Dryza Dry Mint Leaves, crushed",
      "1/2 tsp garlic powder",
      "1 tbsp lemon juice",
      "Salt & pepper to taste",
    ],
    instructions: [
      "In a medium bowl, combine the Greek yogurt, dehydrated onion powder, and crushed dry mint leaves.",
      "Add garlic powder, lemon juice, salt, and pepper.",
      "Stir well until all ingredients are fully incorporated.",
      "Cover and refrigerate for at least 30 minutes to allow the flavors to meld.",
      "Serve chilled with your favorite snacks.",
    ],
    nutritionalInfo: {
      calories: "45 kcal",
      protein: "4g",
      carbs: "3g",
      fat: "1g",
    },
  },
  {
    id: "rec-4",
    title: "Ginger Infused Detox Tea",
    category: "Product Highlights",
    image:
      "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600",
    prepTime: "2 mins",
    cookTime: "5 mins",
    servings: 1,
    description:
      "Experience the warm, potent kick of our premium dehydrated ginger in this soothing, immunity-boosting detox tea.",
    featuredProductIds: ["ginger-powder"],
    featuredProductNames: ["Dehydrated Ginger Powder"],
    ingredients: [
      "1 cup hot water",
      "1/2 tsp Dryza Dehydrated Ginger Powder",
      "1 tbsp honey",
      "1 tbsp fresh lemon juice",
      "A pinch of cinnamon",
    ],
    instructions: [
      "Boil the water.",
      "In a mug, whisk together the dehydrated ginger powder and hot water until fully dissolved.",
      "Stir in honey and lemon juice.",
      "Top with a pinch of cinnamon and steep for 2 minutes before drinking.",
    ],
  },
];

interface BlogSectionProps {
  products: Product[];
  onExploreProduct: (product: Product) => void;
}

export default function BlogSection({
  products,
  onExploreProduct,
}: BlogSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [currentServings, setCurrentServings] = useState<number>(1);

  // Helper to scale numeric values in strings
  const scaleAmount = (str: string, multiplier: number) => {
    return str.replace(/(\d+(?:\.\d+)?)/g, (match) => {
      const num = parseFloat(match);
      return (Math.round(num * multiplier * 10) / 10).toString();
    });
  };

  const categories = [
    "All",
    "Appetizers",
    "Main Courses",
    "Snacks",
    "Product Highlights",
  ];

  const filteredRecipes =
    activeCategory === "All"
      ? ALL_RECIPES
      : ALL_RECIPES.filter((r) => r.category === activeCategory);

  const handleProductClick = (productId: string, productName: string) => {
    const matchedProduct = products.find(
      (p) =>
        p.id === productId ||
        p.name.toLowerCase() === productName.toLowerCase(),
    );
    if (matchedProduct) {
      onExploreProduct(matchedProduct);
    } else {
      alert(
        `Product "${productName}" is not currently in the active directory, but you can request it!`,
      );
    }
  };

  if (selectedRecipe) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 py-8"
        id="blog-recipe-detail"
      >
        <button
          onClick={() => setSelectedRecipe(null)}
          className="text-emerald-800 font-bold font-mono text-xs uppercase tracking-wider mb-6 flex items-center hover:text-emerald-950 transition-colors"
        >
          ← Back to Recipes
        </button>

        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200">
          <div className="h-64 sm:h-96 w-full relative">
            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-800">
              {selectedRecipe.category}
            </div>
          </div>

          <div className="p-6 md:p-10">
            <h1 className="text-3xl font-extrabold text-stone-900 font-sans tracking-tight mb-4">
              {selectedRecipe.title}
            </h1>

            <p className="text-stone-600 text-sm leading-relaxed mb-8">
              {selectedRecipe.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-700" />
                <div>
                  <span className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                    Prep Time
                  </span>
                  <span className="block text-sm font-semibold text-stone-800">
                    {selectedRecipe.prepTime}
                  </span>
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center gap-3">
                <PlayCircle className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                    Cook Time
                  </span>
                  <span className="block text-sm font-semibold text-stone-800">
                    {selectedRecipe.cookTime}
                  </span>
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between col-span-full md:col-span-1 md:row-start-2">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="block text-[10px] text-stone-500 font-bold uppercase tracking-wider">
                      Servings
                    </span>
                    <span className="block text-sm font-semibold text-stone-800">
                      {currentServings} people
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentServings(Math.max(1, currentServings - 1))}
                    className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-300 transition-colors"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setCurrentServings(currentServings + 1)}
                    className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold hover:bg-emerald-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 border-b border-stone-200 pb-2 mb-4 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-stone-700" />
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ing, idx) => {
                      const isFeatured =
                        selectedRecipe.featuredProductNames.some((name) =>
                          ing.includes(name),
                        );
                      const multiplier = currentServings / selectedRecipe.servings;
                      const scaledIng = scaleAmount(ing, multiplier);
                      return (
                        <li
                          key={idx}
                          className={`text-sm py-1 border-b border-stone-100 last:border-0 ${isFeatured ? "font-bold text-emerald-900" : "text-stone-700"}`}
                        >
                          {scaledIng}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {selectedRecipe.nutritionalInfo && (() => {
                  const multiplier = currentServings / selectedRecipe.servings;
                  return (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-3">
                      Total Nutrition ({currentServings} Servings)
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3 pb-3 border-b border-amber-200/50">
                      <div className="flex justify-between">
                        <span className="text-amber-700">Calories:</span>
                        <span className="font-bold text-amber-950">
                          {scaleAmount(selectedRecipe.nutritionalInfo.calories, multiplier)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Protein:</span>
                        <span className="font-bold text-amber-950">
                          {scaleAmount(selectedRecipe.nutritionalInfo.protein, multiplier)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Carbs:</span>
                        <span className="font-bold text-amber-950">
                          {scaleAmount(selectedRecipe.nutritionalInfo.carbs, multiplier)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Fat:</span>
                        <span className="font-bold text-amber-950">
                          {scaleAmount(selectedRecipe.nutritionalInfo.fat, multiplier)}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-2">
                      Per Serving Value
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-amber-700">Calories:</span>
                        <span className="font-bold text-amber-950">
                          {scaleAmount(selectedRecipe.nutritionalInfo.calories, 1 / selectedRecipe.servings)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Protein:</span>
                        <span className="font-bold text-amber-950">
                          {scaleAmount(selectedRecipe.nutritionalInfo.protein, 1 / selectedRecipe.servings)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Carbs:</span>
                        <span className="font-bold text-amber-950">
                          {scaleAmount(selectedRecipe.nutritionalInfo.carbs, 1 / selectedRecipe.servings)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Fat:</span>
                        <span className="font-bold text-amber-950">
                          {scaleAmount(selectedRecipe.nutritionalInfo.fat, 1 / selectedRecipe.servings)}
                        </span>
                      </div>
                    </div>
                  </div>
                )})()}
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-bold text-stone-900 border-b border-stone-200 pb-2 mb-4">
                  Instructions
                </h3>
                <ol className="space-y-4">
                  {selectedRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-stone-700 text-sm leading-relaxed">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>

                <div className="mt-8 bg-stone-50 border border-stone-200 rounded-2xl p-6">
                  <h4 className="font-bold text-stone-900 mb-3 text-sm">
                    Featured Dryza Products used in this recipe:
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedRecipe.featuredProductNames.map((name, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          handleProductClick(
                            selectedRecipe.featuredProductIds[idx],
                            name,
                          )
                        }
                        className="bg-white border border-stone-200 hover:border-emerald-500 px-4 py-2 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 shadow-sm transition-all"
                      >
                        {name} <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      id="blog-section-main"
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 font-sans tracking-tight">
          Dryza Recipes & Inspiration
        </h1>
        <p className="text-stone-500 mt-3 max-w-2xl mx-auto">
          Discover how to elevate your culinary creations using our premium
          dehydrated vegetables, herbs, and seasonings.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-colors ${
              activeCategory === cat
                ? "bg-emerald-900 text-white shadow-md"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-lg transition-all duration-300 flex flex-col group cursor-pointer"
            onClick={() => {
              setSelectedRecipe(recipe);
              setCurrentServings(recipe.servings);
            }}
          >
            <div className="h-48 w-full relative overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-stone-800 uppercase tracking-wide">
                {recipe.category}
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-stone-900 mb-2 leading-tight group-hover:text-emerald-800 transition-colors">
                {recipe.title}
              </h3>
              <p className="text-stone-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                {recipe.description}
              </p>

              <div className="mt-auto flex items-center justify-between text-[11px] text-stone-500 font-semibold border-t border-stone-100 pt-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {recipe.cookTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> {recipe.servings} served
                  </span>
                </div>
                <button className="text-emerald-700 font-bold hover:text-emerald-900 flex items-center gap-1">
                  Read <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200">
          <ChefHat className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-600">No recipes found</h3>
          <p className="text-sm text-stone-500">
            Check back later for more delicious ideas.
          </p>
        </div>
      )}
    </div>
  );
}
