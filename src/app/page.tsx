
"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Search,
  Menu,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Link,
} from "lucide-react";
import { getProducts, type Product } from "@/lib/api";

const categories = [
  { name: "সব পণ্য", slug: "all" },
  { name: "চাল", slug: "chal" },
  { name: "ডাল", slug: "dal" },
  { name: "তেল", slug: "tel" },
  { name: "সবজি", slug: "vegetables" },
  { name: "মাছ ও মাংস", slug: "fish-meat" },
];

function formatTaka(value: number) {
  return new Intl.NumberFormat("bn-BD").format(value);
}

function formatUnit(unit: string) {
  const units: Record<string, string> = {
    kg: "প্রতি কেজি",
    liter: "প্রতি লিটার",
    litre: "প্রতি লিটার",
    piece: "প্রতি পিস",
    dozen: "প্রতি ডজন",
  };

  return units[unit.toLowerCase()] ?? `প্রতি ${unit}`;
}

function ProductCard({ product }: { product: Product }) {
  const up = product.change.dir === "up";
  const down = product.change.dir === "down";

  return (
    <article className="group rounded-2xl border border-stone-200 bg-white p-4 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg sm:p-5">
      <div className="flex items-start justify-between">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-4xl">
          {product.image || product.categoryIcon || "🛒"}
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            up
              ? "bg-emerald-50 text-emerald-700"
              : down
                ? "bg-red-50 text-red-600"
                : "bg-stone-100 text-stone-500"
          }`}
        >
          {up ? "▲" : down ? "▼" : "—"}{" "}
          {formatTaka(Math.abs(product.change.pct))}%
        </span>
      </div>

      <p className="mt-4 text-xs text-stone-500">
        {product.categoryNameBn}
      </p>

      <h3 className="mt-1 text-lg font-bold text-stone-900">
        {product.nameBn}
      </h3>

      <p className="mt-1 text-sm text-stone-500">
        {formatUnit(product.unit)}
      </p>

      <div className="mt-4 flex items-end justify-between border-t border-stone-100 pt-4">
        <div>
          <p className="text-xs text-stone-500">আজকের দাম</p>
          <p className="mt-1 text-xl font-extrabold text-emerald-700">
            {formatTaka(product.today)} টাকা
          </p>
        </div>

        <a
          href={`/product/${product.slug}`}
          aria-label={`${product.nameBn} এর বিস্তারিত`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition group-hover:bg-emerald-600 group-hover:text-white"
        >
          <ArrowRight size={18} />
        </a>
      </div>
    </article>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err: unknown) => {
        console.error("Failed to fetch products:", err);
        setError("পণ্যের তথ্য লোড করা যায়নি। আবার চেষ্টা করুন।");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((product) => {
    const categoryMatch =
      activeCategory === "all" ||
      product.category === activeCategory;

    return (
      categoryMatch &&
      product.nameBn.toLowerCase().includes(search.toLowerCase())
    );
  });

  const risers = [...products]
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const fallers = [...products]
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct)
    .slice(0, 6);

  const tickerProducts = [...products, ...products];

  return (
    <main className="min-h-screen bg-[#fafaf7] text-stone-900">
      <div className="bg-emerald-800 px-4 py-2 text-center text-xs font-medium text-white sm:text-sm">
        বাজারের সঠিক তথ্য জানুন, সচেতনভাবে কেনাকাটা করুন
      </div>

      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <ShoppingCart size={23} />
            </span>
            <span>
              <span className="block text-xl font-extrabold tracking-tight">
                বাজার দর
              </span>
              <span className="block text-xs text-stone-500">
                নিত্যপণ্যের দৈনিক দর
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href="#বাড়তি-দাম"
              className="rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-emerald-50"
            >
              বাজারের খবর
            </a>
            <a
              href="#সব-পণ্য"
              className="rounded-lg px-3 py-2 text-sm text-stone-600 hover:bg-emerald-50"
            >
              সব পণ্য
            </a>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/signin"
              className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 sm:block"
            >
              সাইন ইন
            </a>
            <a
              href="/signup"
              className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:px-4"
            >
              সাইন আপ
            </a>
            <button
              className="rounded-lg p-2 md:hidden"
              aria-label="মেনু"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => {
                setActiveCategory(category.slug);
                document
                  .getElementById("সব-পণ্য")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category.slug
                  ? "bg-emerald-700 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-emerald-50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>

        <div className="overflow-hidden border-t border-stone-100 bg-emerald-50 py-2">
          <div className="ticker-track flex w-max items-center gap-8 text-sm font-medium">
            {tickerProducts.map((product, index) => (
              <span
                key={`${product.id}-${index}`}
                className="flex items-center gap-2"
              >
                <span>{product.image || "🛒"}</span>
                <span className="text-stone-700">{product.nameBn}</span>
                <span className="font-bold text-emerald-800">
                  {formatTaka(product.today)} টাকা
                </span>
                <span
                  className={
                    product.change.dir === "up"
                      ? "text-emerald-700"
                      : product.change.dir === "down"
                        ? "text-red-600"
                        : "text-stone-500"
                  }
                >
                  {product.change.dir === "up"
                    ? "▲"
                    : product.change.dir === "down"
                      ? "▼"
                      : "—"}
                  {formatTaka(product.change.pct)}%
                </span>
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-2 md:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            আপনার প্রতিদিনের বাজার সহায়ক
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            বাজারের দাম জানুন,
            <span className="mt-2 block text-emerald-700">
              সাশ্রয়ী বাজার করুন।
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-8 text-stone-600 sm:text-lg">
            চাল, ডাল, তেল, সবজি ও নিত্যপ্রয়োজনীয় পণ্যের দাম এক জায়গায়
            দেখুন। বাজারে যাওয়ার আগেই জেনে নিন আজকের দর।
          </p>

          <a
            href="#সব-পণ্য"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 font-bold text-white shadow-lg shadow-emerald-700/15 transition hover:bg-emerald-800"
          >
            সব পণ্যের দাম দেখুন <ArrowRight size={19} />
          </a>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-stone-600">
            <span>✓ সহজে দাম তুলনা</span>
            <span>✓ বাংলা ভাষায় তথ্য</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-5 rounded-full bg-emerald-100 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-100 via-lime-50 to-amber-50 p-7 sm:p-10">
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: "🥬", title: "তাজা সবজি" },
                { emoji: "🍚", title: "চাল ও ডাল" },
                { emoji: "🐟", title: "মাছ ও মাংস" },
                { emoji: "🧅", title: "নিত্যপণ্য" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl bg-white/90 p-5 shadow-sm"
                >
                  <span className="text-5xl">{item.emoji}</span>
                  <p className="mt-3 font-bold">{item.title}</p>
                  <p className="mt-1 text-sm text-stone-500">
                    বাজারের দর
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-emerald-800 p-4 text-white">
              <p className="text-sm text-emerald-100">
                বাজার করুন হিসাব করে
              </p>
              <p className="mt-1 text-lg font-bold">
                দাম জানুন, সাশ্রয়ী থাকুন 🌿
              </p>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
          {[1, 2, 3].map((section) => (
            <div key={section}>
              <div className="mb-5 h-8 w-64 animate-pulse rounded bg-stone-200" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-56 animate-pulse rounded-2xl bg-stone-200"
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : error ? (
        <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:px-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-emerald-700 px-5 py-3 font-bold text-white"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : (
        <>
          <section
            id="বাড়তি-দাম"
            className="mx-auto max-w-6xl scroll-mt-48 px-4 py-8 sm:px-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <TrendingUp size={23} />
              </span>
              <div>
                <h2 className="text-2xl font-extrabold">
                  আজ দাম বেড়েছে ▲
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  যেসব পণ্যের দাম বেড়েছে
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {risers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <TrendingDown size={23} />
              </span>
              <div>
                <h2 className="text-2xl font-extrabold">
                  আজ দাম কমেছে ▼
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  যেসব পণ্যের দাম কমেছে
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fallers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          <section
            id="সব-পণ্য"
            className="mx-auto max-w-6xl scroll-mt-52 px-4 py-12 sm:px-6"
          >
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-bold text-emerald-700">
                  আপনার বাজার তালিকা
                </p>
                <h2 className="mt-2 text-3xl font-black">সব পণ্য</h2>
                <p className="mt-2 text-sm text-stone-500">
                  নিত্যপ্রয়োজনীয় পণ্যের দাম এক নজরে
                </p>
              </div>

              <label className="flex w-full items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 sm:max-w-xs">
                <Search size={19} className="text-stone-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="পণ্যের নাম লিখুন..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.slug}
                  onClick={() => setActiveCategory(category.slug)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                    activeCategory === category.slug
                      ? "bg-emerald-700 text-white"
                      : "border border-stone-200 bg-white text-stone-600 hover:border-emerald-300"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-stone-300 py-12 text-center text-stone-500">
                কোনো পণ্য পাওয়া যায়নি।
              </div>
            )}
          </section>
        </>
      )}

      <footer className="mt-10 border-t border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xl font-extrabold">🛒 বাজার দর</p>
            <p className="mt-1 text-sm text-stone-500">
              প্রয়োজনীয় পণ্যের দাম এক নজরে।
            </p>
          </div>
          <p className="max-w-xl text-sm leading-6 text-stone-500">
            সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
          </p>
        </div>
        <div className="border-t border-stone-100 py-4 text-center text-xs text-stone-400">
          © ২০২৬ বাজার দর। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </footer>
    </main>
  );
}
