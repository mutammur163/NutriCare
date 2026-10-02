// =============================================================================
// DEMO SEED DATA — FICTIONAL RECORDS FOR DEMONSTRATION
// All names, IDs, and measurements are entirely fictional.
// These records do not represent any real children or beneficiaries.
// =============================================================================

import type {
  Child,
  GrowthMeasurement,
  MealPlan,
  MealDistributionRecord,
  FollowUpTask,
  EducationArticle,
  CentreSettings,
  ActivityItem,
} from '../types';

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
export const defaultSettings: CentreSettings = {
  id: 'settings-01',
  centreName: 'NutriCare Centre No. 14',
  centreLocation: 'Jayanagar Ward, Bengaluru, Karnataka',
  workerDisplayName: 'Lakshmi Devi',
  preferredLanguage: 'en',
  defaultServingBudget: 15,
  mealCategories: ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack'],
  notificationsEnabled: true,
  lastUpdated: '2026-09-15T00:00:00.000Z',
};

// ---------------------------------------------------------------------------
// Children (15 fictional records)
// ---------------------------------------------------------------------------
export const seedChildren: Child[] = [
  {
    id: 'child-001',
    childId: 'AWC14-001',
    fullName: 'Aarav Sharma',
    dateOfBirth: '2022-03-10',
    sex: 'male',
    centreId: 'centre-01',
    parentName: 'Sunita Sharma',
    contactNumber: '9876500001',
    address: '12, 5th Cross, Jayanagar, Bengaluru',
    dietaryRestrictions: [],
    allergies: [],
    feedingNotes: 'Prefers soft foods. Good appetite.',
    registrationDate: '2024-04-01',
    status: 'active',
    createdAt: '2024-04-01T08:00:00.000Z',
    updatedAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'child-002',
    childId: 'AWC14-002',
    fullName: 'Priya Reddy',
    dateOfBirth: '2021-07-22',
    sex: 'female',
    centreId: 'centre-01',
    parentName: 'Kavitha Reddy',
    contactNumber: '9876500002',
    dietaryRestrictions: ['vegetarian'],
    allergies: ['peanuts'],
    feedingNotes: 'Peanut allergy confirmed. Avoid groundnut oil.',
    registrationDate: '2024-01-15',
    status: 'active',
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2026-09-18T10:00:00.000Z',
  },
  {
    id: 'child-003',
    childId: 'AWC14-003',
    fullName: 'Rohan Patil',
    dateOfBirth: '2023-01-05',
    sex: 'male',
    centreId: 'centre-01',
    parentName: 'Anita Patil',
    contactNumber: '9876500003',
    dietaryRestrictions: [],
    allergies: [],
    registrationDate: '2024-06-10',
    status: 'active',
    createdAt: '2024-06-10T08:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
  {
    id: 'child-004',
    childId: 'AWC14-004',
    fullName: 'Meera Nair',
    dateOfBirth: '2020-11-30',
    sex: 'female',
    centreId: 'centre-01',
    parentName: 'Sujatha Nair',
    contactNumber: '9876500004',
    dietaryRestrictions: ['vegetarian'],
    allergies: [],
    registrationDate: '2023-12-01',
    status: 'active',
    createdAt: '2023-12-01T08:00:00.000Z',
    updatedAt: '2026-09-22T10:00:00.000Z',
  },
  {
    id: 'child-005',
    childId: 'AWC14-005',
    fullName: 'Karan Singh',
    dateOfBirth: '2022-08-15',
    sex: 'male',
    centreId: 'centre-01',
    parentName: 'Manjeet Singh',
    contactNumber: '9876500005',
    dietaryRestrictions: [],
    allergies: ['milk'],
    feedingNotes: 'Lactose intolerance. Use soy or plant-based alternatives.',
    registrationDate: '2024-08-20',
    status: 'active',
    createdAt: '2024-08-20T08:00:00.000Z',
    updatedAt: '2026-09-15T10:00:00.000Z',
  },
  {
    id: 'child-006',
    childId: 'AWC14-006',
    fullName: 'Divya Iyer',
    dateOfBirth: '2021-04-18',
    sex: 'female',
    centreId: 'centre-01',
    parentName: 'Lakshmi Iyer',
    contactNumber: '9876500006',
    dietaryRestrictions: ['vegetarian'],
    allergies: [],
    registrationDate: '2024-05-01',
    status: 'active',
    createdAt: '2024-05-01T08:00:00.000Z',
    updatedAt: '2026-09-25T10:00:00.000Z',
  },
  {
    id: 'child-007',
    childId: 'AWC14-007',
    fullName: 'Arjun Verma',
    dateOfBirth: '2023-05-20',
    sex: 'male',
    centreId: 'centre-01',
    parentName: 'Geeta Verma',
    contactNumber: '9876500007',
    dietaryRestrictions: [],
    allergies: [],
    registrationDate: '2024-09-01',
    status: 'active',
    createdAt: '2024-09-01T08:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'child-008',
    childId: 'AWC14-008',
    fullName: 'Sneha Joshi',
    dateOfBirth: '2020-06-12',
    sex: 'female',
    centreId: 'centre-01',
    parentName: 'Rekha Joshi',
    contactNumber: '9876500008',
    dietaryRestrictions: ['vegetarian'],
    allergies: [],
    registrationDate: '2023-07-15',
    status: 'active',
    createdAt: '2023-07-15T08:00:00.000Z',
    updatedAt: '2026-09-28T10:00:00.000Z',
  },
  {
    id: 'child-009',
    childId: 'AWC14-009',
    fullName: 'Vikram Rao',
    dateOfBirth: '2022-12-01',
    sex: 'male',
    centreId: 'centre-01',
    parentName: 'Usha Rao',
    contactNumber: '9876500009',
    dietaryRestrictions: [],
    allergies: [],
    registrationDate: '2024-12-15',
    status: 'active',
    createdAt: '2024-12-15T08:00:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'child-010',
    childId: 'AWC14-010',
    fullName: 'Ananya Pillai',
    dateOfBirth: '2021-09-08',
    sex: 'female',
    centreId: 'centre-01',
    parentName: 'Radha Pillai',
    contactNumber: '9876500010',
    dietaryRestrictions: ['vegetarian'],
    allergies: ['eggs'],
    registrationDate: '2024-10-01',
    status: 'active',
    createdAt: '2024-10-01T08:00:00.000Z',
    updatedAt: '2026-09-12T10:00:00.000Z',
  },
  {
    id: 'child-011',
    childId: 'AWC14-011',
    fullName: 'Rahul Gowda',
    dateOfBirth: '2020-02-14',
    sex: 'male',
    centreId: 'centre-01',
    parentName: 'Savitha Gowda',
    contactNumber: '9876500011',
    dietaryRestrictions: [],
    allergies: [],
    registrationDate: '2023-03-01',
    status: 'active',
    createdAt: '2023-03-01T08:00:00.000Z',
    updatedAt: '2026-09-30T10:00:00.000Z',
  },
  {
    id: 'child-012',
    childId: 'AWC14-012',
    fullName: 'Nisha Kulkarni',
    dateOfBirth: '2023-08-25',
    sex: 'female',
    centreId: 'centre-01',
    parentName: 'Prabhavati Kulkarni',
    contactNumber: '9876500012',
    dietaryRestrictions: ['vegetarian'],
    allergies: [],
    registrationDate: '2025-09-10',
    status: 'active',
    createdAt: '2025-09-10T08:00:00.000Z',
    updatedAt: '2026-09-10T10:00:00.000Z',
  },
  {
    id: 'child-013',
    childId: 'AWC14-013',
    fullName: 'Aditya Bhat',
    dateOfBirth: '2022-06-30',
    sex: 'male',
    centreId: 'centre-01',
    parentName: 'Shantha Bhat',
    contactNumber: '9876500013',
    dietaryRestrictions: [],
    allergies: [],
    registrationDate: '2024-07-01',
    status: 'active',
    createdAt: '2024-07-01T08:00:00.000Z',
    updatedAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'child-014',
    childId: 'AWC14-014',
    fullName: 'Pooja Mishra',
    dateOfBirth: '2021-12-20',
    sex: 'female',
    centreId: 'centre-01',
    parentName: 'Kamla Mishra',
    contactNumber: '9876500014',
    dietaryRestrictions: ['vegetarian'],
    allergies: [],
    registrationDate: '2024-01-05',
    status: 'active',
    createdAt: '2024-01-05T08:00:00.000Z',
    updatedAt: '2026-09-25T10:00:00.000Z',
  },
  {
    id: 'child-015',
    childId: 'AWC14-015',
    fullName: 'Suresh Naidu',
    dateOfBirth: '2020-09-03',
    sex: 'male',
    centreId: 'centre-01',
    parentName: 'Vimala Naidu',
    contactNumber: '9876500015',
    dietaryRestrictions: [],
    allergies: [],
    registrationDate: '2023-10-01',
    status: 'inactive',
    createdAt: '2023-10-01T08:00:00.000Z',
    updatedAt: '2026-08-15T10:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Growth Measurements (multiple per selected children)
// ---------------------------------------------------------------------------
export const seedGrowthMeasurements: GrowthMeasurement[] = [
  // Aarav Sharma (child-001) — born 2022-03-10
  { id: 'gm-001', childId: 'child-001', measurementDate: '2025-03-15', weightKg: 11.2, heightCm: 86.5, notes: 'Routine measurement', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2025-03-15T09:00:00.000Z', updatedAt: '2025-03-15T09:00:00.000Z' },
  { id: 'gm-002', childId: 'child-001', measurementDate: '2025-06-15', weightKg: 11.8, heightCm: 89.0, notes: '', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2025-06-15T09:00:00.000Z', updatedAt: '2025-06-15T09:00:00.000Z' },
  { id: 'gm-003', childId: 'child-001', measurementDate: '2025-09-20', weightKg: 12.3, heightCm: 91.2, notes: 'Good progress', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2025-09-20T09:00:00.000Z', updatedAt: '2025-09-20T09:00:00.000Z' },
  { id: 'gm-004', childId: 'child-001', measurementDate: '2026-01-10', weightKg: 12.8, heightCm: 93.0, notes: '', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2026-01-10T09:00:00.000Z', updatedAt: '2026-01-10T09:00:00.000Z' },
  { id: 'gm-005', childId: 'child-001', measurementDate: '2026-05-12', weightKg: 13.1, heightCm: 95.5, notes: '', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2026-05-12T09:00:00.000Z', updatedAt: '2026-05-12T09:00:00.000Z' },
  { id: 'gm-006', childId: 'child-001', measurementDate: '2026-09-15', weightKg: 13.5, heightCm: 97.0, notes: 'Steady growth', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2026-09-15T09:00:00.000Z', updatedAt: '2026-09-15T09:00:00.000Z' },

  // Priya Reddy (child-002) — born 2021-07-22
  { id: 'gm-007', childId: 'child-002', measurementDate: '2025-04-01', weightKg: 13.5, heightCm: 96.0, notes: 'Peanut allergy noted', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2025-04-01T09:00:00.000Z', updatedAt: '2025-04-01T09:00:00.000Z' },
  { id: 'gm-008', childId: 'child-002', measurementDate: '2025-08-05', weightKg: 13.8, heightCm: 98.5, notes: '', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2025-08-05T09:00:00.000Z', updatedAt: '2025-08-05T09:00:00.000Z' },
  { id: 'gm-009', childId: 'child-002', measurementDate: '2026-01-20', weightKg: 14.2, heightCm: 100.5, notes: '', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2026-01-20T09:00:00.000Z', updatedAt: '2026-01-20T09:00:00.000Z' },
  { id: 'gm-010', childId: 'child-002', measurementDate: '2026-09-18', weightKg: 15.0, heightCm: 104.0, notes: 'Growing well', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2026-09-18T09:00:00.000Z', updatedAt: '2026-09-18T09:00:00.000Z' },

  // Rohan Patil (child-003) — born 2023-01-05 — younger child, needs monitoring
  { id: 'gm-011', childId: 'child-003', measurementDate: '2025-06-10', weightKg: 8.9, heightCm: 75.0, notes: 'Slightly below expected for age', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'monitor', heightForAgeStatus: 'monitor', interpretationNote: 'Weight and height slightly below median for age; monitor closely and schedule follow-up in 4 weeks.', createdAt: '2025-06-10T09:00:00.000Z', updatedAt: '2025-06-10T09:00:00.000Z' },
  { id: 'gm-012', childId: 'child-003', measurementDate: '2025-10-15', weightKg: 9.5, heightCm: 78.5, notes: 'Improved', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'monitor', createdAt: '2025-10-15T09:00:00.000Z', updatedAt: '2025-10-15T09:00:00.000Z' },
  { id: 'gm-013', childId: 'child-003', measurementDate: '2026-04-10', weightKg: 10.2, heightCm: 82.0, notes: '', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2026-04-10T09:00:00.000Z', updatedAt: '2026-04-10T09:00:00.000Z' },
  { id: 'gm-014', childId: 'child-003', measurementDate: '2026-09-10', weightKg: 10.8, heightCm: 85.5, notes: 'Good recovery', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2026-09-10T09:00:00.000Z', updatedAt: '2026-09-10T09:00:00.000Z' },

  // Meera Nair (child-004) — born 2020-11-30 — older child
  { id: 'gm-015', childId: 'child-004', measurementDate: '2025-05-20', weightKg: 16.5, heightCm: 105.0, notes: '', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2025-05-20T09:00:00.000Z', updatedAt: '2025-05-20T09:00:00.000Z' },
  { id: 'gm-016', childId: 'child-004', measurementDate: '2025-11-20', weightKg: 17.2, heightCm: 108.0, notes: '', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2025-11-20T09:00:00.000Z', updatedAt: '2025-11-20T09:00:00.000Z' },
  { id: 'gm-017', childId: 'child-004', measurementDate: '2026-05-22', weightKg: 17.9, heightCm: 111.0, notes: '', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2026-05-22T09:00:00.000Z', updatedAt: '2026-05-22T09:00:00.000Z' },
  { id: 'gm-018', childId: 'child-004', measurementDate: '2026-09-22', weightKg: 18.3, heightCm: 112.5, notes: 'Well nourished', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2026-09-22T09:00:00.000Z', updatedAt: '2026-09-22T09:00:00.000Z' },

  // Karan Singh (child-005) — born 2022-08-15 — lactose intolerance
  { id: 'gm-019', childId: 'child-005', measurementDate: '2025-09-01', weightKg: 11.0, heightCm: 86.0, notes: 'Dairy alternatives in use', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2025-09-01T09:00:00.000Z', updatedAt: '2025-09-01T09:00:00.000Z' },
  { id: 'gm-020', childId: 'child-005', measurementDate: '2026-03-01', weightKg: 11.8, heightCm: 89.5, notes: '', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2026-03-01T09:00:00.000Z', updatedAt: '2026-03-01T09:00:00.000Z' },
  { id: 'gm-021', childId: 'child-005', measurementDate: '2026-09-15', weightKg: 12.5, heightCm: 92.0, notes: '', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2026-09-15T09:00:00.000Z', updatedAt: '2026-09-15T09:00:00.000Z' },

  // Rahul Gowda (child-011) — review required
  { id: 'gm-022', childId: 'child-011', measurementDate: '2026-07-10', weightKg: 14.2, heightCm: 102.0, notes: '', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2026-07-10T09:00:00.000Z', updatedAt: '2026-07-10T09:00:00.000Z' },
  { id: 'gm-023', childId: 'child-011', measurementDate: '2026-09-30', weightKg: 14.8, heightCm: 104.0, notes: 'Measurement current', recordedBy: 'Lakshmi Devi', weightForAgeStatus: 'normal', heightForAgeStatus: 'normal', createdAt: '2026-09-30T09:00:00.000Z', updatedAt: '2026-09-30T09:00:00.000Z' },
];

// ---------------------------------------------------------------------------
// Meal Plans
// ---------------------------------------------------------------------------
export const seedMealPlans: MealPlan[] = [
  {
    id: 'mp-001',
    planName: 'Standard Weekly Plan (3–5 Years)',
    ageGroup: '3-5y',
    weekStartDate: '2026-09-28',
    isVegetarian: true,
    notes: 'Centre-provided meals. Vegetarian. Nut-free.',
    createdBy: 'Lakshmi Devi',
    createdAt: '2026-09-25T08:00:00.000Z',
    updatedAt: '2026-09-25T08:00:00.000Z',
    entries: [
      // Monday
      { id: 'mpe-001', mealPlanId: 'mp-001', dayOfWeek: 0, date: '2026-09-28', mealCategory: 'breakfast', dishName: 'Ragi Porridge', ingredients: ['Ragi flour', 'Jaggery', 'Water', 'Milk (small amount)'], servingSizeGrams: 150, servingsTarget: 15, foodGroups: ['cereals', 'dairy'], estimatedCostPerServing: 8, isVegetarian: true, allergenInfo: ['milk'], rationaleNote: 'Ragi is a locally available millet rich in calcium and iron, suitable for young children.' },
      { id: 'mpe-002', mealPlanId: 'mp-001', dayOfWeek: 0, date: '2026-09-28', mealCategory: 'morning_snack', dishName: 'Banana', ingredients: ['Banana'], servingSizeGrams: 80, servingsTarget: 15, foodGroups: ['fruits'], estimatedCostPerServing: 4, isVegetarian: true, allergenInfo: [], rationaleNote: 'Fruits provide natural sugars and vitamins. Bananas are widely available and affordable.' },
      { id: 'mpe-003', mealPlanId: 'mp-001', dayOfWeek: 0, date: '2026-09-28', mealCategory: 'lunch', dishName: 'Rice with Sambar and Carrot Sabzi', ingredients: ['Rice', 'Toor dal', 'Carrot', 'Onion', 'Tomato', 'Tamarind', 'Spices', 'Oil'], servingSizeGrams: 250, servingsTarget: 15, foodGroups: ['cereals', 'pulses', 'vegetables'], estimatedCostPerServing: 18, isVegetarian: true, allergenInfo: [], rationaleNote: 'Rice + dal combination provides complementary proteins. Sambar with vegetables adds micronutrients.' },
      { id: 'mpe-004', mealPlanId: 'mp-001', dayOfWeek: 0, date: '2026-09-28', mealCategory: 'afternoon_snack', dishName: 'Chikki (Sesame)', ingredients: ['Sesame seeds', 'Jaggery'], servingSizeGrams: 30, servingsTarget: 15, foodGroups: ['fats_oils', 'cereals'], estimatedCostPerServing: 5, isVegetarian: true, allergenInfo: ['sesame'], rationaleNote: 'Sesame seeds provide calcium and healthy fats.' },

      // Tuesday
      { id: 'mpe-005', mealPlanId: 'mp-001', dayOfWeek: 1, date: '2026-09-29', mealCategory: 'breakfast', dishName: 'Idli with Coconut Chutney', ingredients: ['Rice', 'Urad dal', 'Grated coconut', 'Ginger', 'Green chilli (mild)'], servingSizeGrams: 180, servingsTarget: 15, foodGroups: ['cereals', 'pulses'], estimatedCostPerServing: 10, isVegetarian: true, allergenInfo: [], rationaleNote: 'Fermented foods improve iron absorption. Idli is easy to digest for young children.' },
      { id: 'mpe-006', mealPlanId: 'mp-001', dayOfWeek: 1, date: '2026-09-29', mealCategory: 'morning_snack', dishName: 'Papaya Slices', ingredients: ['Papaya'], servingSizeGrams: 100, servingsTarget: 15, foodGroups: ['fruits'], estimatedCostPerServing: 5, isVegetarian: true, allergenInfo: [], rationaleNote: 'Papaya is rich in vitamin A and C, seasonal and affordable.' },
      { id: 'mpe-007', mealPlanId: 'mp-001', dayOfWeek: 1, date: '2026-09-29', mealCategory: 'lunch', dishName: 'Roti with Moong Dal and Spinach Curry', ingredients: ['Whole wheat flour', 'Moong dal', 'Spinach', 'Onion', 'Tomato', 'Oil', 'Spices'], servingSizeGrams: 250, servingsTarget: 15, foodGroups: ['cereals', 'pulses', 'vegetables'], estimatedCostPerServing: 16, isVegetarian: true, allergenInfo: ['wheat'], rationaleNote: 'Spinach provides iron; combining with vitamin C rich foods improves absorption.' },
      { id: 'mpe-008', mealPlanId: 'mp-001', dayOfWeek: 1, date: '2026-09-29', mealCategory: 'afternoon_snack', dishName: 'Boiled Sweet Potato', ingredients: ['Sweet potato'], servingSizeGrams: 80, servingsTarget: 15, foodGroups: ['vegetables'], estimatedCostPerServing: 4, isVegetarian: true, allergenInfo: [], rationaleNote: 'Sweet potato is an excellent source of beta-carotene (vitamin A) and is naturally sweet for children.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Meal Distribution Records
// ---------------------------------------------------------------------------
export const seedDistributionRecords: MealDistributionRecord[] = [
  { id: 'dr-001', date: '2026-09-28', mealCategory: 'breakfast', plannedDish: 'Ragi Porridge', actualDish: 'Ragi Porridge', targetServings: 15, actualServings: 14, wastedServings: 1, notes: 'One child absent', recordedBy: 'Lakshmi Devi', createdAt: '2026-09-28T09:30:00.000Z', updatedAt: '2026-09-28T09:30:00.000Z' },
  { id: 'dr-002', date: '2026-09-28', mealCategory: 'lunch', plannedDish: 'Rice with Sambar and Carrot Sabzi', actualDish: 'Rice with Sambar and Carrot Sabzi', targetServings: 15, actualServings: 15, notes: 'All present', recordedBy: 'Lakshmi Devi', createdAt: '2026-09-28T13:30:00.000Z', updatedAt: '2026-09-28T13:30:00.000Z' },
  { id: 'dr-003', date: '2026-09-29', mealCategory: 'breakfast', plannedDish: 'Idli with Coconut Chutney', actualDish: 'Idli with Coconut Chutney', targetServings: 15, actualServings: 13, wastedServings: 0, substitutions: 'Tomato chutney used instead (coconut unavailable)', notes: '', recordedBy: 'Lakshmi Devi', createdAt: '2026-09-29T09:30:00.000Z', updatedAt: '2026-09-29T09:30:00.000Z' },
  { id: 'dr-004', date: '2026-09-29', mealCategory: 'lunch', plannedDish: 'Roti with Moong Dal and Spinach Curry', actualDish: 'Roti with Moong Dal and Spinach Curry', targetServings: 15, actualServings: 15, notes: '', recordedBy: 'Lakshmi Devi', createdAt: '2026-09-29T13:30:00.000Z', updatedAt: '2026-09-29T13:30:00.000Z' },
  { id: 'dr-005', date: '2026-09-30', mealCategory: 'breakfast', plannedDish: 'Upma', actualDish: 'Upma', targetServings: 15, actualServings: 14, notes: '', recordedBy: 'Lakshmi Devi', createdAt: '2026-09-30T09:30:00.000Z', updatedAt: '2026-09-30T09:30:00.000Z' },
  { id: 'dr-006', date: '2026-09-30', mealCategory: 'lunch', plannedDish: 'Rice with Rajma Curry', actualDish: 'Rice with Rajma Curry', targetServings: 15, actualServings: 12, wastedServings: 0, notes: 'Three children had doctor appointment', recordedBy: 'Lakshmi Devi', createdAt: '2026-09-30T13:30:00.000Z', updatedAt: '2026-09-30T13:30:00.000Z' },
  { id: 'dr-007', date: '2026-10-01', mealCategory: 'breakfast', plannedDish: 'Ragi Dosa', actualDish: 'Ragi Dosa', targetServings: 15, actualServings: 15, notes: 'Full attendance', recordedBy: 'Lakshmi Devi', createdAt: '2026-10-01T09:30:00.000Z', updatedAt: '2026-10-01T09:30:00.000Z' },
  { id: 'dr-008', date: '2026-10-01', mealCategory: 'lunch', plannedDish: 'Khichdi with Vegetables', actualDish: 'Khichdi with Vegetables', targetServings: 15, actualServings: 15, notes: '', recordedBy: 'Lakshmi Devi', createdAt: '2026-10-01T13:30:00.000Z', updatedAt: '2026-10-01T13:30:00.000Z' },
  { id: 'dr-009', date: '2026-10-02', mealCategory: 'breakfast', plannedDish: 'Poha with Vegetables', actualDish: 'Poha with Vegetables', targetServings: 15, actualServings: 14, notes: '', recordedBy: 'Lakshmi Devi', createdAt: '2026-10-02T09:30:00.000Z', updatedAt: '2026-10-02T09:30:00.000Z' },
];

// ---------------------------------------------------------------------------
// Follow-Up Tasks
// ---------------------------------------------------------------------------
export const seedFollowUpTasks: FollowUpTask[] = [
  {
    id: 'fu-001',
    childId: 'child-003',
    reason: 'professional_review',
    createdDate: '2025-06-10',
    dueDate: '2025-07-10',
    priority: 'medium',
    assignedTo: 'Lakshmi Devi',
    notes: 'Weight slightly below median at June measurement. Refer to health worker for assessment.',
    status: 'completed',
    resolutionNotes: 'Visited by ANM on 2025-07-08. Dietary advice provided. Calcium supplementation started.',
    completedDate: '2025-07-08',
    createdAt: '2025-06-10T10:00:00.000Z',
    updatedAt: '2025-07-08T10:00:00.000Z',
  },
  {
    id: 'fu-002',
    childId: 'child-006',
    reason: 'measurement_due',
    createdDate: '2026-09-01',
    dueDate: '2026-10-05',
    priority: 'medium',
    assignedTo: 'Lakshmi Devi',
    notes: 'Last measurement was in July 2025. Growth record needs updating.',
    status: 'open',
    createdAt: '2026-09-01T10:00:00.000Z',
    updatedAt: '2026-09-01T10:00:00.000Z',
  },
  {
    id: 'fu-003',
    childId: 'child-007',
    reason: 'measurement_due',
    createdDate: '2026-09-05',
    dueDate: '2026-10-10',
    priority: 'low',
    assignedTo: 'Lakshmi Devi',
    notes: 'New enrollee. First growth measurement not yet recorded.',
    status: 'open',
    createdAt: '2026-09-05T10:00:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'fu-004',
    childId: 'child-009',
    reason: 'caregiver_meeting',
    createdDate: '2026-09-10',
    dueDate: '2026-09-30',
    priority: 'high',
    assignedTo: 'Lakshmi Devi',
    notes: 'Parent has not attended centre meetings. Child participation in meals irregular.',
    status: 'in_progress',
    createdAt: '2026-09-10T10:00:00.000Z',
    updatedAt: '2026-09-25T10:00:00.000Z',
  },
  {
    id: 'fu-005',
    childId: 'child-012',
    reason: 'missing_records',
    createdDate: '2026-09-12',
    dueDate: '2026-10-12',
    priority: 'low',
    assignedTo: 'Lakshmi Devi',
    notes: 'Contact number not verified. Address details incomplete.',
    status: 'open',
    createdAt: '2026-09-12T10:00:00.000Z',
    updatedAt: '2026-09-12T10:00:00.000Z',
  },
  {
    id: 'fu-006',
    childId: 'child-014',
    reason: 'meal_concern',
    createdDate: '2026-09-20',
    dueDate: '2026-10-05',
    priority: 'medium',
    assignedTo: 'Lakshmi Devi',
    notes: 'Child reportedly not eating lunch at centre. Parent to be consulted.',
    status: 'open',
    createdAt: '2026-09-20T10:00:00.000Z',
    updatedAt: '2026-09-20T10:00:00.000Z',
  },
];

// ---------------------------------------------------------------------------
// Education Articles
// ---------------------------------------------------------------------------
export const seedEducationArticles: EducationArticle[] = [
  {
    id: 'ea-001',
    slug: 'balanced-meals-children',
    titleEn: 'Balanced Meals for Young Children',
    titleKn: 'ಚಿಕ್ಕ ಮಕ್ಕಳಿಗೆ ಸಮತೋಲಿತ ಊಟ',
    titleHi: 'छोटे बच्चों के लिए संतुलित भोजन',
    bodyEn: `A balanced diet for children aged 1–6 years should include foods from all major food groups every day.

**Cereals and Grains** (e.g., rice, ragi, wheat, jowar): Provide energy. Serve 3–4 portions daily.

**Pulses and Legumes** (e.g., dal, rajma, chana): Provide protein and iron. Serve at least once daily.

**Vegetables** (especially dark green leafy vegetables like spinach, amaranth; and orange vegetables like carrot, pumpkin): Provide vitamins and minerals. Include at least 2 types daily.

**Fruits** (e.g., banana, papaya, guava, mango): Provide vitamins and natural sugars. One serving daily.

**Milk and Dairy** (e.g., milk, curd, paneer): Provide calcium for bone health. Serve daily if tolerated.

**Fats and Oils** (e.g., ghee, groundnut oil, coconut oil): Small amounts needed for energy and fat-soluble vitamins.

**Practical Tip**: A meal of rice or roti + dal + vegetable + small portion of curd covers most nutritional needs for young children.

*Source: National Institute of Nutrition, India. Dietary Guidelines for Indians (2024 edition).*`,
    bodyKn: `1–6 ವರ್ಷ ವಯಸ್ಸಿನ ಮಕ್ಕಳಿಗೆ ಪ್ರತಿದಿನ ಎಲ್ಲಾ ಪ್ರಮುಖ ಆಹಾರ ಗುಂಪುಗಳಿಂದ ಆಹಾರ ಸೇರಿರಬೇಕು.

**ಧಾನ್ಯಗಳು** (ಅಕ್ಕಿ, ರಾಗಿ, ಗೋಧಿ): ಶಕ್ತಿ ನೀಡುತ್ತದೆ. ದಿನಕ್ಕೆ 3–4 ಬಾರಿ ನೀಡಿ.

**ದ್ವಿದಳ ಧಾನ್ಯಗಳು** (ದಾಲ್, ರಾಜ್ಮಾ): ಪ್ರೋಟೀನ್ ಮತ್ತು ಕಬ್ಬಿಣ ನೀಡುತ್ತದೆ. ದಿನಕ್ಕೆ ಒಮ್ಮೆಯಾದರೂ ನೀಡಿ.

**ತರಕಾರಿಗಳು**: ವಿಟಮಿನ್ ಮತ್ತು ಖನಿಜಗಳನ್ನು ನೀಡುತ್ತದೆ. ದಿನಕ್ಕೆ 2 ವಿಧದ ತರಕಾರಿ ಸೇರಿಸಿ.`,
    bodyHi: `1–6 वर्ष की आयु के बच्चों के लिए हर दिन सभी प्रमुख खाद्य समूहों से भोजन मिलना चाहिए।

**अनाज** (चावल, रागी, गेहूं): ऊर्जा देते हैं। दिन में 3–4 बार दें।

**दालें और फलियां** (दाल, राजमा, चना): प्रोटीन और आयरन देती हैं। दिन में कम से कम एक बार दें।

**सब्जियां** (पालक, गाजर, कद्दू): विटामिन और खनिज देती हैं। दिन में 2 प्रकार की सब्जियां शामिल करें।`,
    category: 'balanced_diet',
    targetAudience: ['worker', 'parent'],
    source: 'National Institute of Nutrition, India. Dietary Guidelines for Indians (2024).',
    lastReviewed: '2026-06-01',
    tags: ['diet', 'food-groups', 'nutrition', 'children'],
  },
  {
    id: 'ea-002',
    slug: 'hand-hygiene-food-safety',
    titleEn: 'Handwashing and Food Safety',
    titleKn: 'ಕೈ ತೊಳೆಯುವಿಕೆ ಮತ್ತು ಆಹಾರ ಸುರಕ್ಷತೆ',
    titleHi: 'हाथ धोना और खाद्य सुरक्षा',
    bodyEn: `Good hand hygiene is one of the most effective ways to prevent illness in young children.

**When to wash hands:**
- Before preparing or serving food
- Before feeding a child
- After using the toilet or helping a child use the toilet
- After handling raw food, soil, or waste

**How to wash hands properly:**
1. Wet hands with clean water.
2. Apply soap.
3. Rub all surfaces of hands for at least 20 seconds.
4. Rinse thoroughly.
5. Dry with a clean cloth or air dry.

**Food Safety at the Centre:**
- Cook food thoroughly and serve immediately or store properly.
- Keep raw and cooked foods separate.
- Use clean water for washing vegetables and cooking.
- Do not serve foods that have been kept at room temperature for more than 2 hours.
- Check for allergen information before serving any food.

*Source: WHO Guidelines on Hand Hygiene in Health Care (adapted for community settings).*`,
    bodyKn: `ಉತ್ತಮ ಕೈ ನೈರ್ಮಲ್ಯವು ಮಕ್ಕಳಲ್ಲಿ ರೋಗವನ್ನು ತಡೆಗಟ್ಟಲು ಅತ್ಯಂತ ಪರಿಣಾಮಕಾರಿ ವಿಧಾನಗಳಲ್ಲಿ ಒಂದು.

**ಯಾವಾಗ ಕೈ ತೊಳೆಯಬೇಕು:**
- ಆಹಾರ ತಯಾರಿಸುವ ಮೊದಲು
- ಮಗುವಿಗೆ ಊಟ ಹಾಕುವ ಮೊದಲು
- ಶೌಚಾಲಯ ಬಳಸಿದ ನಂತರ`,
    bodyHi: `अच्छी हाथ स्वच्छता छोटे बच्चों में बीमारी रोकने के सबसे प्रभावी तरीकों में से एक है।

**हाथ कब धोएं:**
- खाना तैयार करने या परोसने से पहले
- बच्चे को खाना खिलाने से पहले
- शौचालय उपयोग के बाद`,
    category: 'hygiene',
    targetAudience: ['worker', 'parent'],
    source: 'WHO Guidelines on Hand Hygiene (adapted for community settings).',
    lastReviewed: '2026-06-01',
    tags: ['hygiene', 'food-safety', 'handwashing', 'prevention'],
  },
  {
    id: 'ea-003',
    slug: 'age-appropriate-feeding',
    titleEn: 'Age-Appropriate Feeding Practices',
    titleKn: 'ವಯಸ್ಸಿಗೆ ತಕ್ಕ ಆಹಾರ ಪದ್ಧತಿಗಳು',
    titleHi: 'उम्र के अनुसार भोजन की आदतें',
    bodyEn: `Feeding practices should match the child's developmental stage.

**6–12 Months:**
- Continue breastfeeding.
- Introduce soft mashed foods: rice water, mashed banana, soft dal.
- Start with 2 meals per day and increase gradually.
- Avoid salt, sugar, honey, and whole nuts.

**1–2 Years:**
- Continue breastfeeding if possible.
- Family foods (soft, not spicy) can be offered.
- 3 meals + 2 snacks per day.
- Include cereals, dal, soft-cooked vegetables, fruits, and dairy.

**2–3 Years:**
- 3 meals + 2 snacks daily.
- Child can eat most family foods.
- Ensure variety: different cereals, vegetables, and pulses each day.

**3–6 Years:**
- 3 meals + 2 snacks daily.
- Encourage self-feeding.
- Introduce new foods gradually.
- Avoid highly processed, salty, or sweet foods.

**Important:** Never force-feed a child. Responsive feeding (following the child's hunger cues) is recommended.

*Source: UNICEF/WHO Infant and Young Child Feeding Guidelines.*`,
    bodyKn: `ಆಹಾರ ಪದ್ಧತಿಗಳು ಮಗುವಿನ ಬೆಳವಣಿಗೆಯ ಹಂತಕ್ಕೆ ಹೊಂದಿಕೆಯಾಗಬೇಕು.

**6–12 ತಿಂಗಳು:**
- ಎದೆ ಹಾಲು ಮುಂದುವರಿಸಿ.
- ಮೃದು ಮಸೆದ ಆಹಾರ ಪ್ರಾರಂಭಿಸಿ.`,
    bodyHi: `भोजन की आदतें बच्चे के विकासात्मक चरण से मेल खानी चाहिए।

**6–12 महीने:**
- स्तनपान जारी रखें।
- नरम मसले हुए खाद्य पदार्थ शुरू करें।`,
    category: 'feeding_practices',
    targetAudience: ['worker', 'parent'],
    source: 'UNICEF/WHO Infant and Young Child Feeding Guidelines.',
    lastReviewed: '2026-06-01',
    tags: ['feeding', 'age-appropriate', 'infant', 'toddler'],
  },
  {
    id: 'ea-004',
    slug: 'locally-available-nutritious-foods',
    titleEn: 'Locally Available Nutritious Foods in Karnataka',
    titleKn: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಸ್ಥಳೀಯವಾಗಿ ಲಭ್ಯವಿರುವ ಪೌಷ್ಟಿಕ ಆಹಾರಗಳು',
    titleHi: 'कर्नाटक में स्थानीय रूप से उपलब्ध पोषक खाद्य पदार्थ',
    bodyEn: `Many nutritious foods are available locally and are affordable. This list highlights commonly available options:

**Rich in Iron:**
- Ragi (finger millet) — excellent local source of calcium and iron
- Horsegram (hurali) — pulses rich in iron
- Green leafy vegetables: amaranth (rajgira), drumstick leaves (moringa), fenugreek leaves
- Sesame seeds (til/ellu)

**Rich in Calcium:**
- Ragi
- Dairy: milk, curd, paneer
- Sesame seeds
- Green leafy vegetables

**Rich in Vitamin A:**
- Carrot, pumpkin, sweet potato (orange/yellow vegetables)
- Drumstick leaves
- Papaya, mango

**Rich in Protein:**
- Toor dal, moong dal, chana dal
- Horsegram
- Eggs (where appropriate)

**Affordable Energy Sources:**
- Rice, ragi, jowar (sorghum)
- Banana, sweet potato

**Practical Guidance:** Use a combination of at least 3 food groups per meal. Ragi + dal + green leafy vegetable + a seasonal fruit is an excellent combination that is both nutritious and affordable.

*Source: National Institute of Nutrition, India.*`,
    category: 'balanced_diet',
    targetAudience: ['worker', 'parent'],
    source: 'National Institute of Nutrition, India.',
    lastReviewed: '2026-06-01',
    tags: ['local-foods', 'affordable', 'Karnataka', 'iron', 'calcium', 'vitamin-A'],
  },
  {
    id: 'ea-005',
    slug: 'when-to-seek-help',
    titleEn: 'When to Consult a Health Professional',
    titleKn: 'ವೈದ್ಯರನ್ನು ಯಾವಾಗ ಸಂಪರ್ಕಿಸಬೇಕು',
    titleHi: 'स्वास्थ्य पेशेवर से कब परामर्श करें',
    bodyEn: `This application is a management and education tool. It does not provide medical diagnoses or treatment advice. Always consult a trained health professional for medical concerns.

**Seek medical help immediately if the child has:**
- Difficulty breathing
- High fever (temperature above 38.5°C / 101.3°F) that does not reduce with home measures
- Seizures or fits
- Loss of consciousness
- Severe vomiting or diarrhoea
- Signs of severe dehydration: sunken eyes, dry mouth, not urinating
- Swollen feet or face
- Obvious pain or distress

**Consult your Auxiliary Nurse Midwife (ANM) or doctor if:**
- The child has not gained weight over the past 2–3 months
- The child consistently refuses food or has a very poor appetite
- You notice swelling in the child's body
- The child seems very pale or tired
- There are recurrent infections
- You have concerns about a child's development

**At the centre level:**
- The NutriCare worker can record measurements and flag concerns.
- The worker can refer to the ANM for assessment.
- The ANM can refer to the Primary Health Centre (PHC) if needed.

Do not attempt to treat malnutrition at home without guidance from a health professional.

*Note: Growth monitoring at the centre level is for screening and tracking, not diagnosis.*`,
    category: 'when_to_seek_help',
    targetAudience: ['worker', 'parent'],
    source: 'Ministry of Health and Family Welfare, India. IYCF Guidelines.',
    lastReviewed: '2026-06-01',
    tags: ['health', 'when-to-seek-help', 'emergency', 'referral'],
  },
  {
    id: 'ea-006',
    slug: 'allergy-awareness',
    titleEn: 'Food Allergy Awareness',
    titleKn: 'ಆಹಾರ ಅಲರ್ಜಿ ಜಾಗೃತಿ',
    titleHi: 'खाद्य एलर्जी जागरूकता',
    bodyEn: `A food allergy occurs when the body's immune system reacts to a specific food protein. This is different from food intolerance (such as lactose intolerance).

**Common allergens in India (especially relevant for children):**
- **Peanuts (groundnuts)**: Common; can cause severe reactions in some children.
- **Tree nuts** (cashew, almond, walnut): Less common but potentially severe.
- **Cow's milk**: Relatively common in young children; often resolves with age.
- **Eggs**: Can cause skin reactions or digestive symptoms.
- **Wheat**: Can cause a reaction (different from celiac disease).
- **Sesame**: Used in til chikki, tahini, sesame oil.

**What to do if a child has a known allergy:**
1. Record the allergy clearly in the child's profile.
2. Check all meal ingredients before serving.
3. This application will flag meal plans that include allergens for registered children.
4. Inform all workers and caregivers about the allergy.
5. Know the signs of an allergic reaction: rash/hives, swelling, vomiting, difficulty breathing.
6. If a severe reaction is suspected, seek medical help immediately.

**Important:** Do not make assumptions about allergies. If unsure, consult the child's caregiver and the ANM.

*Source: Indian Academy of Paediatrics. Food Allergy Guidelines.*`,
    category: 'food_safety',
    targetAudience: ['worker', 'parent'],
    source: 'Indian Academy of Paediatrics. Food Allergy Guidelines.',
    lastReviewed: '2026-06-01',
    tags: ['allergy', 'food-safety', 'peanuts', 'milk', 'eggs'],
  },
];

// ---------------------------------------------------------------------------
// Activity Log (seed items)
// ---------------------------------------------------------------------------
export const seedActivityLog: ActivityItem[] = [
  { id: 'act-001', type: 'child_registered', description: 'Child Aarav Sharma (AWC14-001) registered', timestamp: '2024-04-01T08:00:00.000Z', childId: 'child-001', childName: 'Aarav Sharma' },
  { id: 'act-002', type: 'measurement_recorded', description: 'Growth measurement recorded for Aarav Sharma', timestamp: '2026-09-15T09:00:00.000Z', childId: 'child-001', childName: 'Aarav Sharma' },
  { id: 'act-003', type: 'measurement_recorded', description: 'Growth measurement recorded for Priya Reddy', timestamp: '2026-09-18T09:00:00.000Z', childId: 'child-002', childName: 'Priya Reddy' },
  { id: 'act-004', type: 'distribution_recorded', description: 'Meal distribution recorded: Breakfast (28 Sep)', timestamp: '2026-09-28T09:30:00.000Z' },
  { id: 'act-005', type: 'distribution_recorded', description: 'Meal distribution recorded: Lunch (28 Sep)', timestamp: '2026-09-28T13:30:00.000Z' },
  { id: 'act-006', type: 'followup_created', description: 'Follow-up created for Vikram Rao (caregiver meeting)', timestamp: '2026-09-10T10:00:00.000Z', childId: 'child-009', childName: 'Vikram Rao' },
  { id: 'act-007', type: 'meal_planned', description: 'Weekly meal plan created for age group 3–5 years', timestamp: '2026-09-25T08:00:00.000Z' },
  { id: 'act-008', type: 'measurement_recorded', description: 'Growth measurement recorded for Meera Nair', timestamp: '2026-09-22T09:00:00.000Z', childId: 'child-004', childName: 'Meera Nair' },
  { id: 'act-009', type: 'distribution_recorded', description: 'Meal distribution recorded: Breakfast (2 Oct)', timestamp: '2026-10-02T09:30:00.000Z' },
];
