// Mizan: Astro Fonts API'nin ürettiği @font-face kuralları. <Font /> bunları satır içi
// <style> olarak basar; sitenin CSP'si (style-src 'self') satır içi stile izin vermediği için
// aynı CSS burada ayrı bir dosya olarak (assets/css/fonts.css) yazılır.
// @ts-expect-error — Astro'nun iç sanal modülü (astro/components/Font.astro da bunu kullanır)
import { componentDataByCssVariable } from 'virtual:astro:assets/fonts/internal';

export const prerender = true;

export const GET = () => {
  const data = componentDataByCssVariable.get('--font-inter');
  if (!data) throw new Error('--font-inter bulunamadı (astro.config.ts → fonts)');
  return new Response(data.css, { headers: { 'Content-Type': 'text/css; charset=utf-8' } });
};
