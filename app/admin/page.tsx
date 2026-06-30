"use client";

import React, { useEffect, useState, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

type Setting = { key: string; value: string; label: string | null };
type Price = { id: number | null; category: string; name: string; barber: string | null; top: string | null; sort: number };

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!authReady) {
    return <Centered>Загрузка…</Centered>;
  }

  return session ? <Dashboard onLogout={() => supabase.auth.signOut()} /> : <Login />;
}

// ---------- Обёртки ----------
function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#1a1817] text-white flex items-center justify-center p-6">
      {children}
    </main>
  );
}

// ---------- Вход ----------
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setError('Неверный email или пароль');
    setBusy(false);
  };

  return (
    <Centered>
      <form onSubmit={submit} className="w-full max-w-sm bg-[#252220] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-black uppercase tracking-tight mb-1">Админка</h1>
        <p className="text-sm text-white/50 mb-6">Вход для владельца сайта</p>

        <label className="block text-xs uppercase tracking-wide text-white/50 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 bg-[#1a1817] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-accent"
        />

        <label className="block text-xs uppercase tracking-wide text-white/50 mb-1">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-5 bg-[#1a1817] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-accent"
        />

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-accent hover:bg-[#d4641f] disabled:opacity-50 font-bold py-3 rounded-lg uppercase tracking-wide transition-colors"
        >
          {busy ? 'Вход…' : 'Войти'}
        </button>
      </form>
    </Centered>
  );
}

// ---------- Панель управления ----------
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [prices, setPrices] = useState<Price[]>([]);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [savingOffer, setSavingOffer] = useState(false);
  const [savingPrices, setSavingPrices] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [s, p] = await Promise.all([
      supabase.from('settings').select('key,value,label').order('key', { ascending: true }),
      supabase.from('price_items').select('id,category,name,barber,top,sort').order('sort', { ascending: true }),
    ]);
    setSettings((s.data as Setting[]) || []);
    setPrices((p.data as Price[]) || []);
    setDeletedIds([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const flash = (t: string) => {
    setMsg(t);
    window.setTimeout(() => setMsg(''), 3000);
  };

  // --- сохранить оффер (settings) ---
  const saveOffer = async () => {
    setSavingOffer(true);
    for (const s of settings) {
      const { error } = await supabase.from('settings').update({ value: s.value }).eq('key', s.key);
      if (error) {
        flash('Ошибка сохранения оффера: ' + error.message);
        setSavingOffer(false);
        return;
      }
    }
    setSavingOffer(false);
    flash('Оффер сохранён ✓');
  };

  // --- сохранить прайс (price_items) ---
  const savePrices = async () => {
    setSavingPrices(true);

    if (deletedIds.length) {
      const { error } = await supabase.from('price_items').delete().in('id', deletedIds);
      if (error) { flash('Ошибка удаления: ' + error.message); setSavingPrices(false); return; }
    }

    const existing = prices.filter((p) => p.id != null);
    if (existing.length) {
      const { error } = await supabase.from('price_items').upsert(existing);
      if (error) { flash('Ошибка сохранения прайса: ' + error.message); setSavingPrices(false); return; }
    }

    const fresh = prices.filter((p) => p.id == null).map(({ id: _id, ...rest }) => rest);
    if (fresh.length) {
      const { error } = await supabase.from('price_items').insert(fresh);
      if (error) { flash('Ошибка добавления услуг: ' + error.message); setSavingPrices(false); return; }
    }

    setSavingPrices(false);
    flash('Прайс сохранён ✓');
    load(); // перезагружаем, чтобы новые услуги получили id
  };

  const updatePrice = (idx: number, field: keyof Price, value: string) => {
    setPrices((prev) =>
      prev.map((p, i) =>
        i === idx ? { ...p, [field]: field === 'sort' ? Number(value) || 0 : value } : p
      )
    );
  };

  const addPrice = () => {
    const lastSort = prices.length ? Math.max(...prices.map((p) => p.sort)) : 0;
    const lastCat = prices.length ? prices[prices.length - 1].category : '';
    setPrices((prev) => [
      ...prev,
      { id: null, category: lastCat, name: '', barber: '', top: '', sort: lastSort + 10 },
    ]);
  };

  const removePrice = (idx: number) => {
    setPrices((prev) => {
      const item = prev[idx];
      if (item.id != null) setDeletedIds((d) => [...d, item.id as number]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  if (loading) return <Centered>Загрузка данных…</Centered>;

  return (
    <main className="min-h-screen bg-[#1a1817] text-white">
      <header className="sticky top-0 z-10 bg-[#1a1817]/95 backdrop-blur border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <h1 className="text-lg font-black uppercase tracking-tight">Админка Men&apos;s Cave</h1>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-accent">{msg}</span>}
          <a href="/" className="text-sm text-white/50 hover:text-white">На сайт</a>
          <button onClick={onLogout} className="text-sm text-white/50 hover:text-white">Выйти</button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-12">

        {/* ОФФЕР */}
        <section>
          <h2 className="text-xl font-black uppercase tracking-tight mb-4">Оффер на главной</h2>
          <div className="space-y-4 bg-[#252220] border border-white/10 rounded-2xl p-5">
            {settings.map((s, i) => (
              <div key={s.key}>
                <label className="block text-xs uppercase tracking-wide text-white/50 mb-1">
                  {s.label || s.key}
                </label>
                <input
                  value={s.value}
                  onChange={(e) =>
                    setSettings((prev) => prev.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))
                  }
                  className="w-full bg-[#1a1817] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-accent"
                />
              </div>
            ))}
            <button
              onClick={saveOffer}
              disabled={savingOffer}
              className="bg-accent hover:bg-[#d4641f] disabled:opacity-50 font-bold py-2.5 px-6 rounded-lg uppercase text-sm tracking-wide transition-colors"
            >
              {savingOffer ? 'Сохранение…' : 'Сохранить оффер'}
            </button>
          </div>
        </section>

        {/* ПРАЙС */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black uppercase tracking-tight">Прайс-лист</h2>
            <button onClick={addPrice} className="text-sm font-bold text-accent hover:text-[#d4641f]">+ Добавить услугу</button>
          </div>

          <div className="bg-[#252220] border border-white/10 rounded-2xl p-5">
            {/* Заголовки колонок */}
            <div className="hidden md:flex gap-2 px-1 pb-2 mb-2 border-b border-white/10 text-[10px] uppercase tracking-wide text-white/40 font-bold">
              <span className="w-28">Категория</span>
              <span className="flex-1">Название</span>
              <span className="w-20 text-center">Барбер</span>
              <span className="w-20 text-center">Топ</span>
              <span className="w-14 text-center">Поряд.</span>
              <span className="w-8" />
            </div>

            <div className="space-y-2">
              {prices.map((p, idx) => (
                <div key={p.id ?? `new-${idx}`} className="flex flex-wrap md:flex-nowrap gap-2 items-center">
                  <input
                    value={p.category}
                    onChange={(e) => updatePrice(idx, 'category', e.target.value)}
                    placeholder="Категория"
                    className="w-28 bg-[#1a1817] border border-white/10 rounded-lg px-2 py-2 text-sm outline-none focus:border-accent"
                  />
                  <input
                    value={p.name}
                    onChange={(e) => updatePrice(idx, 'name', e.target.value)}
                    placeholder="Название услуги"
                    className="flex-1 min-w-[140px] bg-[#1a1817] border border-white/10 rounded-lg px-2 py-2 text-sm outline-none focus:border-accent"
                  />
                  <input
                    value={p.barber ?? ''}
                    onChange={(e) => updatePrice(idx, 'barber', e.target.value)}
                    placeholder="—"
                    className="w-20 bg-[#1a1817] border border-white/10 rounded-lg px-2 py-2 text-sm text-center outline-none focus:border-accent"
                  />
                  <input
                    value={p.top ?? ''}
                    onChange={(e) => updatePrice(idx, 'top', e.target.value)}
                    placeholder="—"
                    className="w-20 bg-[#1a1817] border border-white/10 rounded-lg px-2 py-2 text-sm text-center outline-none focus:border-accent"
                  />
                  <input
                    type="number"
                    value={p.sort}
                    onChange={(e) => updatePrice(idx, 'sort', e.target.value)}
                    className="w-14 bg-[#1a1817] border border-white/10 rounded-lg px-2 py-2 text-sm text-center outline-none focus:border-accent"
                  />
                  <button
                    onClick={() => removePrice(idx)}
                    aria-label="Удалить"
                    className="w-8 h-8 shrink-0 rounded-lg bg-white/5 hover:bg-red-500/80 text-white/60 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={savePrices}
              disabled={savingPrices}
              className="mt-5 bg-accent hover:bg-[#d4641f] disabled:opacity-50 font-bold py-2.5 px-6 rounded-lg uppercase text-sm tracking-wide transition-colors"
            >
              {savingPrices ? 'Сохранение…' : 'Сохранить прайс'}
            </button>
            <p className="mt-3 text-xs text-white/40">
              «Поряд.» — порядок сортировки (меньше = выше). Категории группируются по названию.
              Изменения появятся на сайте сразу после сохранения.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
