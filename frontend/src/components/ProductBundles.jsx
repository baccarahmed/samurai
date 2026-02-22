import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Package, Gift, ShoppingCart, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

const DEFAULT_BUNDLE_DEFS = [
  {
    id: 'muscle-gain',
    name: 'Muscle Gain Pack',
    description: 'Protein + Creatine + BCAA for strength and growth',
    discountPercent: 15,
    items: [
      { category: 'Protein' },
      { category: 'Strength', keyword: 'creatine' },
      { category: 'Recovery', keyword: 'BCAA' }
    ]
  },
  {
    id: 'preworkout-starter',
    name: 'Pre-Workout Starter',
    description: 'Energy, focus, and recovery essentials',
    discountPercent: 12,
    items: [
      { category: 'Pre-Workout' },
      { category: 'Recovery', keyword: 'BCAA' }
    ]
  },
  {
    id: 'daily-health',
    name: 'Daily Health Bundle',
    description: 'Multivitamin + Omega-3 for everyday wellness',
    discountPercent: 10,
    items: [
      { category: 'Vitamines', keyword: 'multivitamin' },
      { category: 'Performance', keyword: 'omega' }
    ]
  }
];

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

const ProductBundles = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState({});
  const { toast } = useToast();
  const [bundleDefs, setBundleDefs] = useState([]);

  useEffect(() => {
    let active = true;
    const loadBundleDefs = async () => {
      try {
        const res = await fetch('/api/bundles');
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data) && data.length) {
            setBundleDefs(data);
            return;
          }
        }
      } catch {
        void 0;
      }
      if (active) setBundleDefs(DEFAULT_BUNDLE_DEFS);
    };
    loadBundleDefs();
    const fetchProducts = async () => {
      try {
        setLoading(true);
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
            price: p.price ?? p.current_price ?? p.salePrice ?? 0,
            imageUrl: p.image_url ?? p.imageUrl ?? p.image ?? ''
          };
        });
        if (active) setProducts(processed);
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      active = false;
    };
  }, []);

  const bundles = useMemo(() => {
    const productById = new Map(products.map((p) => [p.id, p]));
    const pickByKeyword = (list, kw, exclude) => {
      const k = (kw || '').toLowerCase();
      if (!k) return null;
      return list.find((p) => !exclude.has(p.id) && p.name.toLowerCase().includes(k));
    };
    const pickByCategory = (list, cat, exclude) => {
      const c = normalizeCategory(cat);
      return list.find(
        (p) =>
          !exclude.has(p.id) &&
          (p.category === c || p.name.toLowerCase().includes(c.toLowerCase()))
      );
    };
    const pickAny = (list, exclude) => list.find((p) => !exclude.has(p.id));
    return bundleDefs.map((b) => {
      const used = new Set();
      const resolved = [];
      for (const req of b.items || []) {
        let chosen = null;
        if (req.productId) {
          const direct = productById.get(req.productId);
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
      const total = resolved.reduce((s, p) => s + (p.price || 0), 0);
      const baseDiscounted = Number(
        (total * (1 - (b.discountPercent || 0) / 100)).toFixed(2)
      );
      const hasFixed =
        typeof b.fixedPrice === 'number' &&
        !Number.isNaN(b.fixedPrice) &&
        b.fixedPrice > 0;
      const bundlePrice = hasFixed ? b.fixedPrice : baseDiscounted;
      return {
        ...b,
        resolvedItems: resolved,
        totalPrice: Number(total.toFixed(2)),
        bundlePrice
      };
    });
  }, [products, bundleDefs]);

          const handleAddBundle = async (bundleId, itemIds, _EVENT) => {
            _EVENT?.stopPropagation?.();
    const token = localStorage.getItem('token');
    if (!token) {
              toast({
                title: 'Login required',
                description: 'Please log in to add bundle to cart.',
                variant: 'destructive'
              });
      return;
    }
    try {
      setAdding((prev) => ({ ...prev, [bundleId]: true }));
      for (const id of itemIds) {
                const res = await fetch(`/api/cart/add/${id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
                if (!res.ok) {
                  let msg = `Failed adding item ${id}`;
                  try {
                    const body = await res.json();
                    msg = body?.message || msg;
                  } catch { void 0; }
                  throw new Error(msg);
                }
      }
      toast({
        title: 'Bundle added',
        description: 'All items added to cart.',
        variant: 'success',
        className: 'bg-green-500 text-white border-none'
      });
            } catch (err) {
              toast({
                title: 'Add to cart failed',
                description: String(err.message || err),
                variant: 'destructive'
              });
    } finally {
      setAdding((prev) => ({ ...prev, [bundleId]: false }));
    }
  };

  return (
    <section className="bg-background">
      <div className="container mx-auto px-4">
        {loading && (
          <div className="text-center text-muted-foreground mb-6">Loading bundles…</div>
        )}

        <div className="relative">
          <InfiniteMovingCards items={bundles} direction="left" speed="normal">
            {(b) => (
              <CardContainer className="inter-var group/card">
                <CardBody className="relative group/card w-full min-h-[28rem] rounded-xl px-6 py-5 border border-black/10 dark:border-white/20 bg-card/80 backdrop-blur-sm dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
                <div className="flex flex-col md:flex-row items-stretch gap-8">
                  <CardItem
                    className="w-full md:w-72 flex-shrink-0 transition-transform duration-300 group-hover/card:[transform:translateZ(100px)_rotateX(20deg)_rotateZ(-10deg)]"
                  >
                    {b.imageUrl || b.resolvedItems[0]?.imageUrl ? (
                      <img
                        src={b.imageUrl || b.resolvedItems[0].imageUrl}
                        alt={b.name}
                        className="h-80 md:h-[22rem] w-full object-cover rounded-xl group-hover/card:shadow-xl"
                      />
                    ) : (
                      <div className="h-80 md:h-[22rem] w-full rounded-xl bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
                    )}
                  </CardItem>

                  <div className="flex-1 overflow-visible">
                    <CardItem
                      translateZ={150}
                      className="flex items-center justify-between mb-3 transition-transform duration-300 group-hover/card:-translate-y-1 group-hover/card:scale-105"
                    >
                      <div className="flex items-center gap-2">
                        <Gift className="w-6 h-6 text-primary" />
                        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{b.name}</h3>
                      </div>
                      <Badge className="bg-primary text-primary-foreground">-{b.discountPercent}%</Badge>
                    </CardItem>

                    <CardItem
                      as="p"
                      translateZ={130}
                      className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg leading-relaxed mt-1 line-clamp-3 transition-transform duration-300 group-hover/card:-translate-y-1 group-hover/card:scale-105"
                    >
                      {b.description}
                    </CardItem>

                    <CardItem translateZ={170} className="w-full mt-4 transition-transform duration-300 group-hover/card:-translate-y-1 group-hover/card:scale-105">
                      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 via-transparent to-transparent p-4">
                        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Comprend</div>
                        <ul className="space-y-1">
                          {b.resolvedItems.length > 0 ? (
                            b.resolvedItems.map((p) => (
                              <li key={p.id} className="text-sm flex items-center gap-2">
                                <Package className="w-4 h-4 text-muted-foreground" />
                                <span className="line-clamp-1 font-medium text-foreground">{p.name}</span>
                                <Badge variant="outline" className="ml-auto text-xs">
                                  {p.category}
                                </Badge>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-muted-foreground">Articles indisponibles actuellement</li>
                          )}
                        </ul>
                      </div>
                    </CardItem>

                    <CardItem translateZ={160} className="flex items-baseline gap-3 mt-4 transition-transform duration-300 group-hover/card:-translate-y-1 group-hover/card:scale-105">
                      <span className="text-3xl md:text-4xl font-black text-primary">
                        {formatPrice(b.bundlePrice)}
                      </span>
                      <span className="text-sm md:text-base text-muted-foreground line-through">
                        {formatPrice(b.totalPrice)}
                      </span>
                    </CardItem>

                    <div className="flex items-center gap-3 mt-6">
                      <CardItem
                        translateZ={120}
                        as="button"
                        className="px-6 py-3 rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm md:text-base font-bold transition-transform duration-300 group-hover/card:-translate-y-1 group-hover/card:scale-105"
                        disabled={adding[b.id] || b.resolvedItems.length === 0}
                        onClick={(e) =>
                          handleAddBundle(
                            b.id,
                            b.resolvedItems.map((p) => p.id),
                            e
                          )
                        }
                      >
                        <span className="inline-flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          Ajouter le pack au panier
                        </span>
                      </CardItem>
                      {b.resolvedItems.length > 0 && (
                        <CardItem translateZ={90} className="text-xs md:text-sm text-muted-foreground inline-flex items-center gap-1 transition-transform duration-300 group-hover/card:-translate-y-1 group-hover/card:scale-105">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span>Prix du pack vs à l’unité</span>
                        </CardItem>
                      )}
                    </div>
                  </div>
                </div>
                </CardBody>
              </CardContainer>
            )}
          </InfiniteMovingCards>
        </div>
      </div>
    </section>
  );
};

export default ProductBundles;
