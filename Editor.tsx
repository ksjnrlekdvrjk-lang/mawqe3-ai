"use client";

import { useMemo, useState } from "react";
import {
  AlignCenter, ArrowLeft, ChevronDown, ChevronRight, Code2, Eye, Image as ImageIcon,
  Layers3, LayoutTemplate, MessageSquare, MousePointer2, Plus, Redo2, Save,
  Settings2, Sparkles, Square, Trash2, Type, Undo2, Upload, WandSparkles,
  Smartphone, Tablet, Monitor, Globe, LockKeyhole, ShoppingCart, FormInput
} from "lucide-react";
import GoogleTranslate from "./GoogleTranslate";

type ElementType = "text" | "button" | "image" | "section" | "login" | "shop" | "form";

type SiteElement = {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  color?: string;
  bg?: string;
  radius?: number;
};

const initialElements: SiteElement[] = [
  { id: "hero", type: "section", name: "القسم الرئيسي", x: 30, y: 30, width: 740, height: 260, bg: "#111827", radius: 24 },
  { id: "title", type: "text", name: "العنوان الرئيسي", x: 90, y: 75, width: 520, height: 70, text: "أنشئ موقعك بالذكاء الاصطناعي", color: "#ffffff" },
  { id: "desc", type: "text", name: "الوصف", x: 90, y: 145, width: 480, height: 55, text: "صمم، عدّل، أصلح وانشر موقعك من مكان واحد.", color: "#cbd5e1" },
  { id: "login", type: "login", name: "زر تسجيل الدخول", x: 90, y: 215, width: 170, height: 48, text: "تسجيل الدخول", color: "#ffffff", bg: "#2563eb", radius: 12 },
  { id: "image", type: "image", name: "صورة المنتج", x: 540, y: 330, width: 230, height: 150, bg: "#1e293b", radius: 18 },
  { id: "shop", type: "shop", name: "بطاقة منتج", x: 30, y: 330, width: 470, height: 150, bg: "#0f172a", radius: 18 }
];

const palette: { type: ElementType; label: string; icon: React.ReactNode }[] = [
  { type: "section", label: "قسم", icon: <Square size={17}/> },
  { type: "text", label: "نص", icon: <Type size={17}/> },
  { type: "button", label: "زر", icon: <MousePointer2 size={17}/> },
  { type: "image", label: "صورة", icon: <ImageIcon size={17}/> },
  { type: "login", label: "تسجيل دخول", icon: <LockKeyhole size={17}/> },
  { type: "form", label: "نموذج", icon: <FormInput size={17}/> },
  { type: "shop", label: "منتج", icon: <ShoppingCart size={17}/> }
];

