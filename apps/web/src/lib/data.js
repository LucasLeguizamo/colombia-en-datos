import mandatos from '@data/mandatos.json';
import inflacion from '@data/indicadores/inflacion.json';
import desempleo from '@data/indicadores/desempleo.json';
import trm from '@data/indicadores/trm.json';
import deudaExternaPib from '@data/indicadores/deuda-externa-pib.json';
import deudaPerCapita from '@data/indicadores/deuda-per-capita.json';
import deudaTotalGnc from '@data/indicadores/deuda-total-gnc.json';
import congreso from '@data/congreso.json';
import gabinetes from '@data/gabinetes.json';

// ponytail: explicit list. New indicator = add JSON + one import line here. YAGNI on dynamic glob.
export const indicadores = [inflacion, desempleo, trm, deudaExternaPib, deudaTotalGnc, deudaPerCapita];
export { mandatos, congreso, gabinetes };

export const getIndicador = (id) => indicadores.find((i) => i.id === id);
export const getMandato = (id) => mandatos.find((m) => m.id === id);

// Un indicador es "publicable" si tiene al menos 2 puntos con valor.
export const tieneDatos = (ind) => ind.serie.filter((p) => p.valor != null).length >= 2;

// Color por bloque respecto al gobierno.
export const colorBloque = (bloque) =>
  bloque === 'gobierno' ? '#4A7C2E' : bloque === 'oposicion' ? '#B4341C' : '#6B6B63';

// Normaliza cualquier 'fecha' (YYYY | YYYY-MM | YYYY-MM-DD) a Date del primer día del período.
const toDate = (f) => new Date(`${f.length === 4 ? `${f}-01-01` : f.length === 7 ? `${f}-01` : f}T00:00:00Z`);

// Un punto pertenece al mandato cuyo [inicio, fin) lo contiene.
export const mandatoDePunto = (fecha) => {
  const d = toDate(fecha);
  return mandatos.find((m) => d >= new Date(m.inicio) && d < new Date(m.fin));
};

// Estadísticas por mandato para un indicador: inicio, fin, promedio, delta absoluto y %.
export const statsPorMandato = (indicador) => {
  return mandatos.map((m) => {
    const puntos = indicador.serie.filter(
      (p) => p.valor != null && mandatoDePunto(p.fecha)?.id === m.id,
    );
    if (puntos.length === 0) return { mandato: m, sinDatos: true };
    const primero = puntos[0].valor;
    const ultimo = puntos[puntos.length - 1].valor;
    const promedio = puntos.reduce((s, p) => s + p.valor, 0) / puntos.length;
    const delta = ultimo - primero;
    const deltaPct = primero !== 0 ? (delta / primero) * 100 : null;
    return { mandato: m, sinDatos: false, primero, ultimo, promedio, delta, deltaPct, n: puntos.length };
  });
};

export const fmt = (v, unidad) => {
  if (v == null) return '—';
  if (unidad === '%') return `${v.toFixed(1)}%`;
  if (unidad === 'COP/USD') return `$${Math.round(v).toLocaleString('es-CO')}`;
  if (unidad === 'COP/hab') return `$${(v / 1e6).toFixed(1)}M`;
  return v.toLocaleString('es-CO');
};
