import mandatos from '@data/mandatos.json';
import inflacion from '@data/indicadores/inflacion.json';
import desempleo from '@data/indicadores/desempleo.json';
import trm from '@data/indicadores/trm.json';

// ponytail: explicit list. New indicator = add JSON + one import line here. YAGNI on dynamic glob.
export const indicadores = [inflacion, desempleo, trm];
export { mandatos };

export const getIndicador = (id) => indicadores.find((i) => i.id === id);

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
  return v.toLocaleString('es-CO');
};
