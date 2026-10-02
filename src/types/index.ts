// =============================================================================
// NUTRICARE — CHILD NUTRITION & MEAL PLANNING SYSTEM — TYPE DEFINITIONS
// All interfaces follow the data model specified in the project brief.
// =============================================================================

export type UserRole = 'worker' | 'supervisor' | 'parent';

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  centreId: string;
  linkedChildId?: string; // for parent role
}

export interface DemoSession {
  user: DemoUser;
  loginTime: string;
  expiresAt: string;
}

// ---------------------------------------------------------------------------
// Centre / Settings
// ---------------------------------------------------------------------------
export interface CentreSettings {
  id: string;
  centreName: string;
  centreLocation: string;
  workerDisplayName: string;
  preferredLanguage: 'en' | 'kn' | 'hi';
  defaultServingBudget: number; // INR per serving
  mealCategories: string[];
  notificationsEnabled: boolean;
  lastUpdated: string;
}

// ---------------------------------------------------------------------------
// Child
// ---------------------------------------------------------------------------
export type Sex = 'male' | 'female';
export type ChildStatus = 'active' | 'inactive' | 'transferred';

export interface Child {
  id: string;
  childId: string; // human-readable unique ID e.g. AWC-001
  fullName: string;
  dateOfBirth: string; // ISO date string
  sex: Sex;
  centreId: string;
  parentName: string;
  contactNumber?: string;
  address?: string;
  dietaryRestrictions: string[];
  allergies: string[];
  feedingNotes?: string;
  registrationDate: string;
  status: ChildStatus;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Growth Measurement
// ---------------------------------------------------------------------------
export type GrowthStatus = 'normal' | 'monitor' | 'review' | 'unknown';

export interface GrowthMeasurement {
  id: string;
  childId: string;
  measurementDate: string; // ISO date
  weightKg: number;
  heightCm: number;
  notes?: string;
  recordedBy: string; // worker name
  // Computed flags (set at entry time)
  weightForAgeStatus?: GrowthStatus;
  heightForAgeStatus?: GrowthStatus;
  interpretationNote?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Food / Meal
// ---------------------------------------------------------------------------
export type MealCategory = 'breakfast' | 'morning_snack' | 'lunch' | 'afternoon_snack' | 'dinner';
export type AgeGroup = '6-12m' | '1-2y' | '2-3y' | '3-5y' | '5-6y';
export type FoodGroup = 'cereals' | 'pulses' | 'dairy' | 'vegetables' | 'fruits' | 'fats_oils' | 'protein' | 'other';

export interface FoodItem {
  id: string;
  name: string;
  localName?: string;
  foodGroups: FoodGroup[];
  isVegetarian: boolean;
  commonAllergens: string[];
  ageGroups: AgeGroup[];
  servingSizeGrams: number;
  estimatedCostPerServing: number; // INR
  availability: 'common' | 'seasonal' | 'rare';
  preparationTime: number; // minutes
}

export interface MealPlanEntry {
  id: string;
  mealPlanId: string;
  dayOfWeek: number; // 0=Mon … 6=Sun
  date?: string; // ISO date if specific
  mealCategory: MealCategory;
  dishName: string;
  ingredients: string[];
  servingSizeGrams: number;
  servingsTarget: number;
  foodGroups: FoodGroup[];
  estimatedCostPerServing: number;
  preparationNotes?: string;
  allergenInfo: string[];
  rationaleNote?: string; // why this meal was suggested
  isVegetarian: boolean;
}

export interface MealPlan {
  id: string;
  planName: string;
  ageGroup: AgeGroup;
  weekStartDate: string; // ISO Monday date
  entries: MealPlanEntry[];
  isVegetarian: boolean;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Meal Distribution
// ---------------------------------------------------------------------------
export interface MealDistributionRecord {
  id: string;
  date: string; // ISO date
  mealCategory: MealCategory;
  plannedDish: string;
  actualDish: string;
  targetServings: number;
  actualServings: number;
  wastedServings?: number;
  substitutions?: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Follow-up
// ---------------------------------------------------------------------------
export type FollowUpReason =
  | 'measurement_due'
  | 'missing_records'
  | 'professional_review'
  | 'caregiver_meeting'
  | 'post_referral'
  | 'meal_concern'
  | 'other';

export type FollowUpStatus = 'open' | 'in_progress' | 'completed';
export type FollowUpPriority = 'high' | 'medium' | 'low';

export interface FollowUpTask {
  id: string;
  childId: string;
  reason: FollowUpReason;
  createdDate: string; // ISO date
  dueDate: string; // ISO date
  priority: FollowUpPriority;
  assignedTo: string; // worker name
  notes?: string;
  status: FollowUpStatus;
  resolutionNotes?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Nutrition Education
// ---------------------------------------------------------------------------
export type Language = 'en' | 'kn' | 'hi';

export interface EducationArticle {
  id: string;
  slug: string;
  titleEn: string;
  titleKn?: string;
  titleHi?: string;
  bodyEn: string;
  bodyKn?: string;
  bodyHi?: string;
  category: 'balanced_diet' | 'hygiene' | 'feeding_practices' | 'food_safety' | 'when_to_seek_help';
  targetAudience: ('worker' | 'parent')[];
  source: string;
  lastReviewed: string; // ISO date
  tags: string[];
}

// ---------------------------------------------------------------------------
// Dashboard / Computed types
// ---------------------------------------------------------------------------
export interface DashboardMetrics {
  totalChildren: number;
  activeChildren: number;
  measurementsDue: number;
  mealsDistributedToday: number;
  pendingFollowUps: number;
  recentMeasurements: GrowthMeasurement[];
  recentActivity: ActivityItem[];
  weeklyDistribution: WeeklyDistributionPoint[];
  upcomingReminders: FollowUpTask[];
}

export interface ActivityItem {
  id: string;
  type: 'child_registered' | 'measurement_recorded' | 'meal_planned' | 'distribution_recorded' | 'followup_created' | 'followup_completed';
  description: string;
  timestamp: string;
  childId?: string;
  childName?: string;
}

export interface WeeklyDistributionPoint {
  date: string;
  label: string;
  breakfast: number;
  lunch: number;
  snack: number;
}

// ---------------------------------------------------------------------------
// Data store versioning
// ---------------------------------------------------------------------------
export interface DataStore {
  version: number;
  children: Child[];
  growthMeasurements: GrowthMeasurement[];
  mealPlans: MealPlan[];
  distributionRecords: MealDistributionRecord[];
  followUpTasks: FollowUpTask[];
  educationArticles: EducationArticle[];
  settings: CentreSettings;
  activityLog: ActivityItem[];
  isSeeded: boolean;
}
