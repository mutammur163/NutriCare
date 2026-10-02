import { useState, useEffect } from 'react';
import { BookOpen, Globe } from 'lucide-react';
import { loadStore } from '../services/store';
import { getSettings } from '../services/settingsService';
import type { EducationArticle, Language } from '../types';
import { useAuth } from '../contexts/AuthContext';

function ArticleCard({ article, lang }: { article: EducationArticle; lang: Language }) {
  const [expanded, setExpanded] = useState(false);

  const title = (lang === 'kn' && article.titleKn) ? article.titleKn
    : (lang === 'hi' && article.titleHi) ? article.titleHi
    : article.titleEn;

  const body = (lang === 'kn' && article.bodyKn) ? article.bodyKn
    : (lang === 'hi' && article.bodyHi) ? article.bodyHi
    : article.bodyEn;

  const fallback = lang !== 'en' && !((lang === 'kn' && article.bodyKn) || (lang === 'hi' && article.bodyHi));

  const categoryLabel: Record<string, string> = {
    balanced_diet: 'Balanced Diet',
    hygiene: 'Hygiene',
    feeding_practices: 'Feeding Practices',
    food_safety: 'Food Safety',
    when_to_seek_help: 'When to Seek Help',
  };

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span className="badge badge-forest">{categoryLabel[article.category] ?? article.category}</span>
            {fallback && <span className="badge badge-amber" title="English shown — translation not available">EN</span>}
          </div>
          <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600 }}>{title}</h3>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-slate)', marginTop: 2 }}>
            Source: {article.source} · Last reviewed: {article.lastReviewed}
          </div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Collapse' : 'Read'}
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--color-border)' }}>
          {fallback && (
            <div className="notice notice-amber" style={{ marginBottom: 10, fontSize: '0.7rem' }}>
              Translation not available for this article. Showing English.
            </div>
          )}
          <div style={{ fontSize: '0.8125rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {body.split('\n').map((line, i) => {
              // Bold **text**
              const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
              if (line.startsWith('**') && line.endsWith('**')) {
                return <div key={i} style={{ fontWeight: 600, marginTop: 10, color: 'var(--color-charcoal)' }} dangerouslySetInnerHTML={{ __html: formatted }} />;
              }
              if (line.startsWith('- ')) {
                return <div key={i} style={{ paddingLeft: 16 }}>• {line.slice(2)}</div>;
              }
              if (line.match(/^\d+\./)) {
                return <div key={i} style={{ paddingLeft: 16 }} dangerouslySetInnerHTML={{ __html: formatted }} />;
              }
              return <div key={i} dangerouslySetInnerHTML={{ __html: formatted }} />;
            })}
          </div>
          <div className="notice notice-amber" style={{ marginTop: 14, fontSize: '0.7rem' }}>
            This information is for general educational purposes. Consult a qualified health professional for medical advice specific to individual children.
          </div>
        </div>
      )}
    </div>
  );
}

export function EducationPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<EducationArticle[]>([]);
  const [lang, setLang] = useState<Language>('en');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const store = loadStore();
    setArticles(store.educationArticles);
    const settings = getSettings();
    setLang(settings.preferredLanguage);
  }, []);

  const isParent = user?.role === 'parent';
  const visibleArticles = articles
    .filter((a) => !isParent || a.targetAudience.includes('parent'))
    .filter((a) => categoryFilter === 'all' || a.category === categoryFilter);

  const categories = Array.from(new Set(articles.map((a) => a.category)));
  const categoryLabel: Record<string, string> = {
    balanced_diet: 'Balanced Diet',
    hygiene: 'Hygiene',
    feeding_practices: 'Feeding Practices',
    food_safety: 'Food Safety',
    when_to_seek_help: 'When to Seek Help',
  };

  const langLabels: Record<Language, string> = { en: 'English', kn: 'ಕನ್ನಡ', hi: 'हिंदी' };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Nutrition Education</h1>
          <p className="page-subtitle">Verified educational content for workers and caregivers</p>
        </div>
      </div>

      {/* Language + category filters */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Globe size={13} style={{ color: 'var(--color-slate)' }} />
          {(['en', 'kn', 'hi'] as Language[]).map((l) => (
            <button key={l} className={`tab-btn${lang === l ? ' active' : ''}`} onClick={() => setLang(l)}>
              {langLabels[l]}
            </button>
          ))}
        </div>
        <select className="form-input" style={{ width: 'auto' }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All topics</option>
          {categories.map((c) => <option key={c} value={c}>{categoryLabel[c] ?? c}</option>)}
        </select>
      </div>

      <div className="notice notice-blue" style={{ marginBottom: 16, fontSize: '0.75rem' }}>
        <BookOpen size={12} style={{ display: 'inline', marginRight: 6 }} />
        All content is provided for general education only and is not medical advice. Sources are cited. Consult a qualified health professional for individual child health concerns.
      </div>

      {visibleArticles.length === 0 ? (
        <div className="empty-state card">
          <BookOpen className="empty-state-icon" />
          <div className="empty-state-title">No articles found</div>
          <div className="empty-state-body">Try a different category filter.</div>
        </div>
      ) : (
        visibleArticles.map((a) => <ArticleCard key={a.id} article={a} lang={lang} />)
      )}
    </div>
  );
}
