import { Locale } from "@/lib/i18n";

export function Logo({ locale }: { locale?: Locale }) {
  return (
    <div className="flex items-center gap-2.5 group">
      <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--primary)] to-orange-600 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
        <span className="font-black text-white text-lg tracking-tighter leading-none select-none font-sans">
          OK
        </span>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-white flex flex-col items-center justify-center overflow-hidden">
           {/* Small dot or icon, here just a decorative element like the NL flag colors conceptually */}
           <div className="w-full h-1/3 bg-[#AE1C28]"></div>
           <div className="w-full h-1/3 bg-white"></div>
           <div className="w-full h-1/3 bg-[#21468B]"></div>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-none group-hover:text-[var(--primary)] transition-colors">
          open-knm
        </span>
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-400 leading-tight mt-0.5">
          {locale === 'zh' ? '荷兰融入指南' : 'Knowledge Hub'}
        </span>
      </div>
    </div>
  );
}





