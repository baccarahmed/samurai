import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PackagePlus, Save, Plus, Trash2, Edit3, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const emptyBundle = () => ({
  id: '',
  name: '',
  description: '',
  discountPercent: 0,
  fixedPrice: '',
  imageUrl: '',
  items: [{ category: '', keyword: '', productId: '' }]
});

const normalizeCategory = (cat) => {
  const c = (cat || '').toString().toLowerCase();
  if (c.includes('protein') || c.includes('whey')) return 'Protein';
  if (c.includes('pre')) return 'Pre-Workout';
  if (c.includes('recover') || c.includes('bcaa')) return 'Recovery';
  if (c.includes('strength') || c.includes('creatin')) return 'Strength';
  if (c.includes('vitamin')) return 'Vitamines';
  if (c.includes('omega') || c.includes('fish')) return 'Performance';
  return 'Performance';
};

const AdminBundles = () => {
  const [bundles, setBundles] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [form, setForm] = useState(emptyBundle());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { isAdmin, getAuthHeaders } = useAuth();

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const res = await fetch('/api/bundles');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setBundles(Array.isArray(data) ? data : []);
      } catch {
        setBundles([]);
      }
    };
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const array = Array.isArray(data)
          ? data
          : Array.isArray(data?.products)
          ? data.products
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.items)
          ? data.items
          : [];
        const processed = array.map((p) => {
          const rawCategory =
            typeof p.category === 'object'
              ? p.category?.name ?? p.category?.slug ?? ''
              : p.category ?? p.category_name ?? p.categoryName ?? '';
          return {
            id: p.id,
            name: p.name,
            category: normalizeCategory(rawCategory),
            price: p.price ?? p.current_price ?? p.salePrice ?? 0
          };
        });
        setProducts(processed);
      } catch {
        setProducts([]);
      }
    };
    if (!isAdmin) {
      navigate('/auth');
      return;
    }
    fetchBundles();
    fetchProducts();
  }, [isAdmin, navigate]);

  const startCreate = () => {
    setEditingIndex(-1);
    setForm(emptyBundle());
    setErrors({});
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setForm({ ...bundles[index] });
    setErrors({});
  };

  const cancelEdit = () => {
    setEditingIndex(-1);
    setForm(emptyBundle());
    setErrors({});
  };

  const handleImageFile = (file) => {
    if (!file) return;
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Image too large. Please choose a file under 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setForm((f) => ({ ...f, imageUrl: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const next = {};
    if (!form.name.trim()) {
      next.name = 'Name is required';
    }
    if (form.discountPercent < 0 || form.discountPercent > 90) {
      next.discountPercent = 'Discount must be between 0 and 90';
    }
    const hasItem = (form.items || []).some((it) => {
      return (
        (it.category || '').trim() ||
        (it.keyword || '').trim() ||
        (it.productId || '').toString().trim()
      );
    });
    if (!hasItem) {
      next.items = 'At least one item with category or keyword is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const commitForm = async () => {
    if (!validateForm()) return;
    const id = form.id || form.name.toLowerCase().replace(/\s+/g, '-');
    const fixedRaw = form.fixedPrice;
    let fixedNumeric = null;
    if (fixedRaw !== '' && fixedRaw != null) {
      const num = Number(fixedRaw);
      if (!Number.isNaN(num) && num >= 0) {
        fixedNumeric = num;
      }
    }
    const payload = {
      ...form,
      id,
      discountPercent: Number(form.discountPercent || 0),
      fixedPrice: fixedNumeric,
       imageUrl: form.imageUrl || '',
      items: (form.items || []).map((i) => ({
        category: i.category || '',
        keyword: i.keyword || '',
        productId: i.productId || ''
      }))
    };
    try {
      setSaving(true);
      if (editingIndex >= 0) {
        const slug = bundles[editingIndex]?.id || id;
        const res = await fetch(`/api/admin/bundles/${encodeURIComponent(slug)}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const updated = await res.json();
        const next = bundles.slice();
        next[editingIndex] = updated;
        setBundles(next);
      } else {
        const res = await fetch('/api/admin/bundles', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const created = await res.json();
        setBundles([...bundles, created]);
      }
      cancelEdit();
    } catch (e) {
      alert('Save failed: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (index) => {
    const slug = bundles[index]?.id;
    if (!slug) return;
    try {
      const res = await fetch(`/api/admin/bundles/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const next = bundles.slice();
      next.splice(index, 1);
      setBundles(next);
      cancelEdit();
    } catch (e) {
      alert('Delete failed: ' + e.message);
    }
  };

  const addItemRow = () => {
    setForm((f) => ({
      ...f,
      items: [...(f.items || []), { category: '', keyword: '', productId: '' }]
    }));
  };

  const updateItemRow = (i, key, value) => {
    setForm((f) => {
      const arr = f.items.slice();
      arr[i] = { ...arr[i], [key]: value };
      return { ...f, items: arr };
    });
  };

  const slugPreview = (form.id || form.name || '').toLowerCase().trim().replace(/\s+/g, '-');

  const removeItemRow = (i) => {
    setForm((f) => {
      const arr = f.items.slice();
      arr.splice(i, 1);
      return {
        ...f,
        items: arr.length ? arr : [{ category: '', keyword: '', productId: '' }]
      };
    });
  };

  const computedBundles = useMemo(() => {
    if (!products.length) {
      return bundles.map((b) => ({
        ...b,
        totalUnitPrice: 0,
        effectivePrice:
          typeof b.fixedPrice === 'number' && !Number.isNaN(b.fixedPrice) && b.fixedPrice > 0
            ? b.fixedPrice
            : 0,
        savings: 0
      }));
    }
    const productById = new Map(products.map((p) => [p.id, p]));
    const pickByKeyword = (list, kw, exclude) => {
      const k = (kw || '').toLowerCase();
      if (!k) return null;
      return list.find(
        (p) => !exclude.has(p.id) && p.name.toLowerCase().includes(k)
      );
    };
    const pickByCategory = (list, cat, exclude) => {
      const c = normalizeCategory(cat);
      return list.find(
        (p) =>
          !exclude.has(p.id) &&
          (p.category === c ||
            p.name.toLowerCase().includes(c.toLowerCase()))
      );
    };
    const pickAny = (list, exclude) =>
      list.find((p) => !exclude.has(p.id));

    return bundles.map((b) => {
      const used = new Set();
      const resolved = [];
      for (const req of b.items || []) {
        let chosen = null;
        if (req.productId) {
          const direct = productById.get(
            typeof req.productId === 'string'
              ? Number(req.productId)
              : req.productId
          );
          if (direct && !used.has(direct.id)) {
            chosen = direct;
          }
        }
        if (!chosen) {
          chosen =
            pickByKeyword(products, req.keyword, used) ||
            pickByCategory(products, req.category, used) ||
            pickAny(products, used) ||
            null;
        }
        if (chosen) {
          used.add(chosen.id);
          resolved.push(chosen);
        }
      }
      const total = resolved.reduce(
        (sum, p) => sum + (p.price || 0),
        0
      );
      const baseDiscounted = Number(
        (total * (1 - (b.discountPercent || 0) / 100)).toFixed(2)
      );
      const hasFixed =
        typeof b.fixedPrice === 'number' &&
        !Number.isNaN(b.fixedPrice) &&
        b.fixedPrice > 0;
      const effectivePrice = hasFixed ? b.fixedPrice : baseDiscounted;
      const savings = Math.max(0, Number((total - effectivePrice).toFixed(2)));
      return {
        ...b,
        totalUnitPrice: Number(total.toFixed(2)),
        effectivePrice,
        savings
      };
    });
  }, [bundles, products]);

  return (
    <section className="py-10 container mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Manage Bundles</h1>
        <Button onClick={startCreate} className="gap-2"><PackagePlus className="w-4 h-4" />New Bundle</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {computedBundles.map((b, index) => (
          <Card key={b.id} className="bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{b.name}</h2>
                <div className="flex items-center gap-2">
                  {typeof b.fixedPrice === 'number' && !Number.isNaN(b.fixedPrice) && b.fixedPrice > 0 && (
                    <Badge variant="outline">{formatPrice(b.fixedPrice)}</Badge>
                  )}
                  <Badge className="bg-primary text-primary-foreground">-{b.discountPercent}%</Badge>
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-1">{b.description}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="font-semibold">
                  Normal:&nbsp;
                </span>
                <span>{formatPrice(b.totalUnitPrice || 0)}</span>
                <span className="mx-2">→</span>
                <span className="font-semibold">
                  Bundle:&nbsp;
                </span>
                <span>{formatPrice(b.effectivePrice || 0)}</span>
                {b.savings > 0 && (
                  <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                    Save {formatPrice(b.savings)}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <div className="text-xs text-muted-foreground mb-1">Items</div>
                <ul className="text-sm space-y-1">
                  {(b.items || []).map((it, i) => {
                    const product =
                      it.productId && products.length
                        ? products.find((p) => String(p.id) === String(it.productId))
                        : null;
                    return (
                      <li key={i} className="flex gap-2">
                        <span className="font-medium">
                          {product ? product.name : it.category || '(any)'}
                        </span>
                        <span className="text-muted-foreground">
                          {product ? `#${product.id}` : it.keyword || ''}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" className="gap-2" onClick={() => startEdit(index)}><Edit3 className="w-4 h-4" />Edit</Button>
                <Button variant="destructive" className="gap-2" onClick={() => remove(index)}><Trash2 className="w-4 h-4" />Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold">
                {editingIndex >= 0 ? 'Edit bundle' : 'Create new bundle'}
              </div>
              {slugPreview && (
                <div className="text-xs text-muted-foreground mt-1">
                  ID: <span className="font-mono">{slugPreview}</span>
                </div>
              )}
            </div>
            {errors.items && (
              <div className="text-xs text-destructive">{errors.items}</div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm mb-1">Name</div>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Bundle name" />
              {errors.name && (
                <p className="mt-1 text-xs text-destructive">{errors.name}</p>
              )}
            </div>
            <div>
              <div className="text-sm mb-1">Discount %</div>
              <Input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value || 0) })} placeholder="0" />
              {errors.discountPercent && (
                <p className="mt-1 text-xs text-destructive">{errors.discountPercent}</p>
              )}
            </div>
            <div>
              <div className="text-sm mb-1">Fixed price (optional)</div>
              <Input
                type="number"
                value={form.fixedPrice}
                onChange={(e) => setForm({ ...form, fixedPrice: e.target.value })}
                placeholder="Leave empty to use discount %"
              />
            </div>
            <div className="md:col-span-2">
              <div className="text-sm mb-1">Image</div>
              <div
                className="border rounded-md p-3 text-xs text-muted-foreground flex flex-col gap-2 items-start cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files && e.dataTransfer.files[0];
                  if (file) handleImageFile(file);
                }}
              >
                <input
                  id="bundle-image-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) handleImageFile(file);
                  }}
                />
                <label htmlFor="bundle-image-input" className="cursor-pointer">
                  Drop an image here or click to upload
                </label>
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Bundle preview"
                    className="h-16 rounded-md mt-2"
                  />
                )}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm mb-1">Description</div>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm">Items</div>
              <Button variant="outline" size="sm" onClick={addItemRow} className="gap-1"><Plus className="w-4 h-4" />Add</Button>
            </div>
            <div className="mt-2 space-y-2">
              {(form.items || []).map((it, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-7 gap-2 items-center">
                  <Input
                    value={it.category}
                    onChange={(e) => updateItemRow(i, 'category', e.target.value)}
                    placeholder="Category e.g., Protein"
                    className="md:col-span-2"
                  />
                  <Input
                    value={it.keyword}
                    onChange={(e) => updateItemRow(i, 'keyword', e.target.value)}
                    placeholder="Keyword e.g., creatine"
                    className="md:col-span-2"
                  />
                  <Select
                    value={it.productId ? String(it.productId) : ''}
                    onValueChange={(value) =>
                      updateItemRow(i, 'productId', value === '__auto__' ? '' : value)
                    }
                  >
                    <SelectTrigger className="md:col-span-2">
                      <SelectValue placeholder="Pick product (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__auto__">Auto by rules</SelectItem>
                      {products.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          <span>{p.name}</span>
                          <span className="text-muted-foreground text-xs">
                            &nbsp;- {formatPrice(p.price)}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" onClick={() => removeItemRow(i)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={commitForm} className="gap-2" disabled={saving}>
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outline" onClick={cancelEdit} disabled={saving}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminBundles;
