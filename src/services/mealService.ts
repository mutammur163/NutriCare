// =============================================================================
// MEAL SERVICE — Meal plans, distribution, and rule-based recommendations
// =============================================================================

import type {
  MealPlan,
  MealPlanEntry,
  MealDistributionRecord,
  MealCategory,
  AgeGroup,
  ActivityItem,
  Child,
} from '../types';
import { loadStore, saveStore } from './store';
import { generateId } from '../utils/id';
import { format, startOfWeek, addDays } from 'date-fns';

function logActivity(item: Omit<ActivityItem, 'id'>): void {
  const store = loadStore();
  const activity: ActivityItem = { ...item, id: generateId('act') };
  store.activityLog = [activity, ...store.activityLog].slice(0, 100);
  saveStore(store);
}

// ---------------------------------------------------------------------------
// MEAL PLANS
// ---------------------------------------------------------------------------

export function getAllMealPlans(): MealPlan[] {
  return loadStore().mealPlans;
}

export function getMealPlanById(id: string): MealPlan | undefined {
  return loadStore().mealPlans.find((p) => p.id === id);
}

export function getMealPlansByAgeGroup(ageGroup: AgeGroup): MealPlan[] {
  return loadStore().mealPlans.filter((p) => p.ageGroup === ageGroup);
}