export default function Editor() {
  const [elements, setElements] = useState<SiteElement[]>(initialElements);
  const [selected, setSelected] = useState("hero");
  const [panel, setPanel] = useState<"components"|"layers"|"ai">("components");
  const [device, setDevice] = useState<"desktop"|"tablet"|"mobile">("desktop");
  const [preview, setPreview] = useState(false);
  const [aiText, setAiText] = useState("");
  const [saved, setSaved] = useState(false);

  const active = elements.find(e => e.id === selected);

  const addElement = (type: ElementType) => {
    const id = `${type}-${Date.now()}`;
    const defaults: Record<ElementType, Partial<SiteElement>> = {
      section: { name: "قسم جديد", width: 740, height: 180, bg: "#111827", radius: 18 },
      text: { name: "نص جديد", width: 300, height: 55, text: "اكتب النص هنا", color: "#fff" },
      button: { name: "زر جديد", width: 150, height: 48, text: "اضغط هنا", color: "#fff", bg: "#7c3aed", radius: 12 },
      image: { name: "صورة جديدة", width: 220, height: 140, bg: "#1e293b", radius: 16 },
      login: { name: "تسجيل الدخول", width: 170, height: 48, text: "تسجيل الدخول", color: "#fff", bg: "#2563eb", radius: 12 },
      form: { name: "نموذج تواصل", width: 320, height: 160, bg: "#0f172a", radius: 16 },
      shop: { name: "بطاقة منتج", width: 300, height: 160, bg: "#0f172a", radius: 16 }
    };
    const d = defaults[type];
    const item: SiteElement = {
      id, type, name: d.name || "عنصر", x: 60, y: 520 + elements.length * 10,
      width: d.width || 200, height: d.height || 100, ...d
    };
    setElements(prev => [...prev, item]);
    setSelected(id);
  };

  const updateActive = (patch: Partial<SiteElement>) => {
    setElements(prev => prev.map(e => e.id === selected ? { ...e, ...patch } : e));
  };

  const deleteActive = () => {
    if (!active) return;
    setElements(prev => prev.filter(e => e.id !== active.id));
    setSelected("");
  };

  const runAI = () => {
    if (!aiText.trim()) return;
    const t = aiText.toLowerCase();
    if (t.includes("تسجيل") || t.includes("login")) addElement("login");
    else if (t.includes("صورة")) addElement("image");
    else if (t.includes("منتج") || t.includes("متجر")) addElement("shop");
    else if (t.includes("قسم")) addElement("section");
    else if (active && (t.includes("لون") || t.includes("أزرق"))) updateActive({ bg: "#2563eb" });
    else if (active && t.includes("كبر")) updateActive({ width: Math.min(active.width + 80, 740), height: active.height + 20 });
    setAiText("");
  };

  const canvasWidth = device === "mobile" ? 390 : device === "tablet" ? 680 : 820;
  const sorted = useMemo(() => elements, [elements]);

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <header className="h-16 border-b border-slate-800 bg-[#0b1020] flex items-center justify-between px-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 grid place-items-center font-black">م</div>
          <div>
            <div className="font-bold">موقع AI</div>
            <div className="text-[11px] text-slate-400">محرر المواقع والتطبيقات</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDevice("desktop")} className={`p-2 rounded-lg ${device==="desktop"?"bg-slate-700":"hover:bg-slate-800"}`}><Monitor size={17}/></button>
          <button onClick={() => setDevice("tablet")} className={`p-2 rounded-lg ${device==="tablet"?"bg-slate-700":"hover:bg-slate-800"}`}><Tablet size={17}/></button>
          <button onClick={() => setDevice("mobile")} className={`p-2 rounded-lg ${device==="mobile"?"bg-slate-700":"hover:bg-slate-800"}`}><Smartphone size={17}/></button>
          <button onClick={() => setPreview(!preview)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700"><Eye size={16}/>{preview?"تحرير":"معاينة"}</button>
          <button onClick={() => { setSaved(true); setTimeout(()=>setSaved(false),1500); }} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"><Save size={16}/>{saved?"تم الحفظ":"حفظ"}</button>
        </div>
      </header>

      <div className="h-[calc(100vh-64px)] flex overflow-hidden">
        <aside className="w-[280px] shrink-0 border-l border-slate-800 bg-[#0b1020] p-3 overflow-y-auto">
          <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl mb-3">
            <button onClick={()=>setPanel("components")} className={`py-2 rounded-lg text-xs ${panel==="components"?"bg-slate-700":"text-slate-400"}`}>المكونات</button>
            <button onClick={()=>setPanel("layers")} className={`py-2 rounded-lg text-xs ${panel==="layers"?"bg-slate-700":"text-slate-400"}`}>الطبقات</button>
            <button onClick={()=>setPanel("ai")} className={`py-2 rounded-lg text-xs ${panel==="ai"?"bg-slate-700":"text-slate-400"}`}>AI</button>
          </div>

          {panel==="components" && <>
            <div className="flex items-center justify-between mb-2"><b>إضافة مكونات</b><Plus size={16}/></div>
            <div className="grid grid-cols-2 gap-2">
              {palette.map(p => <button key={p.type} onClick={()=>addElement(p.type)} className="border border-slate-800 hover:border-blue-500 bg-slate-900 rounded-xl p-3 text-right">
                <div className="text-blue-400 mb-2">{p.icon}</div><div className="text-xs">{p.label}</div>
              </button>)}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs font-bold mb-2">Google Translate</div>
              <GoogleTranslate/>
            </div>
          </>}

          {panel==="layers" && <div className="space-y-1">
            {sorted.map(e => <button key={e.id} onClick={()=>setSelected(e.id)} className={`w-full flex items-center gap-2 p-2 rounded-lg text-sm ${selected===e.id?"bg-blue-600":"hover:bg-slate-800"}`}>
              <ChevronRight size={14}/><span>{e.name}</span>
            </button>)}
          </div>}

          {panel==="ai" && <div>
            <div className="p-3 rounded-xl bg-gradient-to-b from-blue-950 to-slate-900 border border-blue-900/60">
              <div className="flex items-center gap-2 font-bold"><Sparkles size={17} className="text-blue-400"/> مساعد موقع AI</div>
              <p className="text-xs text-slate-400 mt-2">اكتب طلبًا وسنربطه بالمحرر. هذه النسخة الأولى تجريبية.</p>
              <textarea value={aiText} onChange={e=>setAiText(e.target.value)} placeholder="مثال: أضف زر تسجيل الدخول" className="mt-3 w-full h-24 bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm outline-none focus:border-blue-500"/>
              <button onClick={runAI} className="mt-2 w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center gap-2"><WandSparkles size={16}/> تنفيذ</button>
            </div>
          </div>}
        </aside>

        <section className="flex-1 overflow-auto bg-[#0a0f1b]">
          <div className="min-w-fit min-h-full p-8">
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-400"><Globe size={14}/> الصفحة الرئيسية <ChevronLeftIcon/></div>
            <div className={`mx-auto relative editor-grid bg-white shadow-2xl overflow-hidden ${preview?"pointer-events-none":""}`}
              style={{ width: canvasWidth, minHeight: 760, borderRadius: 12, direction:"ltr" }}>
              {elements.map(e => (
                <div key={e.id} onClick={(ev)=>{ev.stopPropagation(); setSelected(e.id)}} className={`absolute ${selected===e.id&&!preview?"ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent":""}`}
                  style={{ left:e.x, top:e.y, width:e.width, height:e.height, background:e.bg, borderRadius:e.radius, color:e.color }}>
                  {e.type==="text" && <div dir="rtl" className="p-2 whitespace-pre-wrap font-bold text-lg">{e.text}</div>}
                  {(e.type==="button"||e.type==="login") && <button className="w-full h-full font-bold" style={{color:e.color,background:e.bg,borderRadius:e.radius}}>{e.text}</button>}
                  {e.type==="image" && <div className="w-full h-full grid place-items-center text-slate-500"><ImageIcon size={35}/><span className="text-xs">اسحب صورة هنا</span></div>}
                  {e.type==="section" && <div className="p-4 text-slate-500 text-xs" dir="rtl">قسم — {e.name}</div>}
                  {e.type==="shop" && <div dir="rtl" className="p-4"><div className="text-sm font-bold">منتج تجريبي</div><div className="text-xs text-slate-400 mt-2">وصف المنتج والسعر والشراء</div></div>}
                  {e.type==="form" && <div dir="rtl" className="p-4 space-y-2"><div className="font-bold text-sm">نموذج تواصل</div><div className="h-7 bg-slate-800 rounded"/><div className="h-7 bg-slate-800 rounded"/></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="w-[300px] shrink-0 border-r border-slate-800 bg-[#0b1020] p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4"><b>الخصائص</b><Settings2 size={17}/></div>
          {!active ? <div className="text-sm text-slate-500">حدد عنصرًا من الصفحة</div> : <div className="space-y-4">
            <div className="text-xs text-slate-400">العنصر: <span className="text-white">{active.name}</span></div>
            <label className="block text-xs">الاسم<input value={active.name} onChange={e=>updateActive({name:e.target.value})} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2"/></label>
            {"text" in active && <label className="block text-xs">النص<textarea value={active.text||""} onChange={e=>updateActive({text:e.target.value})} className="mt-1 w-full h-20 bg-slate-900 border border-slate-700 rounded-lg p-2"/></label>}
            <div className="grid grid-cols-2 gap-2">
              <Field label="X" value={active.x} onChange={v=>updateActive({x:v})}/>
              <Field label="Y" value={active.y} onChange={v=>updateActive({y:v})}/>
              <Field label="العرض" value={active.width} onChange={v=>updateActive({width:v})}/>
              <Field label="الارتفاع" value={active.height} onChange={v=>updateActive({height:v})}/>
              <Field label="الزوايا" value={active.radius||0} onChange={v=>updateActive({radius:v})}/>
            </div>
            <label className="block text-xs">لون الخلفية<input type="color" value={active.bg||"#111827"} onChange={e=>updateActive({bg:e.target.value})} className="mt-1 w-full h-10 bg-slate-900 border border-slate-700 rounded-lg"/></label>
            <label className="block text-xs">لون النص<input type="color" value={active.color||"#ffffff"} onChange={e=>updateActive({color:e.target.value})} className="mt-1 w-full h-10 bg-slate-900 border border-slate-700 rounded-lg"/></label>
            <button onClick={deleteActive} className="w-full py-2 rounded-lg bg-red-950 text-red-300 hover:bg-red-900 flex items-center justify-center gap-2"><Trash2 size={16}/> حذف العنصر</button>
          </div>}
        </aside>
      </div>
    </main>
  );
}

function Field({label,value,onChange}:{label:string,value:number,onChange:(v:number)=>void}) {
  return <label className="text-xs">{label}<input type="number" value={value} onChange={e=>onChange(Number(e.target.value))} className="mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg p-2"/></label>
}
function ChevronLeftIcon(){ return <ArrowLeft size={13}/> }
