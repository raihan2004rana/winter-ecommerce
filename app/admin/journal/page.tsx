"use client";

import * as React from "react";
import Image from "next/image";
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Clock,
  Tag,
  ArrowUpRight,
} from "lucide-react";

interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: string;
  readTime: string;
  image: string;
  author?: string;
  publishedAt: string;
  isPublished: boolean;
  order: number;
}

export default function AdminJournalPage() {
  const [articles, setArticles] = React.useState<JournalArticle[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingArticle, setEditingArticle] = React.useState<JournalArticle | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successToast, setSuccessToast] = React.useState<string | null>(null);

  // Form State
  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Style guide",
    readTime: "5 min read",
    image: "",
    author: "WARDROBE Editorial",
    isPublished: true,
  });

  const fetchArticles = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/journal");
      const data = await res.json();
      if (data && data.articles) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error("Failed to load journal articles:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleTitleChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: editingArticle ? prev.slug : autoSlug,
    }));
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Style guide",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=85&w=800",
      author: "WARDROBE Editorial",
      isPublished: true,
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (article: JournalArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content || "",
      category: article.category,
      readTime: article.readTime,
      image: article.image,
      author: article.author || "WARDROBE Editorial",
      isPublished: article.isPublished,
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setSaving(true);
      setErrorMsg(null);

      const url = editingArticle
        ? `/api/admin/journal/${editingArticle.id}`
        : `/api/admin/journal`;
      const method = editingArticle ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save journal article");
      }

      await fetchArticles();
      setIsModalOpen(false);
      setSuccessToast(
        editingArticle
          ? `Updated "${formData.title}"`
          : `Published new article "${formData.title}"`
      );
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save article";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (article: JournalArticle) => {
    try {
      const res = await fetch(`/api/admin/journal/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !article.isPublished }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === article.id ? { ...a, isPublished: !a.isPublished } : a))
        );
      }
    } catch (err) {
      console.error("Failed to toggle publish status:", err);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/journal/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
        setSuccessToast(`Deleted "${title}"`);
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (err) {
      console.error("Failed to delete article:", err);
    }
  };

  const filteredArticles = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || a.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories = Array.from(new Set(articles.map((a) => a.category)));
  const publishedCount = articles.filter((a) => a.isPublished).length;
  const draftCount = articles.length - publishedCount;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-emerald-500/40 text-emerald-300 px-5 py-3 rounded-lg shadow-xl flex items-center space-x-3 text-sm animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Journal & Editorial Stories
            </h1>
            <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-0.5 rounded-full font-mono border border-neutral-200">
              {articles.length} Stories
            </span>
          </div>
          <p className="text-sm text-neutral-500">
            Publish styling guides, editorial lookbooks, and winter wardrobe guides visible in the storefront mega menu.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Story</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-700">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Total Articles
            </div>
            <div className="text-xl font-bold text-neutral-900">{articles.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Published Live
            </div>
            <div className="text-xl font-bold text-emerald-700">{publishedCount}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Drafts / Unlisted
            </div>
            <div className="text-xl font-bold text-amber-700">{draftCount}</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search stories by title, category, or excerpt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-neutral-200 rounded-md text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-sm"
          />
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-white border border-neutral-200 rounded-md px-3 py-2 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-sm"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="text-xs text-neutral-500 font-mono">
            {filteredArticles.length} of {articles.length}
          </span>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-neutral-200 p-5 space-y-4 animate-pulse"
            >
              <div className="w-full h-44 bg-neutral-100 rounded-md" />
              <div className="h-5 bg-neutral-100 rounded w-2/3" />
              <div className="h-3 bg-neutral-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
          <BookOpen className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-900">No journal stories found</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            {search
              ? `No article matches "${search}".`
              : "No journal articles published yet. Click 'New Journal Story' above to create one."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-44 w-full bg-neutral-100 overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-104 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => togglePublish(article)}
                      className={`text-2xs font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm backdrop-blur-sm transition-colors ${
                        article.isPublished
                          ? "bg-emerald-500/90 text-white hover:bg-emerald-600"
                          : "bg-neutral-800/80 text-neutral-300 hover:bg-neutral-900"
                      }`}
                      title="Click to toggle publish status"
                    >
                      {article.isPublished ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-mono uppercase tracking-wider text-2xs bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm border border-white/20">
                      {article.category}
                    </span>
                    <span className="flex items-center space-x-1 text-2xs text-neutral-200">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-black transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-2 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="mt-3 text-[11px] font-mono text-neutral-400">
                    By {article.author} • {new Date(article.publishedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">/{article.slug}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(article)}
                    className="p-1.5 text-neutral-600 hover:text-black rounded hover:bg-neutral-200/60 transition-colors"
                    title="Edit article"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id, article.title)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50 transition-colors"
                    title="Delete article"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg border border-neutral-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50 sticky top-0 z-10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-md bg-neutral-900 text-white flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    {editingArticle ? "Edit Journal Story" : "Create New Journal Story"}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Displayed in storefront Journal navigation and homepage
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Story Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Building a quiet winter wardrobe"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Category Tag
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="Style guide">Style guide</option>
                    <option value="How to wear">How to wear</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Material craft">Material craft</option>
                    <option value="Lookbook">Lookbook</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 min read"
                    value={formData.readTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, readTime: e.target.value }))}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  URL Slug
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-mono">
                    /journal/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="building-a-quiet-winter-wardrobe"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full pl-20 pr-3 py-2 text-xs bg-white border border-neutral-300 rounded-md font-mono text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Short Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Fewer pieces, warmer layers, and coats that do more than one job."
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Full Story Content / Article Body
                </label>
                <textarea
                  rows={6}
                  placeholder="Write the full editorial article here. Markdown headings (###), paragraphs, bullet points, and tips are supported."
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1">
                  Cover Photo Image URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/images/wardrobe/AFa3pXi6rgIjU1cTtgBzlijk5o.jpg or https://..."
                  value={formData.image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
                {formData.image && (
                  <div className="mt-2 relative h-28 w-full rounded-md overflow-hidden border border-neutral-200">
                    <Image
                      src={formData.image}
                      alt="Story Preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <label htmlFor="isPublished" className="text-xs font-medium text-neutral-700">
                  Publish immediately (visible to visitors in storefront menu and homepage)
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center space-x-2 px-5 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-sm"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? "Saving..." : editingArticle ? "Save Changes" : "Create Story"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
