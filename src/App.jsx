import { useState, useRef, useEffect } from "react";

const C = {
  bg: '#09080D',
  surface: '#110F17',
  card: '#18161E',
  cardHover: '#1F1C28',
  border: '#252230',
  amber: '#D4924A',
  amberBright: '#EEAA55',
  amberSoft: 'rgba(212,146,74,0.1)',
  amberBorder: 'rgba(212,146,74,0.25)',
  text: '#EDE7DB',
  muted: '#7A7268',
  dim: '#38333E',
  green: '#4E9E65',
  greenSoft: 'rgba(78,158,101,0.1)',
  greenBorder: 'rgba(78,158,101,0.25)',
  blue: '#5A8FC8',
  blueSoft: 'rgba(90,143,200,0.1)',
  red: '#A84848',
};

const USER = { name: 'Sarah', med: 'Semaglutide 1mg', week: 8, day: 56, weightNow: 187, weightGoal: 165, proteinGoal: 120, calGoal: 1400, waterGoal: 64 };

function Ring({ val, max, size = 148, stroke = 13, color, label, sub }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(val / max, 1);
  const col = color || C.amber;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col}
        strokeWidth={stroke} strokeDasharray={`${pct * circ} ${circ}`}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
      <text x={size/2} y={size/2 - 9} textAnchor="middle" fill={C.text}
        fontSize="28" fontFamily="Cormorant, Georgia, serif" fontWeight="500">{label}</text>
      {sub && <text x={size/2} y={size/2 + 14} textAnchor="middle" fill={C.muted}
        fontSize="11" fontFamily="DM Sans, sans-serif">{sub}</text>}
      <text x={size/2} y={size/2 + 3} textAnchor="middle" fill={C.muted}
        fontSize="11" fontFamily="DM Sans, sans-serif">{`${Math.round(pct * 100)}%`}</text>
    </svg>
  );
}

