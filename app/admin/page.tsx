"use client";

import React, { useEffect, useState, useCallback } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

type Setting = { key: string; value: string; label: string | null };
type Service = { id: number | null; name: string; barber: string; top: string };
type Category = { name: string; services: Service[] };

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

  if (!authReady) return <Centered>Загрузка…</Centered>;
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
          type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
          className="w-full mb-4 bg-[#1a1817] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-accent"
        />
        <label className="block text-xs uppercase tracking-wide text-white/50 mb-1">Пароль</label>
        <input
          type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
          className="w-full mb-5 bg-[#1a1817] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-accent"
        />
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
        <button type="submit" disabled={busy}
          className="w-full bg-accent hover:bg-[#d4641f] disabled:opacity-50 font-bold py-3 rounded-lg uppercase tracking-wide transition-colors">
          {busy ? 'Вход…' : 'Войти'}
        </button>
      </form>
    </Centered>
  );
}

// ---------- Маленькие UI-кнопки ----------
function IconBtn({ onClick, disabled, title, children }: { onClick: () => void; disabled?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      className="w-8 h-8 shrink-0 rounded-lg bg-white/5 enabled:hover:bg-white/15 text-white/60 enabled:hover:text-white disabled:opacity-25 transition-colors flex items-center justify-center text-base leading-none">
      {children}
    </button>
  );
}

