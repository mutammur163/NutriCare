import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Copy, ChevronDown, ChevronUp, Lightbulb, UtensilsCrossed } from 'lucide-react';
import {
  getAllMealPlans, createMealPlan, deleteMealPlan, duplicateMealPlan,
  addEntryToMealPlan, removeEntryFromMealPlan,
  suggestMeals, getMealCategoryLabel, type MealSuggestion
} from '../services/mealService';
import type { MealPlan, MealCategory, AgeGroup } from '../types';
import { formatDate, todayISO, getAgeGroupLabel } from '../utils/date';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const AGE_GROUPS: AgeGroup[] = ['6-12m', '1-2y', '2-3y', '3-5y', '5-6y'];
const MEAL_CATEGORIES: MealCategory[] = ['breakfast', 'morning_snack', 'lunch', 'afternoon_snack', 'dinner'];
const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function SuggestionPanel({ ageGroup, category, isVegetarian, allergies, onSelect }: {
  ageGroup: AgeGroup; category: MealCategory; isVegetarian: boolean;
  allergies: string[]; onSelect: (s: MealSuggestion) => void;
}) {
  const suggestions = suggestMeals({ ageGroup, mealCategory: category, isVegetarian, allergies });
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-forest)', marginBottom: 8 }}>
        <Lightbulb size={12} style={{ display: 'inline', marginRight: 4 }} />
        Suggested meals for {getAgeGroupLabel(ageGroup)} · {getMealCategoryLabel(category)}
      </div>
      {suggestions.length === 0 ? (
        <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>No suitable suggestions for the selected options (check allergy filters).</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {suggestions.map((s) => (
            <div key={s.dishName} style={{ padding: '8px 10px', border: '1px solid var(--color-border)', borderRadius: 4, background: '#fff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{s.dishName}</span>
                <button className="btn btn-primary btn-sm" onClick={() => onSelect(s)}>Use</button>
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-slate)', marginBottom: 2 }}>
                {s.ingredients.join(', ')} · ≈{s.servingSizeGrams}g · ₹{s.estimatedCostPerServing}/serving
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-forest)' }}>{s.rationaleNote}</div>
              {s.allergenInfo.length > 0 && <div style={{ fontSize: '0.7rem', color: 'var(--color-red)' }}>Allergens: {s.allergenInfo.join(', ')}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddEntryForm({ planId, ageGroup, isVegetarian, onAdded, onClose }: {
  planId: string; ageGroup: AgeGroup; isVegetarian: boolean;
  onAdded: () => void; onClose: () => void;
}) {
  const [day, setDay] = useState(0);
  const [category, setCategory] = useState<MealCategory>('breakfast');
  const [dishName, setDishName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [serving, setServing] = useState('150');
  const [target, setTarget] = useState('15');
  const [cost, setCost] = useState('10');
  const [notes, setPrepNotes] = useState('');
  const [allergens, setAllergens] = useState('');
  const [rationale, setRationale] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSuggestion(s: MealSuggestion) {
    setDishName(s.dishName);
    setIngredients(s.ingredients.join(', '));
    setServing(String(s.servingSizeGrams));
    setCost(String(s.estimatedCostPerServing));
    setPrepNotes(s.preparationNotes);
    setAllergens(s.allergenInfo.join(', '));
    setRationale(s.rationaleNote);
    setShowSuggestions(false);
  }

  function validate() {
    const e: typeof errors = {};
    if (!dishName.trim()) e.dishName = 'Dish name required';
    if (!ingredients.trim()) e.ingredients = 'Ingredients required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    addEntryToMealPlan(planId, {
      dayOfWeek: day,
      mealCategory: category,
      dishName,
      ingredients: ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      servingSizeGrams: parseInt(serving) || 150,
      servingsTarget: parseInt(target) || 15,
      foodGroups: [],
      estimatedCostPerServing: parseFloat(cost) || 0,
      preparationNotes: notes,
      allergenInfo: allergens ? allergens.split(',').map((s) => s.trim()).filter(Boolean) : [],
      rationaleNote: rationale,
      isVegetarian,
    });
    toast.success('Meal entry added.');
    onAdded();
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="form-group">
            <label className="form-label required">Day</label>
            <select className="form-input" value={day} onChange={(e) => setDay(Number(e.target.value))}>
              {DAY_LABELS.map((d, i) => <option key={d} value={i}>{d}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label required">Meal Category</label>
            <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value as MealCategory)}>
              {MEAL_CATEGORIES.map((c) => <option key={c} value={c}>{getMealCategoryLabel(c)}</option>)}
            </select>
          </div>
        </div>

        <button type="button" className="btn btn-secondary btn-sm" style={{ width: 'fit-content' }} onClick={() => setShowSuggestions(!showSuggestions)}>
          <Lightbulb size={12} /> {showSuggestions ? 'Hide' : 'Show'} suggestions
        </button>

        {showSuggestions && (
          <SuggestionPanel ageGroup={ageGroup} category={category} isVegetarian={isVegetarian} allergies={[]} onSelect={handleSuggestion} />
        )}

        <div className="form-group">
          <label className="form-label required">Dish Name</label>
          <input className={`form-input${errors.dishName ? ' error' : ''}`} value={dishName} onChange={(e) => setDishName(e.target.value)} placeholder="e.g. Ragi Porridge" />
          {errors.dishName && <span className="form-error">{errors.dishName}</span>}
        </div>

        <div className="form-group">
          <label className="form-label required">Ingredients (comma-separated)</label>
          <input className={`form-input${errors.ingredients ? ' error' : ''}`} value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Ragi flour, Jaggery, Milk" />
          {errors.ingredients && <span className="form-error">{errors.ingredients}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div className="form-group">
            <label className="form-label">Serving (g)</label>
            <input type="number" className="form-input" value={serving} onChange={(e) => setServing(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Target Servings</label>
            <input type="number" className="form-input" value={target} onChange={(e) => setTarget(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Cost/serving (₹)</label>
            <input type="number" step="0.5" className="form-input" value={cost} onChange={(e) => setCost(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Allergen Information</label>
          <input className="form-input" value={allergens} onChange={(e) => setAllergens(e.target.value)} placeholder="e.g. milk, wheat" />
        </div>

        <div className="form-group">
          <label className="form-label">Preparation Notes</label>
          <textarea className="form-input" value={notes} onChange={(e) => setPrepNotes(e.target.value)} rows={2} />
        </div>

        <div className="form-group">
          <label className="form-label">Rationale / Source</label>
          <input className="form-input" value={rationale} onChange={(e) => setRationale(e.target.value)} placeholder="Why was this meal chosen?" />
        </div>
      </div>
      <div className="dialog-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary">Add Entry</button>
      </div>
    </form>
  );
}

function CreatePlanForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const [planName, setPlanName] = useState('');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('3-5y');
  const [weekStart, setWeekStart] = useState(todayISO());
  const [isVeg, setIsVeg] = useState(true);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!planName.trim()) errs.planName = 'Plan name required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({ planName, ageGroup, weekStartDate: weekStart, isVegetarian: isVeg, notes, entries: [] });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="dialog-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="form-group">
          <label className="form-label required">Plan Name</label>
          <input className={`form-input${errors.planName ? ' error' : ''}`} value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="e.g. Standard Weekly Plan" />
          {errors.planName && <span className="form-error">{errors.planName}</span>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="form-group">
            <label className="form-label required">Age Group</label>
            <select className="form-input" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}>
              {AGE_GROUPS.map((g) => <option key={g} value={g}>{getAgeGroupLabel(g)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Week Start Date</label>
            <input type="date" className="form-input" value={weekStart} onChange={(e) => setWeekStart(e.target.value)} />
          </div>
        </div>
        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" id="isVeg" checked={isVeg} onChange={(e) => setIsVeg(e.target.checked)} />
          <label htmlFor="isVeg" className="form-label" style={{ margin: 0 }}>Vegetarian plan</label>
        </div>
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea className="form-input" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </div>
      </div>
      <div className="dialog-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary">Create Plan</button>
      </div>
    </form>
  );
}

export function MealPlannerPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const isWorker = user?.role === 'worker' || user?.role === 'supervisor';

  function load() {
    const ps = getAllMealPlans();
    setPlans(ps);
    if (ps.length > 0 && !selectedPlanId) setSelectedPlanId(ps[0].id);
  }

  useEffect(() => { load(); }, []);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  function handleCreate(data: any) {
    const p = createMealPlan({ ...data, createdBy: user?.name ?? 'Worker' });
    setSelectedPlanId(p.id);
    setShowCreateForm(false);
    load();
    toast.success('Meal plan created.');
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteMealPlan(deleteTarget);
    setDeleteTarget(null);
    const remaining = getAllMealPlans();
    setPlans(remaining);
    setSelectedPlanId(remaining.length > 0 ? remaining[0].id : '');
    toast.success('Plan deleted.');
  }

  function handleDuplicate() {
    if (!selectedPlan) return;
    const newPlan = duplicateMealPlan(selectedPlan.id, todayISO(), `${selectedPlan.planName} (copy)`);
    setSelectedPlanId(newPlan.id);
    load();
    toast.success('Plan duplicated.');
  }

  function handleRemoveEntry(entryId: string) {
    if (!selectedPlanId) return;
    removeEntryFromMealPlan(selectedPlanId, entryId);
    load();
    toast.success('Entry removed.');
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Meal Planner</h1>
          <p className="page-subtitle">Create and manage weekly meal plans by age group</p>
        </div>
        {isWorker && (
          <div style={{ display: 'flex', gap: 8 }}>
            {selectedPlan && (
              <>
                <button className="btn btn-secondary btn-sm" onClick={handleDuplicate}><Copy size={12} /> Duplicate</button>
                <button className="btn btn-secondary btn-sm" style={{ color: 'var(--color-red)' }} onClick={() => setDeleteTarget(selectedPlanId)}>
                  <Trash2 size={12} /> Delete Plan
                </button>
              </>
            )}
            <button className="btn btn-primary btn-sm" onClick={() => setShowCreateForm(true)}><Plus size={12} /> New Plan</button>
          </div>
        )}
      </div>

      {/* Plan selector */}
      <div className="filter-bar">
        <select className="form-input" style={{ maxWidth: 320 }} value={selectedPlanId} onChange={(e) => setSelectedPlanId(e.target.value)}>
          <option value="">— Select a meal plan —</option>
          {plans.map((p) => (
            <option key={p.id} value={p.id}>{p.planName} ({getAgeGroupLabel(p.ageGroup)})</option>
          ))}
        </select>
      </div>

      {selectedPlan ? (
        <div>
          {/* Plan info */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Plan Name</div>
                <div style={{ fontWeight: 600 }}>{selectedPlan.planName}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Age Group</div>
                <div style={{ fontWeight: 600 }}>{getAgeGroupLabel(selectedPlan.ageGroup)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Week Start</div>
                <div style={{ fontWeight: 600 }}>{formatDate(selectedPlan.weekStartDate)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Diet</div>
                <span className={`badge ${selectedPlan.isVegetarian ? 'badge-green' : 'badge-slate'}`}>{selectedPlan.isVegetarian ? 'Vegetarian' : 'Non-vegetarian'}</span>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Entries</div>
                <div style={{ fontWeight: 600 }}>{selectedPlan.entries.length} meals planned</div>
              </div>
              {isWorker && (
                <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowEntryForm(true)}>
                  <Plus size={12} /> Add Meal Entry
                </button>
              )}
            </div>
            {selectedPlan.notes && <div className="notice notice-blue" style={{ marginTop: 10 }}>{selectedPlan.notes}</div>}
          </div>

          {/* 7-day grid */}
          {DAY_LABELS.map((day, dayIdx) => {
            const dayEntries = selectedPlan.entries.filter((e) => e.dayOfWeek === dayIdx);
            return (
              <div key={day} className="card" style={{ marginBottom: 8 }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  onClick={() => setExpandedDay(expandedDay === dayIdx ? null : dayIdx)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>{day}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>{dayEntries.length} meal{dayEntries.length !== 1 ? 's' : ''}</span>
                  </div>
                  {expandedDay === dayIdx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>

                {expandedDay === dayIdx && (
                  <div style={{ marginTop: 12 }}>
                    {dayEntries.length === 0 ? (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)', padding: '8px 0' }}>No meals planned for {day}.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {MEAL_CATEGORIES.filter((cat) => dayEntries.some((e) => e.mealCategory === cat)).map((cat) => {
                          const catEntries = dayEntries.filter((e) => e.mealCategory === cat);
                          return (
                            <div key={cat}>
                              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-slate)', textTransform: 'uppercase', marginBottom: 4 }}>{getMealCategoryLabel(cat)}</div>
                              {catEntries.map((entry) => (
                                <div key={entry.id} style={{ padding: '8px 10px', background: 'var(--color-surface-2)', borderRadius: 4, marginBottom: 4 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                      <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{entry.dishName}</div>
                                      <div style={{ fontSize: '0.7rem', color: 'var(--color-slate)' }}>
                                        {entry.ingredients.join(', ')} · {entry.servingSizeGrams}g · ₹{entry.estimatedCostPerServing}/serving · {entry.servingsTarget} servings
                                      </div>
                                      {entry.allergenInfo.length > 0 && (
                                        <div style={{ fontSize: '0.7rem', color: 'var(--color-red)' }}>Allergens: {entry.allergenInfo.join(', ')}</div>
                                      )}
                                      {entry.rationaleNote && (
                                        <div style={{ fontSize: '0.7rem', color: 'var(--color-forest)', marginTop: 2 }}>{entry.rationaleNote}</div>
                                      )}
                                    </div>
                                    {isWorker && (
                                      <button className="btn-icon btn-sm" style={{ color: 'var(--color-red)', flexShrink: 0 }} onClick={() => handleRemoveEntry(entry.id)}>
                                        <Trash2 size={12} />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state card">
          <UtensilsCrossed className="empty-state-icon" />
          <div className="empty-state-title">No meal plans yet</div>
          <div className="empty-state-body">Create a meal plan to start scheduling meals for children.</div>
          {isWorker && <button className="btn btn-primary btn-sm" onClick={() => setShowCreateForm(true)}><Plus size={12} /> Create First Plan</button>}
        </div>
      )}

      {/* Create plan dialog */}
      {showCreateForm && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h2 className="dialog-title">Create Meal Plan</h2>
              <button className="btn-icon" onClick={() => setShowCreateForm(false)}>&times;</button>
            </div>
            <CreatePlanForm onSave={handleCreate} onCancel={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}

      {/* Add entry dialog */}
      {showEntryForm && selectedPlan && (
        <div className="dialog-overlay">
          <div className="dialog dialog-wide">
            <div className="dialog-header">
              <h2 className="dialog-title">Add Meal Entry — {selectedPlan.planName}</h2>
              <button className="btn-icon" onClick={() => setShowEntryForm(false)}>&times;</button>
            </div>
            <AddEntryForm
              planId={selectedPlan.id} ageGroup={selectedPlan.ageGroup}
              isVegetarian={selectedPlan.isVegetarian}
              onAdded={() => { setShowEntryForm(false); load(); }}
              onClose={() => setShowEntryForm(false)}
            />
          </div>
        </div>
      )}

      {/* Delete plan confirm */}
      {deleteTarget && (
        <div className="dialog-overlay">
          <div className="dialog" style={{ maxWidth: 380 }}>
            <div className="dialog-header"><h2 className="dialog-title">Delete Meal Plan</h2></div>
            <div className="dialog-body">
              <p>Delete <strong>{selectedPlan?.planName}</strong>? All entries will be removed.</p>
              <div className="notice notice-red" style={{ marginTop: 10 }}>This action cannot be undone.</div>
            </div>
            <div className="dialog-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