export function createMealPlan(data: Omit<MealPlan, 'id' | 'createdAt' | 'updatedAt'>): MealPlan {
  const store = loadStore();
  const plan: MealPlan = {
    ...data,
    id: generateId('mp'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.mealPlans.push(plan);
  saveStore(store);
  logActivity({ type: 'meal_planned', description: `Meal plan "${plan.planName}" created`, timestamp: new Date().toISOString() });
  return plan;
}

export function updateMealPlan(id: string, data: Partial<Omit<MealPlan, 'id' | 'createdAt'>>): MealPlan {
  const store = loadStore();
  const idx = store.mealPlans.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error('Meal plan not found.');
  store.mealPlans[idx] = { ...store.mealPlans[idx], ...data, updatedAt: new Date().toISOString() };
  saveStore(store);
  return store.mealPlans[idx];
}

export function deleteMealPlan(id: string): void {
  const store = loadStore();
  store.mealPlans = store.mealPlans.filter((p) => p.id !== id);
  saveStore(store);
}

export function addEntryToMealPlan(planId: string, entry: Omit<MealPlanEntry, 'id' | 'mealPlanId'>): MealPlanEntry {
  const store = loadStore();
  const idx = store.mealPlans.findIndex((p) => p.id === planId);
  if (idx === -1) throw new Error('Meal plan not found.');
  const newEntry: MealPlanEntry = { ...entry, id: generateId('mpe'), mealPlanId: planId };
  store.mealPlans[idx].entries.push(newEntry);
  store.mealPlans[idx].updatedAt = new Date().toISOString();
  saveStore(store);
  return newEntry;
}

export function updateEntryInMealPlan(planId: string, entryId: string, data: Partial<MealPlanEntry>): void {
  const store = loadStore();
  const idx = store.mealPlans.findIndex((p) => p.id === planId);
  if (idx === -1) throw new Error('Meal plan not found.');
  const plan = store.mealPlans[idx];
  const eIdx = plan.entries.findIndex((e) => e.id === entryId);
  if (eIdx === -1) throw new Error('Entry not found.');
  plan.entries[eIdx] = { ...plan.entries[eIdx], ...data };
  plan.updatedAt = new Date().toISOString();
  saveStore(store);
}

export function removeEntryFromMealPlan(planId: string, entryId: string): void {
  const store = loadStore();
  const idx = store.mealPlans.findIndex((p) => p.id === planId);
  if (idx === -1) return;
  store.mealPlans[idx].entries = store.mealPlans[idx].entries.filter((e) => e.id !== entryId);
  store.mealPlans[idx].updatedAt = new Date().toISOString();
  saveStore(store);
}

export function duplicateMealPlan(sourcePlanId: string, newWeekStart: string, newName: string): MealPlan {
  const source = getMealPlanById(sourcePlanId);
  if (!source) throw new Error('Source plan not found.');
  const newEntries: MealPlanEntry[] = source.entries.map((e) => ({ ...e, id: generateId('mpe'), date: undefined }));
  return createMealPlan({ ...source, planName: newName, weekStartDate: newWeekStart, entries: newEntries, createdBy: source.createdBy });
}

// ---------------------------------------------------------------------------
// DISTRIBUTION RECORDS
// ---------------------------------------------------------------------------

export function getAllDistributionRecords(): MealDistributionRecord[] {
  return loadStore().distributionRecords;
}

export function getDistributionByDate(date: string): MealDistributionRecord[] {
  return loadStore().distributionRecords.filter((r) => r.date === date);
}

export function getDistributionByDateRange(start: string, end: string): MealDistributionRecord[] {
  return loadStore().distributionRecords.filter((r) => r.date >= start && r.date <= end);
}

export function getTodayDistribution(): MealDistributionRecord[] {
  const today = format(new Date(), 'yyyy-MM-dd');
  return getDistributionByDate(today);
}

export function createDistributionRecord(data: Omit<MealDistributionRecord, 'id' | 'createdAt' | 'updatedAt'>): MealDistributionRecord {
  const store = loadStore();
  const record: MealDistributionRecord = {
    ...data,
    id: generateId('dr'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.distributionRecords.push(record);
  saveStore(store);
  logActivity({ type: 'distribution_recorded', description: `Meal distribution recorded: ${record.mealCategory.replace('_', ' ')} (${record.date})`, timestamp: new Date().toISOString() });
  return record;
}

export function updateDistributionRecord(id: string, data: Partial<Omit<MealDistributionRecord, 'id' | 'createdAt'>>): MealDistributionRecord {
  const store = loadStore();
  const idx = store.distributionRecords.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error('Distribution record not found.');
  store.distributionRecords[idx] = { ...store.distributionRecords[idx], ...data, updatedAt: new Date().toISOString() };
  saveStore(store);
  return store.distributionRecords[idx];
}

export function deleteDistributionRecord(id: string): void {
  const store = loadStore();
  store.distributionRecords = store.distributionRecords.filter((r) => r.id !== id);
  saveStore(store);
}

// Weekly distribution chart data
export function getWeeklyDistributionData(): { date: string; label: string; breakfast: number; lunch: number; snack: number }[] {
  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  const result = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(monday, i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const records = getDistributionByDate(dateStr);
    result.push({
      date: dateStr,
      label: format(d, 'EEE'),
      breakfast: records.filter((r) => r.mealCategory === 'breakfast').reduce((sum, r) => sum + r.actualServings, 0),
      lunch: records.filter((r) => r.mealCategory === 'lunch').reduce((sum, r) => sum + r.actualServings, 0),
      snack: records.filter((r) => r.mealCategory === 'morning_snack' || r.mealCategory === 'afternoon_snack').reduce((sum, r) => sum + r.actualServings, 0),
    });
  }
  return result;
}

// ---------------------------------------------------------------------------
// RULE-BASED MEAL RECOMMENDATION ENGINE
// ---------------------------------------------------------------------------

export interface MealSuggestion {
  dishName: string;
  mealCategory: MealCategory;
  ingredients: string[];
  servingSizeGrams: number;
  foodGroups: string[];
  estimatedCostPerServing: number;
  isVegetarian: boolean;
  allergenInfo: string[];
  rationaleNote: string;
  preparationNotes: string;
}

const MEAL_DATABASE: MealSuggestion[] = [
  // Breakfast options
  { dishName: 'Ragi Porridge', mealCategory: 'breakfast', ingredients: ['Ragi flour', 'Jaggery', 'Water', 'Milk'], servingSizeGrams: 150, foodGroups: ['cereals', 'dairy'], estimatedCostPerServing: 8, isVegetarian: true, allergenInfo: ['milk'], rationaleNote: 'Ragi is rich in calcium and iron; locally available and affordable.', preparationNotes: 'Cook ragi flour in water; add jaggery for sweetness and a small amount of milk.' },
  { dishName: 'Idli with Coconut Chutney', mealCategory: 'breakfast', ingredients: ['Rice', 'Urad dal', 'Grated coconut', 'Ginger'], servingSizeGrams: 180, foodGroups: ['cereals', 'pulses'], estimatedCostPerServing: 10, isVegetarian: true, allergenInfo: [], rationaleNote: 'Fermented food; improves iron and mineral absorption. Provides cereals and pulses.', preparationNotes: 'Steam idlis; serve with freshly made coconut chutney. Avoid spicy chutney for young children.' },
  { dishName: 'Ragi Dosa', mealCategory: 'breakfast', ingredients: ['Ragi flour', 'Rice flour', 'Onion', 'Coriander', 'Oil'], servingSizeGrams: 150, foodGroups: ['cereals'], estimatedCostPerServing: 7, isVegetarian: true, allergenInfo: [], rationaleNote: 'High-calcium ragi in a familiar format; easy for children to eat.', preparationNotes: 'Mix ragi and rice flour; make thin dosas on a non-stick pan with minimal oil.' },
  { dishName: 'Upma', mealCategory: 'breakfast', ingredients: ['Semolina (rava)', 'Onion', 'Peas', 'Carrot', 'Mustard seeds', 'Oil'], servingSizeGrams: 150, foodGroups: ['cereals', 'vegetables'], estimatedCostPerServing: 8, isVegetarian: true, allergenInfo: ['wheat'], rationaleNote: 'Semolina with vegetables provides cereals and some micronutrients in one dish.', preparationNotes: 'Roast semolina lightly; cook with water and vegetables. Mild seasoning suitable for children.' },
  { dishName: 'Poha with Vegetables', mealCategory: 'breakfast', ingredients: ['Flattened rice (poha)', 'Potato', 'Onion', 'Peas', 'Mustard seeds', 'Turmeric', 'Oil'], servingSizeGrams: 150, foodGroups: ['cereals', 'vegetables'], estimatedCostPerServing: 7, isVegetarian: true, allergenInfo: [], rationaleNote: 'Flattened rice is iron-fortified; easy to digest and popular with children.', preparationNotes: 'Wash poha; temper spices and add vegetables; mix gently. Light and easy to digest.' },

  // Morning snack
  { dishName: 'Banana', mealCategory: 'morning_snack', ingredients: ['Banana'], servingSizeGrams: 80, foodGroups: ['fruits'], estimatedCostPerServing: 4, isVegetarian: true, allergenInfo: [], rationaleNote: 'Widely available, affordable; provides natural energy and potassium.', preparationNotes: 'Peel and serve. Easy for children to eat independently.' },
  { dishName: 'Papaya Slices', mealCategory: 'morning_snack', ingredients: ['Papaya'], servingSizeGrams: 100, foodGroups: ['fruits'], estimatedCostPerServing: 5, isVegetarian: true, allergenInfo: [], rationaleNote: 'Rich in vitamin A and C; seasonal fruit good for immunity.', preparationNotes: 'Peel, deseed, and cut into small pieces suitable for the child\'s age.' },
  { dishName: 'Boiled Sweet Potato', mealCategory: 'morning_snack', ingredients: ['Sweet potato'], servingSizeGrams: 80, foodGroups: ['vegetables'], estimatedCostPerServing: 4, isVegetarian: true, allergenInfo: [], rationaleNote: 'Excellent source of beta-carotene (vitamin A); naturally sweet and filling.', preparationNotes: 'Boil until soft; mash for younger children. Can be served plain.' },
  { dishName: 'Chikki (Sesame)', mealCategory: 'morning_snack', ingredients: ['Sesame seeds', 'Jaggery'], servingSizeGrams: 30, foodGroups: ['fats_oils'], estimatedCostPerServing: 5, isVegetarian: true, allergenInfo: ['sesame'], rationaleNote: 'Sesame seeds are rich in calcium; jaggery provides iron.', preparationNotes: 'Ensure pieces are size-appropriate to avoid choking. Not suitable for children under 3 years.' },

  // Lunch options
  { dishName: 'Rice with Sambar and Carrot Sabzi', mealCategory: 'lunch', ingredients: ['Rice', 'Toor dal', 'Carrot', 'Onion', 'Tomato', 'Tamarind', 'Oil', 'Spices'], servingSizeGrams: 250, foodGroups: ['cereals', 'pulses', 'vegetables'], estimatedCostPerServing: 18, isVegetarian: true, allergenInfo: [], rationaleNote: 'Rice + dal provides complementary proteins; sambar with vegetables adds micronutrients.', preparationNotes: 'Mild sambar; avoid excess tamarind and spices for young children.' },
  { dishName: 'Roti with Moong Dal and Spinach Curry', mealCategory: 'lunch', ingredients: ['Whole wheat flour', 'Moong dal', 'Spinach', 'Onion', 'Tomato', 'Oil', 'Spices'], servingSizeGrams: 250, foodGroups: ['cereals', 'pulses', 'vegetables'], estimatedCostPerServing: 16, isVegetarian: true, allergenInfo: ['wheat'], rationaleNote: 'Spinach provides iron; vitamin C from tomato improves absorption. Whole wheat adds fibre.', preparationNotes: 'Soft rotis; dal cooked until very soft. Remove large spice pieces before serving.' },
  { dishName: 'Khichdi with Vegetables', mealCategory: 'lunch', ingredients: ['Rice', 'Moong dal', 'Carrot', 'Beans', 'Peas', 'Turmeric', 'Ghee'], servingSizeGrams: 250, foodGroups: ['cereals', 'pulses', 'vegetables'], estimatedCostPerServing: 14, isVegetarian: true, allergenInfo: [], rationaleNote: 'One-pot meal providing cereals, pulses, and vegetables. Easy to digest and liked by children.', preparationNotes: 'Cook to a soft consistency. Ghee adds fat-soluble vitamins. Ideal for all age groups.' },
  { dishName: 'Rice with Rajma Curry', mealCategory: 'lunch', ingredients: ['Rice', 'Rajma (kidney beans)', 'Onion', 'Tomato', 'Ginger', 'Garlic', 'Oil', 'Spices'], servingSizeGrams: 250, foodGroups: ['cereals', 'pulses'], estimatedCostPerServing: 17, isVegetarian: true, allergenInfo: [], rationaleNote: 'Rajma is high in protein and fibre; pairs well with rice for complete nutrition.', preparationNotes: 'Cook rajma until very soft. Mild seasoning. Soak overnight to improve digestibility.' },
  { dishName: 'Roti with Palak Paneer', mealCategory: 'lunch', ingredients: ['Whole wheat flour', 'Spinach', 'Paneer', 'Onion', 'Tomato', 'Spices', 'Oil'], servingSizeGrams: 250, foodGroups: ['cereals', 'vegetables', 'dairy', 'protein'], estimatedCostPerServing: 22, isVegetarian: true, allergenInfo: ['milk', 'wheat'], rationaleNote: 'Paneer adds high-quality protein and calcium; spinach provides iron. Nutritious combination.', preparationNotes: 'Soft rotis. Mild palak paneer gravy. Remove excess spices for younger children.' },

  // Afternoon snack
  { dishName: 'Curd Rice (small portion)', mealCategory: 'afternoon_snack', ingredients: ['Rice', 'Curd', 'Mustard seeds', 'Grated ginger', 'Salt'], servingSizeGrams: 100, foodGroups: ['cereals', 'dairy'], estimatedCostPerServing: 6, isVegetarian: true, allergenInfo: ['milk'], rationaleNote: 'Probiotic-rich curd helps gut health; light and easy to digest in the afternoon.', preparationNotes: 'Mix cold curd with slightly warm rice. Season very mildly.' },
  { dishName: 'Roasted Chana', mealCategory: 'afternoon_snack', ingredients: ['Roasted chickpea (chana)'], servingSizeGrams: 40, foodGroups: ['pulses', 'protein'], estimatedCostPerServing: 4, isVegetarian: true, allergenInfo: [], rationaleNote: 'Protein and fibre-rich snack; affordable and keeps children full.', preparationNotes: 'Serve whole chana only to children 3+ years. For younger children, grind into fine powder and mix into porridge.' },
  { dishName: 'Guava', mealCategory: 'afternoon_snack', ingredients: ['Guava'], servingSizeGrams: 80, foodGroups: ['fruits'], estimatedCostPerServing: 4, isVegetarian: true, allergenInfo: [], rationaleNote: 'Guava is extremely high in vitamin C; helps iron absorption from other foods.', preparationNotes: 'Wash well. Remove seeds for younger children. Cut into small pieces.' },
];

export function suggestMeals(options: {
  ageGroup: AgeGroup;
  mealCategory: MealCategory;
  isVegetarian: boolean;
  allergies: string[];
  childrenAllergies?: string[][];
  budget?: number;
}): MealSuggestion[] {
  const { mealCategory, isVegetarian, allergies, budget } = options;
  const allAllergies = [
    ...allergies.map((a) => a.toLowerCase()),
    ...(options.childrenAllergies?.flat().map((a) => a.toLowerCase()) ?? []),
  ];

  return MEAL_DATABASE.filter((meal) => {
    if (meal.mealCategory !== mealCategory) return false;
    if (isVegetarian && !meal.isVegetarian) return false;
    if (budget !== undefined && meal.estimatedCostPerServing > budget) return false;
    // Check allergen safety
    const hasConflict = meal.allergenInfo.some((allergen) =>
      allAllergies.some((a) => allergen.toLowerCase().includes(a) || a.includes(allergen.toLowerCase()))
    );
    if (hasConflict) return false;
    return true;
  });
}

export function getMealCategoryLabel(category: MealCategory): string {
  const labels: Record<MealCategory, string> = {
    breakfast: 'Breakfast',
    morning_snack: 'Morning Snack',
    lunch: 'Lunch',
    afternoon_snack: 'Afternoon Snack',
    dinner: 'Dinner',
  };
  return labels[category] || category;
}

export function checkAllergenConflict(ingredients: string[], childAllergies: string[]): string[] {
  const conflicts: string[] = [];
  childAllergies.forEach((allergy) => {
    const a = allergy.toLowerCase();
    ingredients.forEach((ingredient) => {
      if (ingredient.toLowerCase().includes(a) || a.includes(ingredient.toLowerCase().split(' ')[0])) {
        conflicts.push(`${ingredient} may conflict with ${allergy} allergy`);
      }
    });
  });
  return conflicts;
}

// Calculate ingredient quantities for multiple servings
export function scaleIngredients(ingredients: string[], baseServings: number, targetServings: number): string[] {
  if (baseServings === 0) return ingredients;
  const scale = targetServings / baseServings;
  return ingredients.map((ing) => {
    const match = ing.match(/^(\d+(?:\.\d+)?)\s*(.+)$/);
    if (match) {
      const scaled = (parseFloat(match[1]) * scale).toFixed(1).replace(/\.0$/, '');
      return `${scaled} ${match[2]}`;
    }
    return ing;
  });
}