function MiniBar({ val, max, color }) {
  return (
    <div style={{ height: 3, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(val / max, 1) * 100}%`, background: color, borderRadius: 2 }} />
    </div>
  );
}

function TodayScreen({ setTab }) {
  const protein = 67, cal = 680, water = 32;
  const plan = [
    { time: '12:00 PM', meal: 'Grilled chicken + cottage cheese bowl', protein: 45, cal: 380, status: 'up-next', icon: '🍗' },
    { time: '3:30 PM', meal: 'String cheese + 2 hard-boiled eggs', protein: 22, cal: 180, status: 'planned', icon: '🥚' },
    { time: '7:00 PM', meal: 'Salmon fillet + steamed broccoli', protein: 38, cal: 420, status: 'planned', icon: '🐟' },
  ];
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 20px' }}>
      <div style={{ padding: '16px 22px 0' }}>
        <p style={{ margin: 0, fontSize: 11, letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase' }}>Tue · Apr 27 · Day {USER.day}</p>
        <h1 style={{ margin: '6px 0 0', fontSize: 34, fontFamily: 'Cormorant, Georgia, serif', fontWeight: 500, color: C.text, lineHeight: 1.1 }}>
          Good morning,<br /><em style={{ color: C.amber, fontStyle: 'italic' }}>Sarah.</em>
        </h1>
      </div>

      <div style={{ margin: '18px 14px 0', background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.amber}`, padding: '14px 16px' }}>
        <p style={{ margin: '0 0 6px', fontSize: 10, letterSpacing: '0.14em', color: C.amber, textTransform: 'uppercase', fontWeight: 500 }}>NURA · Morning Briefing</p>
        <p style={{ margin: 0, fontSize: 13.5, color: C.text, lineHeight: 1.7 }}>
          You came in 18g short on protein yesterday. Today's plan compensates at lunch. Your dose window opens at 9pm — I'll remind you. <span style={{ color: C.amber }}>You're building momentum.</span>
        </p>
      </div>

      <div style={{ margin: '16px 14px 0', display: 'flex', gap: 10 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 10px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
          <Ring val={protein} max={USER.proteinGoal} label={`${protein}g`} sub={`of ${USER.proteinGoal}g`} />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Calories', val: cal, max: USER.calGoal, unit: 'kcal', color: C.amberBright },
            { label: 'Water', val: water, max: USER.waterGoal, unit: 'oz', color: C.blue },
            { label: 'GLP-1', val: null, unit: '9pm dose', color: C.green, static: true },
          ].map(({ label, val, max, unit, color, static: isStatic }) => (
            <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ margin: 0, fontSize: 10, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
              <p style={{ margin: '2px 0 isStatic ? 0 : 5px', fontSize: 15, color: C.text, fontWeight: 500 }}>
                {isStatic ? unit : `${val} `}
                {!isStatic && <span style={{ fontSize: 10, color: C.muted }}>{unit}</span>}
              </p>
              {!isStatic && <MiniBar val={val} max={max} color={color} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: '18px 14px 0' }}>
        <p style={{ margin: '0 0 10px', fontSize: 10, letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase' }}>YOUR PLAN TODAY</p>
        {plan.map((item, i) => {
          const isNext = item.status === 'up-next';
          return (
            <div key={i} style={{ background: isNext ? C.amberSoft : C.card, borderRadius: 12, border: `1px solid ${isNext ? C.amberBorder : C.border}`, padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.4 }}>{item.meal}</p>
                  {isNext && <span style={{ fontSize: 9, background: C.amber, color: '#000', borderRadius: 4, padding: '2px 6px', fontWeight: 600, letterSpacing: '0.06em', flexShrink: 0 }}>UP NEXT</span>}
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: C.muted }}>{item.time} · {item.protein}g protein · {item.cal} cal</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ margin: '18px 14px 0' }}>
        <p style={{ margin: '0 0 10px', fontSize: 10, letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase' }}>LOGGED TODAY</p>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>🫐</span>
            <div>
              <p style={{ margin: 0, fontSize: 13.5, color: C.text }}>Greek Yogurt + Mixed Berries</p>
              <p style={{ margin: 0, fontSize: 11, color: C.muted }}>8:30 AM</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: 14, color: C.amber, fontWeight: 500 }}>18g</p>
            <p style={{ margin: 0, fontSize: 11, color: C.muted }}>180 cal</p>
          </div>
        </div>
      </div>

      <div style={{ margin: '14px 14px 0', background: C.greenSoft, borderRadius: 12, border: `1px solid ${C.greenBorder}`, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: 10, color: C.green, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>SEMAGLUTIDE 1MG · WK {USER.week}</p>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: C.text }}>Next dose: Tonight 9:00 PM</p>
        </div>
        <span style={{ fontSize: 26 }}>💊</span>
      </div>
    </div>
  );
}

function CoachScreen({ messages, input, setInput, onSend, isLoading }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const chips = ['What should I eat now?', 'I feel nauseous', 'Adjust today\'s plan', 'How\'s my protein?', 'Pre-dose meal?'];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '10px 20px 12px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <p style={{ margin: 0, fontSize: 10, letterSpacing: '0.14em', color: C.amber, textTransform: 'uppercase' }}>NURA COACH</p>
        <p style={{ margin: 0, fontSize: 12, color: C.muted }}>GLP-1 aware · proactive nutrition AI</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 6px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 14, display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.amberSoft, border: `1px solid ${C.amberBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: C.amber, fontWeight: 600, flexShrink: 0, fontFamily: 'Cormorant, serif' }}>N</div>
            )}
            <div style={{ maxWidth: '80%', background: msg.role === 'user' ? C.amber : C.card, borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', padding: '11px 14px', border: msg.role === 'user' ? 'none' : `1px solid ${C.border}` }}>
              <p style={{ margin: 0, fontSize: 13.5, color: msg.role === 'user' ? '#1A0E00' : C.text, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ marginBottom: 14, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: C.amberSoft, border: `1px solid ${C.amberBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: C.amber, fontWeight: 600, fontFamily: 'Cormorant, serif' }}>N</div>
            <div style={{ background: C.card, borderRadius: '18px 18px 18px 4px', padding: '14px 18px', border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2].map(j => <div key={j} style={{ width: 5, height: 5, borderRadius: '50%', background: C.amber, animation: `nudge 1.2s ease-in-out ${j * 0.2}s infinite` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: '6px 14px', display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none', flexShrink: 0 }}>
        {chips.map(chip => (
          <button key={chip} onClick={() => onSend(chip)} style={{ flexShrink: 0, background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 20, padding: '5px 12px', color: C.muted, fontSize: 11.5, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>{chip}</button>
        ))}
      </div>

      <div style={{ padding: '8px 14px 22px', display: 'flex', gap: 9, alignItems: 'center', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())}
          placeholder="Ask anything about your nutrition..."
          style={{ flex: 1, background: C.card, border: `1px solid ${C.border}`, borderRadius: 24, padding: '10px 16px', color: C.text, fontSize: 13.5, outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
        />
        <button onClick={() => onSend()} disabled={!input.trim() || isLoading}
          style={{ width: 40, height: 40, borderRadius: '50%', background: input.trim() && !isLoading ? C.amber : C.dim, border: 'none', cursor: input.trim() && !isLoading ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: input.trim() && !isLoading ? '#1A0E00' : C.muted, transition: 'all 0.2s', flexShrink: 0 }}>
          ↑
        </button>
      </div>
    </div>
  );
}

function LogScreen() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [logged, setLogged] = useState(false);

  const simulatePhoto = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({ name: 'Grilled Chicken Bowl', protein: 42, cal: 376, carbs: 28, fat: 12, items: ['Grilled chicken breast (5.5 oz)', 'Brown rice (½ cup)', 'Roasted broccoli', 'Olive oil (½ tbsp)'] });
    }, 2400);
  };

  const simulateVoice = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({ name: voiceText || '3 carnitas tacos', protein: 34, cal: 520, carbs: 54, fat: 18, items: ['Carnitas (3oz)', 'Corn tortillas x3', 'Guacamole (2 tbsp)', 'Pico de gallo'] });
      setVoiceMode(false);
    }, 2000);
  };

  if (logged) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
      <h3 style={{ margin: '0 0 8px', fontSize: 22, fontFamily: 'Cormorant, serif', color: C.text, textAlign: 'center' }}>Meal logged.</h3>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: C.muted, textAlign: 'center' }}>NURA has updated your plan for the rest of the day.</p>
      <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: '14px 20px', width: '100%', marginBottom: 14 }}>
        <p style={{ margin: '0 0 4px', fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Updated Today Total</p>
        <p style={{ margin: 0, fontSize: 20, color: C.text, fontWeight: 500 }}>109g <span style={{ fontSize: 12, color: C.muted }}>protein · </span>1,056 <span style={{ fontSize: 12, color: C.muted }}>cal</span></p>
      </div>
      <button onClick={() => { setLogged(false); setResult(null); }} style={{ width: '100%', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 12, padding: '13px', color: C.text, fontSize: 14, cursor: 'pointer' }}>Log another meal</button>
    </div>
  );

  if (result) return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '18px 14px 24px' }}>
      <button onClick={() => setResult(null)} style={{ background: 'none', border: 'none', color: C.amber, cursor: 'pointer', fontSize: 13, marginBottom: 16, padding: 0 }}>← Back</button>
      <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        <div style={{ height: 110, background: `linear-gradient(135deg, rgba(212,146,74,0.15), rgba(37,34,48,0.8))`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 52 }}>🍗</div>
        <div style={{ padding: '18px 18px' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: 20, fontFamily: 'Cormorant, serif', color: C.text, fontWeight: 500 }}>{result.name}</h3>
          <p style={{ margin: '0 0 14px', fontSize: 12, color: C.muted }}>AI analyzed · tap to adjust</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
            {[{ l: 'Protein', v: `${result.protein}g`, c: C.amber }, { l: 'Calories', v: result.cal, c: C.text }, { l: 'Carbs', v: `${result.carbs}g`, c: C.blue }, { l: 'Fat', v: `${result.fat}g`, c: C.muted }].map(({ l, v, c }) => (
              <div key={l} style={{ textAlign: 'center', background: C.bg, borderRadius: 10, padding: '10px 4px' }}>
                <p style={{ margin: 0, fontSize: 16, color: c, fontWeight: 500 }}>{v}</p>
                <p style={{ margin: 0, fontSize: 10, color: C.muted }}>{l}</p>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginBottom: 18 }}>
            <p style={{ margin: '0 0 8px', fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Detected Items</p>
            {result.items.map((item, i) => <p key={i} style={{ margin: '5px 0', fontSize: 13, color: C.text }}>· {item}</p>)}
          </div>
          <button onClick={() => setLogged(true)} style={{ width: '100%', background: C.amber, border: 'none', borderRadius: 12, padding: '14px', color: '#1A0E00', fontSize: 15, fontWeight: 600, cursor: 'pointer', letterSpacing: '0.02em' }}>Log This Meal</button>
          <button onClick={() => setResult(null)} style={{ width: '100%', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px', color: C.muted, fontSize: 13, cursor: 'pointer', marginTop: 8 }}>Re-analyze</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '18px 14px 24px' }}>
      <p style={{ margin: '0 0 4px', fontSize: 10, letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase' }}>MEAL LOGGING</p>
      <h2 style={{ margin: '0 0 18px', fontSize: 28, fontFamily: 'Cormorant, serif', fontWeight: 500, color: C.text }}>What did you eat?</h2>

      {analyzing ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div style={{ fontSize: 44, marginBottom: 16 }}>🔍</div>
          <p style={{ color: C.text, fontSize: 16 }}>Analyzing your meal...</p>
          <p style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>Identifying foods · estimating portions</p>
        </div>
      ) : voiceMode ? (
        <div>
          <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.amberBorder}`, padding: '24px 20px', textAlign: 'center', marginBottom: 12 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: C.amberSoft, border: `2px solid ${C.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 14px' }}>🎙</div>
            <input value={voiceText} onChange={e => setVoiceText(e.target.value)} placeholder='"I had 3 carnitas tacos with guac..."' style={{ width: '100%', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 14px', color: C.text, fontSize: 13.5, outline: 'none', textAlign: 'center', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif' }} />
          </div>
          <button onClick={simulateVoice} style={{ width: '100%', background: C.amber, border: 'none', borderRadius: 12, padding: '13px', color: '#1A0E00', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>Analyze This</button>
          <button onClick={() => setVoiceMode(false)} style={{ width: '100%', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px', color: C.muted, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
        </div>
      ) : (
        <>
          <div onClick={simulatePhoto} style={{ background: C.card, borderRadius: 16, border: `2px dashed ${C.amberBorder}`, padding: '28px 20px', textAlign: 'center', marginBottom: 10, cursor: 'pointer' }}>
            <div style={{ fontSize: 42, marginBottom: 10 }}>📷</div>
            <p style={{ margin: 0, fontSize: 16, color: C.text, fontWeight: 500 }}>Snap Your Meal</p>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: C.muted }}>AI identifies foods &amp; estimates portions instantly</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { icon: '🎙', label: 'Voice Log', sub: 'Describe what you ate', action: () => setVoiceMode(true) },
              { icon: '⌨️', label: 'Quick Type', sub: 'Search 20M+ foods', action: () => {} },
            ].map(({ icon, label, sub, action }) => (
              <div key={label} onClick={action} style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: '18px 12px', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <p style={{ margin: 0, fontSize: 13.5, color: C.text, fontWeight: 500 }}>{label}</p>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: C.muted }}>{sub}</p>
              </div>
            ))}
          </div>

          <p style={{ margin: '0 0 10px', fontSize: 10, letterSpacing: '0.12em', color: C.muted, textTransform: 'uppercase' }}>RE-LOG RECENT</p>
          {[
            { name: 'Greek Yogurt + Berries', protein: 18, cal: 180, icon: '🫐', when: 'Today 8:30am' },
            { name: 'Grilled Chicken Salad', protein: 38, cal: 320, icon: '🥗', when: 'Yesterday lunch' },
            { name: 'Salmon + Broccoli', protein: 40, cal: 420, icon: '🐟', when: '2 days ago' },
            { name: 'Cottage Cheese Bowl', protein: 28, cal: 240, icon: '🥣', when: '3 days ago' },
          ].map((item, i) => (
            <div key={i} onClick={() => { setAnalyzing(true); setTimeout(() => { setAnalyzing(false); setResult({ name: item.name, protein: item.protein, cal: item.cal, carbs: 20, fat: 8, items: [item.name] }); }, 800); }} style={{ background: C.card, borderRadius: 12, border: `1px solid ${C.border}`, padding: '11px 14px', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 13, color: C.text }}>{item.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{item.when}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 13, color: C.amber, fontWeight: 500 }}>{item.protein}g</p>
                <p style={{ margin: 0, fontSize: 11, color: C.muted }}>{item.cal} cal</p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

function InsightsScreen() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const proteinData = [88, 104, 76, 95, 52, 118, 67];
  const calData = [1220, 1380, 1050, 1290, 890, 1420, 680];
  const maxP = 130;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '18px 14px 24px' }}>
      <p style={{ margin: '0 0 4px', fontSize: 10, letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase' }}>WEEKLY INTELLIGENCE</p>
      <h2 style={{ margin: '0 0 18px', fontSize: 28, fontFamily: 'Cormorant, serif', fontWeight: 500, color: C.text }}>Your patterns.</h2>

      <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: '18px 16px', marginBottom: 14 }}>
        <p style={{ margin: '0 0 14px', fontSize: 10, color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>7-DAY PROTEIN vs GOAL (120g)</p>
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 90, marginBottom: 8 }}>
          {days.map((day, i) => {
            const pct = proteinData[i] / maxP;
            const metGoal = proteinData[i] >= 120;
            const isToday = i === 6;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{ position: 'relative', width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                  <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${(120 / maxP) * 100}%`, borderTop: `1px dashed ${C.dim}`, pointerEvents: 'none' }} />
                  <div style={{ width: '100%', height: `${pct * 100}%`, background: metGoal ? C.amber : isToday ? C.dim : C.border, borderRadius: '4px 4px 0 0', minHeight: 4, border: isToday ? `1px solid ${C.amber}` : 'none' }} />
                </div>
                <p style={{ margin: 0, fontSize: 9.5, color: isToday ? C.amber : C.muted }}>{day}</p>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {[{ c: C.amber, l: 'Met 120g goal' }, { c: C.border, l: 'Below goal' }].map(({ c, l }) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      <p style={{ margin: '0 0 10px', fontSize: 10, letterSpacing: '0.14em', color: C.muted, textTransform: 'uppercase' }}>NURA NOTICED</p>

      {[
        { icon: '⚠️', title: 'Friday protein crash', body: 'You average 54g on Fridays — 55% below goal. It\'s your social eating day. Want a Friday plan built around restaurant meals?', color: '#B87A30', soft: 'rgba(184,122,48,0.08)' },
        { icon: '✅', title: 'Saturday is your best day', body: 'You\'ve hit protein goal every Saturday for 4 weeks. The pattern: Friday night meal prep. Let\'s protect that habit.', color: C.green, soft: C.greenSoft },
        { icon: '💡', title: 'Low-cal days spike nausea risk', body: '3 of 7 days were under 1,100 cal. On semaglutide, this can worsen nausea and accelerate muscle loss. Dose days: aim for 1,300+.', color: C.blue, soft: C.blueSoft },
        { icon: '💪', title: '22 days since you started tracking', body: 'Consistency is your strongest signal. Users who log 20+ days see 2.4× better muscle preservation outcomes on GLP-1.', color: C.amber, soft: C.amberSoft },
      ].map(({ icon, title, body, color, soft }, i) => (
        <div key={i} style={{ background: soft, borderRadius: 12, border: `1px solid ${color}40`, padding: '14px 15px', marginBottom: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 17, marginTop: 1, flexShrink: 0 }}>{icon}</span>
          <div>
            <p style={{ margin: '0 0 5px', fontSize: 13.5, color: C.text, fontWeight: 500 }}>{title}</p>
            <p style={{ margin: 0, fontSize: 12.5, color: C.muted, lineHeight: 1.65 }}>{body}</p>
          </div>
        </div>
      ))}

      <div style={{ background: C.amberSoft, borderRadius: 14, border: `1px solid ${C.amberBorder}`, padding: '16px 18px', marginTop: 4 }}>
        <p style={{ margin: '0 0 14px', fontSize: 10, color: C.amber, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}>WEEK AT A GLANCE</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {[
            { label: 'Avg protein', val: '86g', note: 'goal 120g' },
            { label: 'Goal days hit', val: '2 / 7', note: 'days' },
            { label: 'Avg calories', val: '1,162', note: 'goal 1,400' },
            { label: 'Water streak', val: '3 days', note: 'current' },
          ].map(({ label, val, note }) => (
            <div key={label}>
              <p style={{ margin: 0, fontSize: 10, color: C.muted }}>{label}</p>
              <p style={{ margin: '2px 0 0', fontSize: 18, color: C.text, fontWeight: 500 }}>{val} <span style={{ fontSize: 10, color: C.muted }}>{note}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavIcon({ id, active }) {
  const col = active ? C.amber : C.muted;
  const icons = {
    today: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="5" width="16" height="14" rx="2" stroke={col} strokeWidth="1.5" /><path d="M7 3v4M15 3v4M3 9h16" stroke={col} strokeWidth="1.5" strokeLinecap="round" /></svg>,
    coach: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 4h14a2 2 0 012 2v8a2 2 0 01-2 2H8l-4 3V6a2 2 0 012-2z" stroke={col} strokeWidth="1.5" fill="none" /><circle cx="8" cy="10" r="1" fill={col} /><circle cx="11" cy="10" r="1" fill={col} /><circle cx="14" cy="10" r="1" fill={col} /></svg>,
    log: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="4" stroke={col} strokeWidth="1.5" /><circle cx="11" cy="11" r="8" stroke={col} strokeWidth="1.5" opacity="0.35" /><path d="M11 2.5V1M11 21v-1.5M2.5 11H1M21 11h-1.5" stroke={col} strokeWidth="1.5" strokeLinecap="round" /></svg>,
    insights: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 16l5-5 4 3.5 6-7.5" stroke={col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="18" cy="7" r="1.5" fill={col} /></svg>,
  };
  return icons[id] || null;
}

export default function NuraApp() {
  const [tab, setTab] = useState('today');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Good morning, Sarah. Day 56 of your semaglutide journey — you're building real momentum.\n\nYou came in 18g short on protein yesterday. I've already adjusted today's lunch plan to compensate. Your dose window opens at 9pm tonight.\n\nWhat's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap';
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch (_) {} };
  }, []);

  const sendMessage = async (text) => {
    const msg = typeof text === 'string' ? text : input.trim();
    if (!msg || isLoading) return;
    setInput('');
    const next = [...messages, { role: 'user', content: msg }];
    setMessages(next);
    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are NURA Coach — a precision AI nutrition companion built for people on GLP-1 medications (semaglutide/tirzepatide). You are warm, specific, science-backed, and speak like an elite coach who truly understands GLP-1.

User: Sarah, 34
Medication: Semaglutide 1mg · Week 8 of 12
Current: 187 lbs → Goal: 165 lbs
Daily targets: 120g protein, 1,400 cal, 64oz water
Today so far: 67g protein, 680 cal, 32oz water, 1 meal (Greek yogurt + berries, 8:30am)
Yesterday: 102g protein, 1,180 cal

Principles:
- Protein is always priority #1 — muscle preservation on GLP-1 is critical
- Give specific meal suggestions with portions and timing
- Acknowledge nausea patterns; never push food when appetite is suppressed
- Be proactive — suggest next steps before asked
- Keep responses to 2-4 sentences unless detail is requested
- Warm, direct, no fluff or disclaimers`,
          messages: next,
        })
      });
      const data = await res.json();
      const reply = data.content?.find(b => b.type === 'text')?.text || "I'm here. What's on your mind?";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Quick connection hiccup. Try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = ['today', 'coach', 'log', 'insights'];
  const tabLabels = { today: 'Today', coach: 'Coach', log: 'Log', insights: 'Insights' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '24px 0 40px', minHeight: '100vh', fontFamily: 'DM Sans, sans-serif', background: 'transparent' }}>
      <div style={{ width: '100%', maxWidth: 400, background: C.bg, borderRadius: 36, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 800, position: 'relative', boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)' }}>

        {/* Status bar */}
        <div style={{ padding: '16px 26px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>9:41 AM</span>
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
              {[8, 11, 14, 17].map(h => <div key={h} style={{ width: 3, height: h, background: C.muted, borderRadius: 1 }} />)}
            </div>
            <div style={{ width: 20, height: 10, border: `1px solid ${C.muted}`, borderRadius: 2, position: 'relative', marginLeft: 4 }}>
              <div style={{ position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)', width: 3, height: 6, background: C.muted, borderRadius: '0 1px 1px 0' }} />
              <div style={{ margin: 1.5, height: 'calc(100% - 3px)', width: '85%', background: C.green, borderRadius: 1 }} />
            </div>
          </div>
        </div>

        {/* App header */}
        <div style={{ padding: '6px 26px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <p style={{ margin: 0, fontSize: 24, fontFamily: 'Cormorant, Georgia, serif', fontWeight: 500, color: C.amber, letterSpacing: '0.1em' }}>NURA</p>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.card, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>S</div>
        </div>

        {/* Screen */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {tab === 'today' && <TodayScreen setTab={setTab} />}
          {tab === 'coach' && <CoachScreen messages={messages} input={input} setInput={setInput} onSend={sendMessage} isLoading={isLoading} />}
          {tab === 'log' && <LogScreen />}
          {tab === 'insights' && <InsightsScreen />}
        </div>

        {/* Bottom nav */}
        <div style={{ flexShrink: 0, background: C.surface, borderTop: `1px solid ${C.border}`, padding: '10px 0 24px', display: 'flex' }}>
          {tabs.map(id => (
            <button key={id} onClick={() => setTab(id)} style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '5px 0' }}>
              <NavIcon id={id} active={tab === id} />
              <span style={{ fontSize: 9.5, color: tab === id ? C.amber : C.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{tabLabels[id]}</span>
              {tab === id && <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.amber, marginTop: 1 }} />}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes nudge {
          0%, 100% { opacity: 0.25; transform: translateY(2px); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0; background: transparent; }
        input::placeholder { color: #4A453F; }
        button { font-family: 'DM Sans', sans-serif; }
        p { font-family: 'DM Sans', sans-serif; }
      `}</style>
    </div>
  );
}
