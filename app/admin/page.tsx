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

// ---------- Маленькая кнопка-иконка ----------
function IconBtn({ onClick, disabled, title, children }: { onClick: () => void; disabled?: boolean; title: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      className="w-6 h-6 shrink-0 rounded-md bg-white/5 enabled:hover:bg-white/15 text-white/50 enabled:hover:text-white disabled:opacity-20 transition-colors flex items-center justify-center text-xs leading-none">
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
    const flat: { id: number | null; category: string; name: string; barber: string | null; top: string | null; sort: number }[] = [];
    let order = 0;
    for (const g of groups) {
      const cat = g.name.trim() || 'Без категории';
      for (const s of g.services) {
        order += 1;
        flat.push({ id: s.id, category: cat, name: s.name.trim(), barber: s.barber.trim() || null, top: s.top.trim() || null, sort: order * 10 });
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

  // --- операции ---
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

  const get = (k: string) => settings.find((s) => s.key === k)?.value ?? '';

  // Поля ввода в стиле сайта
  const nameCls = 'flex-1 min-w-0 bg-transparent text-sm lg:text-base font-medium text-white/90 border border-transparent hover:border-white/10 focus:border-accent focus:bg-[#1a1817] rounded-lg px-2 py-1.5 outline-none transition-colors';
  const priceCls = 'w-16 lg:w-20 text-center text-sm lg:text-base font-black text-accent bg-transparent border border-transparent hover:border-white/10 focus:border-accent focus:bg-[#1a1817] rounded-lg px-1 py-1.5 outline-none transition-colors';

  return (
    <main className="min-h-screen bg-[#1a1817] text-white pb-20">
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

        {/* ПРАЙС — выглядит как на сайте */}
        <section>
          <h2 className="text-lg font-black uppercase tracking-tight mb-1">Прайс-лист</h2>
          <p className="text-sm text-white/40 mb-4">Редактируйте прямо в макете прайса: нажмите на название или цену и впишите своё.</p>

          {/* Карточка прайса — те же стили, что на сайте */}
          <div className="bg-[#252220] rounded-3xl border border-white/10 shadow-2xl p-4 lg:p-6">
            {/* Шапка с колонками — как на сайте */}
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
              <span className="flex-1 text-sm uppercase font-black text-white/40">Прайс-лист</span>
              <span className="w-16 lg:w-20 text-center text-[9px] lg:text-xs uppercase text-white/40 font-bold">Барбер</span>
              <span className="w-16 lg:w-20 text-center text-[9px] lg:text-xs uppercase text-white/40 font-bold">Топ-барбер</span>
              <span className="w-6 shrink-0" />
            </div>

            {groups.map((cat, ci) => (
              <div key={ci} className="mb-6 last:mb-1">
                {/* Категория — оранжевая «вкладка», как на сайте */}
                <div className="flex items-center gap-2 mb-1">
                  <div className="inline-flex items-center bg-accent rounded-full pl-4 pr-1.5 py-1 min-w-0">
                    <input
                      value={cat.name}
                      onChange={(e) => setCatName(ci, e.target.value)}
                      placeholder="Категория"
                      className="bg-transparent text-white text-xs font-bold uppercase tracking-wide outline-none w-[40vw] max-w-[200px] placeholder:text-white/60"
                    />
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <IconBtn onClick={() => moveCategory(ci, -1)} disabled={ci === 0} title="Категорию выше">↑</IconBtn>
                    <IconBtn onClick={() => moveCategory(ci, 1)} disabled={ci === groups.length - 1} title="Категорию ниже">↓</IconBtn>
                    <IconBtn onClick={() => removeCategory(ci)} title="Удалить категорию">🗑</IconBtn>
                  </div>
                </div>

                {/* Услуги — строки как на сайте */}
                <div className="divide-y divide-white/5">
                  {cat.services.map((svc, si) => (
                    <div key={svc.id ?? `new-${si}`} className="group flex items-center gap-2 py-2">
                      <input value={svc.name} onChange={(e) => setSvc(ci, si, 'name', e.target.value)} placeholder="Название услуги" className={nameCls} />
                      <input value={svc.barber} onChange={(e) => setSvc(ci, si, 'barber', e.target.value)} placeholder="—" className={priceCls} />
                      <input value={svc.top} onChange={(e) => setSvc(ci, si, 'top', e.target.value)} placeholder="—" className={priceCls} />
                      <div className="w-6 shrink-0 flex flex-col items-center gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button type="button" onClick={() => moveSvc(ci, si, -1)} disabled={si === 0} title="Выше" className="text-[10px] leading-none text-white/60 hover:text-white disabled:opacity-20">▲</button>
                        <button type="button" onClick={() => removeSvc(ci, si)} title="Удалить услугу" className="text-sm leading-none text-white/50 hover:text-red-400">×</button>
                        <button type="button" onClick={() => moveSvc(ci, si, 1)} disabled={si === cat.services.length - 1} title="Ниже" className="text-[10px] leading-none text-white/60 hover:text-white disabled:opacity-20">▼</button>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => addSvc(ci)} className="mt-2 text-xs font-bold text-accent hover:text-[#d4641f]">+ услуга</button>
              </div>
            ))}

            <button onClick={addCategory} className="mt-2 w-full border border-dashed border-white/15 hover:border-accent/60 text-white/60 hover:text-accent rounded-xl py-2.5 text-sm font-bold transition-colors">
              + Добавить категорию
            </button>
          </div>
        </section>

      </div>

      {/* Нижняя панель сохранения */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-[#1a1817]/95 backdrop-blur border-t border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <span className="text-xs text-white/40 hidden sm:block">Изменения появятся на сайте сразу после сохранения.</span>
          <button onClick={savePrices} disabled={savingPrices}
            className="bg-accent hover:bg-[#d4641f] disabled:opacity-50 font-bold py-2.5 px-6 rounded-lg uppercase text-sm tracking-wide transition-colors shrink-0 w-full sm:w-auto">
            {savingPrices ? 'Сохранение…' : 'Сохранить прайс'}
          </button>
        </div>
      </div>
    </main>
  );
}