// ---------- Панель управления ----------
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [groups, setGroups] = useState<Category[]>([]);
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

    // Группируем плоский прайс по категориям, сохраняя порядок
    const gs: Category[] = [];
    const byCat = new Map<string, Category>();
    for (const it of (p.data as { id: number; category: string; name: string; barber: string | null; top: string | null }[]) || []) {
      let g = byCat.get(it.category);
      if (!g) { g = { name: it.category, services: [] }; byCat.set(it.category, g); gs.push(g); }
      g.services.push({ id: it.id, name: it.name, barber: it.barber ?? '', top: it.top ?? '' });
    }
    setGroups(gs);
    setDeletedIds([]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = (t: string) => { setMsg(t); window.setTimeout(() => setMsg(''), 3500); };

  // Клонируем groups и мутируем — удобно для вложенных правок
  const mutate = (fn: (g: Category[]) => void) =>
    setGroups((prev) => {
      const next = prev.map((c) => ({ ...c, services: c.services.map((s) => ({ ...s })) }));
      fn(next);
      return next;
    });

  // --- оффер ---
  const saveOffer = async () => {
    setSavingOffer(true);
    for (const s of settings) {
      const { error } = await supabase.from('settings').update({ value: s.value }).eq('key', s.key);
      if (error) { flash('Ошибка: ' + error.message); setSavingOffer(false); return; }
    }
    setSavingOffer(false);
    flash('Оффер сохранён ✓');
  };

  // --- прайс ---
  const savePrices = async () => {
    setSavingPrices(true);

    // Разворачиваем группы в плоский список, порядок -> sort (10,20,30…)
    const flat: { id: number | null; category: string; name: string; barber: string | null; top: string | null; sort: number }[] = [];
    let order = 0;
    for (const g of groups) {
      const cat = g.name.trim() || 'Без категории';
      for (const s of g.services) {
        order += 1;
        flat.push({
          id: s.id, category: cat, name: s.name.trim(),
          barber: s.barber.trim() || null, top: s.top.trim() || null, sort: order * 10,
        });
      }
    }

    if (deletedIds.length) {
      const { error } = await supabase.from('price_items').delete().in('id', deletedIds);
      if (error) { flash('Ошибка удаления: ' + error.message); setSavingPrices(false); return; }
    }
    const existing = flat.filter((p) => p.id != null);
    if (existing.length) {
      const { error } = await supabase.from('price_items').upsert(existing);
      if (error) { flash('Ошибка сохранения: ' + error.message); setSavingPrices(false); return; }
    }
    const fresh = flat.filter((p) => p.id == null).map(({ id: _id, ...rest }) => rest);
    if (fresh.length) {
      const { error } = await supabase.from('price_items').insert(fresh);
      if (error) { flash('Ошибка добавления: ' + error.message); setSavingPrices(false); return; }
    }

    setSavingPrices(false);
    flash('Прайс сохранён ✓');
    load();
  };

  // --- операции с категориями/услугами ---
  const setCatName = (ci: number, v: string) => mutate((g) => { g[ci].name = v; });
  const addCategory = () => setGroups((p) => [...p, { name: 'Новая категория', services: [{ id: null, name: '', barber: '', top: '' }] }]);
  const removeCategory = (ci: number) =>
    setGroups((prev) => {
      const ids = prev[ci].services.map((s) => s.id).filter((x): x is number => x != null);
      if (ids.length) setDeletedIds((d) => [...d, ...ids]);
      return prev.filter((_, i) => i !== ci);
    });
  const moveCategory = (ci: number, dir: -1 | 1) =>
    mutate((g) => { const j = ci + dir; if (j < 0 || j >= g.length) return; [g[ci], g[j]] = [g[j], g[ci]]; });

  const setSvc = (ci: number, si: number, field: 'name' | 'barber' | 'top', v: string) =>
    mutate((g) => { g[ci].services[si][field] = v; });
  const addSvc = (ci: number) => mutate((g) => { g[ci].services.push({ id: null, name: '', barber: '', top: '' }); });
  const removeSvc = (ci: number, si: number) =>
    setGroups((prev) => {
      const id = prev[ci].services[si].id;
      if (id != null) setDeletedIds((d) => [...d, id]);
      const next = prev.map((c) => ({ ...c, services: [...c.services] }));
      next[ci].services.splice(si, 1);
      return next;
    });
  const moveSvc = (ci: number, si: number, dir: -1 | 1) =>
    mutate((g) => { const arr = g[ci].services; const j = si + dir; if (j < 0 || j >= arr.length) return; [arr[si], arr[j]] = [arr[j], arr[si]]; });

  if (loading) return <Centered>Загрузка данных…</Centered>;

  // превью оффера
  const get = (k: string) => settings.find((s) => s.key === k)?.value ?? '';
  const offerPreview = `${get('offer_before')} ${get('offer_gift')} ${get('offer_after')}`.trim();

  return (
    <main className="min-h-screen bg-[#1a1817] text-white pb-16">
      <header className="sticky top-0 z-10 bg-[#1a1817]/95 backdrop-blur border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <h1 className="text-base lg:text-lg font-black uppercase tracking-tight">Админка Men&apos;s Cave</h1>
        <div className="flex items-center gap-4">
          {msg && <span className="text-sm text-accent font-semibold">{msg}</span>}
          <a href="/" className="text-sm text-white/50 hover:text-white">На сайт</a>
          <button onClick={onLogout} className="text-sm text-white/50 hover:text-white">Выйти</button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">

        {/* ОФФЕР */}
        <section>
          <h2 className="text-lg font-black uppercase tracking-tight mb-1">Оффер на главной</h2>
          <p className="text-sm text-white/40 mb-4">Крупный текст-акция в шапке сайта.</p>

          <div className="bg-[#252220] border border-white/10 rounded-2xl p-5 space-y-4">
            {/* Превью */}
            <div className="rounded-xl bg-[#1a1817] border border-white/10 px-4 py-3">
              <span className="block text-[10px] uppercase tracking-wide text-white/30 mb-1">Как видно на сайте</span>
              <p className="font-black uppercase leading-tight text-sm">
                {get('offer_before')} <span className="text-accent">{get('offer_gift')}</span> {get('offer_after')}
                <span className="text-accent">*</span>
              </p>
              <p className="text-xs text-white/40 mt-1">* {get('offer_note')}</p>
            </div>

            {settings.map((s, i) => (
              <div key={s.key}>
                <label className="block text-xs uppercase tracking-wide text-white/50 mb-1">{s.label || s.key}</label>
                <input
                  value={s.value}
                  onChange={(e) => setSettings((prev) => prev.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                  className="w-full bg-[#1a1817] border border-white/10 rounded-lg px-4 py-2.5 outline-none focus:border-accent"
                />
              </div>
            ))}

            <button onClick={saveOffer} disabled={savingOffer}
              className="bg-accent hover:bg-[#d4641f] disabled:opacity-50 font-bold py-2.5 px-6 rounded-lg uppercase text-sm tracking-wide transition-colors">
              {savingOffer ? 'Сохранение…' : 'Сохранить оффер'}
            </button>
          </div>
        </section>

        {/* ПРАЙС */}
        <section>
          <h2 className="text-lg font-black uppercase tracking-tight mb-1">Прайс-лист</h2>
          <p className="text-sm text-white/40 mb-4">У каждой услуги две цены: <b className="text-white/70">Барбер</b> и <b className="text-white/70">Топ-барбер</b>.</p>

          <div className="space-y-5">
            {groups.map((cat, ci) => (
              <div key={ci} className="bg-[#252220] border border-white/10 rounded-2xl p-4 lg:p-5">
                {/* Шапка категории */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] uppercase tracking-wide text-white/30 shrink-0">Категория</span>
                  <input
                    value={cat.name}
                    onChange={(e) => setCatName(ci, e.target.value)}
                    className="flex-1 min-w-0 bg-transparent border-b border-white/10 focus:border-accent text-base font-bold px-1 py-1 outline-none"
                  />
                  <IconBtn onClick={() => moveCategory(ci, -1)} disabled={ci === 0} title="Выше">↑</IconBtn>
                  <IconBtn onClick={() => moveCategory(ci, 1)} disabled={ci === groups.length - 1} title="Ниже">↓</IconBtn>
                  <IconBtn onClick={() => removeCategory(ci)} title="Удалить категорию">🗑</IconBtn>
                </div>

                {/* Услуги */}
                <div className="space-y-3">
                  {cat.services.map((svc, si) => (
                    <div key={svc.id ?? `new-${si}`} className="rounded-xl bg-[#1a1817] border border-white/10 p-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-1 min-w-0 space-y-2">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wide text-white/40 mb-1">Услуга</label>
                            <input
                              value={svc.name}
                              onChange={(e) => setSvc(ci, si, 'name', e.target.value)}
                              placeholder="Название услуги"
                              className="w-full bg-[#252220] border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-accent"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] uppercase tracking-wide text-white/40 mb-1">Барбер ₽</label>
                              <input
                                value={svc.barber}
                                onChange={(e) => setSvc(ci, si, 'barber', e.target.value)}
                                placeholder="напр. 1700₽"
                                className="w-full bg-[#252220] border border-white/10 rounded-lg px-3 py-2 text-sm text-center outline-none focus:border-accent"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase tracking-wide text-white/40 mb-1">Топ-барбер ₽</label>
                              <input
                                value={svc.top}
                                onChange={(e) => setSvc(ci, si, 'top', e.target.value)}
                                placeholder="напр. 1900₽"
                                className="w-full bg-[#252220] border border-white/10 rounded-lg px-3 py-2 text-sm text-center outline-none focus:border-accent"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <IconBtn onClick={() => moveSvc(ci, si, -1)} disabled={si === 0} title="Выше">↑</IconBtn>
                          <IconBtn onClick={() => moveSvc(ci, si, 1)} disabled={si === cat.services.length - 1} title="Ниже">↓</IconBtn>
                          <IconBtn onClick={() => removeSvc(ci, si)} title="Удалить услугу">×</IconBtn>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => addSvc(ci)} className="mt-3 text-sm font-bold text-accent hover:text-[#d4641f]">
                  + Добавить услугу
                </button>
              </div>
            ))}
          </div>

          <button onClick={addCategory} className="mt-5 w-full border border-dashed border-white/15 hover:border-accent/60 text-white/60 hover:text-accent rounded-2xl py-3 text-sm font-bold transition-colors">
            + Добавить категорию
          </button>
        </section>

      </div>

      {/* Нижняя панель сохранения прайса */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-[#1a1817]/95 backdrop-blur border-t border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <span className="text-xs text-white/40">Изменения появятся на сайте сразу после сохранения.</span>
          <button onClick={savePrices} disabled={savingPrices}
            className="bg-accent hover:bg-[#d4641f] disabled:opacity-50 font-bold py-2.5 px-6 rounded-lg uppercase text-sm tracking-wide transition-colors shrink-0">
            {savingPrices ? 'Сохранение…' : 'Сохранить прайс'}
          </button>
        </div>
      </div>
    </main>
  );
}
