import mandatos from '@data/mandatos.json';
import inflacion from '@data/indicadores/inflacion.json';
import desempleo from '@data/indicadores/desempleo.json';
import trm from '@data/indicadores/trm.json';
import deudaExternaPib from '@data/indicadores/deuda-externa-pib.json';
import deudaPerCapita from '@data/indicadores/deuda-per-capita.json';
import deudaTotalGnc from '@data/indicadores/deuda-total-gnc.json';
import lideresSociales from '@data/indicadores/lideres-sociales.json';
import natalidad from '@data/indicadores/natalidad.json';
import ied from '@data/indicadores/ied.json';
import inversionPublica from '@data/indicadores/inversion-publica.json';
import fecundidad from '@data/indicadores/fecundidad.json';
import pibCrecimiento from '@data/indicadores/pib-crecimiento.json';
import salarioMinimo from '@data/indicadores/salario-minimo.json';
import gasolina from '@data/indicadores/gasolina.json';
import pobrezaMonetaria from '@data/indicadores/pobreza-monetaria.json';
import pobrezaExtrema from '@data/indicadores/pobreza-extrema.json';
import homicidiosTasa from '@data/indicadores/homicidios-tasa.json';
import secuestro from '@data/indicadores/secuestro.json';
import extorsion from '@data/indicadores/extorsion.json';
import cocaHectareas from '@data/indicadores/coca-hectareas.json';
import congreso from '@data/congreso.json';
import gabinetes from '@data/gabinetes.json';
import elecciones from '@data/elecciones.json';
import presidentes from '@data/presidentes.json';

// ponytail: explicit list. New indicator = add JSON + one import line here. YAGNI on dynamic glob.
// Orden temático: economía → social → seguridad.
export const indicadores = [
  pibCrecimiento, inflacion, desempleo, salarioMinimo, gasolina, trm, ied, inversionPublica,
  deudaExternaPib, deudaTotalGnc, deudaPerCapita,
  pobrezaMonetaria, pobrezaExtrema, natalidad, fecundidad,
  homicidiosTasa, secuestro, extorsion, lideresSociales, cocaHectareas,
];
export { mandatos, congreso, gabinetes, elecciones };

export const getIndicador = (id) => indicadores.find((i) => i.id === id);
export const getMandato = (id) => mandatos.find((m) => m.id === id);

// --- Presidentes: slug SEO, vigencia y datos por presidente ---
const kebab = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
// Path indexable: nombre-año (dos periodos de un mismo presidente los separa el año).
export const slugMandato = (m) => `${kebab(m.presidente)}-${m.inicio.slice(0, 4)}`;
export const getMandatoBySlug = (slug) => mandatos.find((m) => slugMandato(m) === slug);

// Un mandato es futuro si aún no toma posesión.
export const esFuturo = (m) => new Date(m.inicio) > new Date();

// Presidente vigente hoy (cae en [inicio,fin)); si no, el último ya posesionado.
export const mandatoVigente = () => {
  const hoy = new Date();
  return mandatos.find((m) => hoy >= new Date(m.inicio) && hoy < new Date(m.fin))
    ?? [...mandatos].reverse().find((m) => new Date(m.inicio) <= hoy)
    ?? mandatos[mandatos.length - 1];
};

// "Otros movimientos e independientes" y similares son buckets, no un partido.
const esAgregado = (nombre) => /^otros/i.test(nombre);
const mayoria = (s) => {
  const idxs = s.partidos.map((_, i) => i).filter((i) => !esAgregado(s.partidos[i].partido));
  if (!idxs.length) return null;
  const idx = idxs.reduce((b, i) => (s.partidos[i].curules > s.partidos[b].curules ? i : b), idxs[0]);
  return { ...s.partidos[idx], idx, pct: (s.partidos[idx].curules / s.total) * 100 };
};

// ¿el cambio del indicador fue "a mejor"? (según mejorEs)
export const mejoro = (ind, fila) =>
  !fila || fila.sinDatos || fila.delta === 0 ? null : ind.mejorEs === 'menor' ? fila.delta < 0 : fila.delta > 0;

// Todo lo que un panel de presidente necesita, ya computado.
export const datosPresidente = (m) => {
  const periodo = congreso.periodos.find((p) => p.mandato === m.id) ?? {};
  const sen = segmentos(periodo.senado ?? {});
  const cam = segmentos(periodo.camara ?? {});
  return {
    m,
    futuro: esFuturo(m),
    perfil: presidentes.perfiles.find((p) => p.presidente === m.presidente) ?? null,
    eleccion: elecciones.resultados[m.id] ?? null,
    sen, cam,
    senMay: mayoria(sen),
    camMay: mayoria(cam),
    indicadoresM: indicadores.map((ind) => ({ ind, fila: statsPorMandato(ind).find((f) => f.mandato.id === m.id) })),
  };
};

// Un indicador es "publicable" si tiene al menos 2 puntos con valor.
export const tieneDatos = (ind) => ind.serie.filter((p) => p.valor != null).length >= 2;

// Color por bloque respecto al gobierno.
export const colorBloque = (bloque) =>
  bloque === 'gobierno' ? '#4A7C2E' : bloque === 'oposicion' ? '#B4341C' : '#6B6B63';

// --- Hemiciclo (Senado / Cámara) ---
const ordenBloque = { oposicion: 0, independiente: 1, gobierno: 2 };
// Partidos ordenados: oposición → independiente → gobierno (izq→der en el arco).
export const segmentos = (camaraOsenado) => {
  const partidos = (camaraOsenado?.partidos ?? [])
    .filter((x) => x.curules > 0)
    .sort((a, b) =>
      ordenBloque[a.bloque] === ordenBloque[b.bloque]
        ? b.curules - a.curules
        : ordenBloque[a.bloque] - ordenBloque[b.bloque],
    );
  const total = camaraOsenado?.total ?? partidos.reduce((s, x) => s + x.curules, 0);
  return { partidos, total };
};

const paleta = [
  '#B4341C', '#D9642A', '#E0A526', '#4A7C2E', '#2E8B6B', '#3E7CB1',
  '#5A4FCF', '#8E44AD', '#C0399B', '#6B6B63', '#7A4E2D', '#9C1D3E',
  '#2C6E7F', '#B58B00', '#5C6B2E', '#A05A2C',
];
export const colorPartido = (i) => paleta[i % paleta.length];

// Asientos del hemiciclo ordenados izq→der (por ángulo), en coords SVG.
const hemiciclo = (total, cx = 200, cy = 200, rIn = 72, rOut = 188) => {
  const rows = Math.min(10, Math.max(4, Math.round(Math.sqrt(total / 2.2))));
  const radii = Array.from({ length: rows }, (_, i) => rIn + ((rOut - rIn) * i) / (rows - 1));
  const sumR = radii.reduce((a, b) => a + b, 0);
  const counts = radii.map((r) => Math.max(1, Math.round((total * r) / sumR)));
  let diff = total - counts.reduce((a, b) => a + b, 0);
  const order = counts.map((_, k) => k).sort((a, b) => radii[b] - radii[a]); // filas externas primero
  while (diff !== 0) {
    for (const k of order) {
      if (diff === 0) break;
      if (diff > 0) { counts[k]++; diff--; }
      else if (counts[k] > 1) { counts[k]--; diff++; }
    }
  }
  const seats = [];
  radii.forEach((R, i) => {
    for (let j = 0; j < counts[i]; j++) {
      const t = counts[i] === 1 ? 0.5 : (j + 0.5) / counts[i];
      const ang = Math.PI * (1 - t); // π (izq) → 0 (der)
      seats.push({ x: cx + R * Math.cos(ang), y: cy - R * Math.sin(ang), ang });
    }
  });
  return seats.sort((a, b) => b.ang - a.ang);
};

// Cada asiento con su color de partido, en orden izq→der.
export const asientosColoreados = (partidos, total) => {
  const colores = [];
  partidos.forEach((p, i) => {
    for (let k = 0; k < p.curules; k++) colores.push({ color: colorPartido(i), partido: p.partido });
  });
  const seats = hemiciclo(colores.length || total);
  return seats.map((s, i) => ({ ...s, ...(colores[i] ?? { color: '#ccc', partido: '' }) }));
};

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
  if (unidad === 'USD M') return `US$${Math.round(v).toLocaleString('es-CO')} M`;
  if (unidad === 'billones COP') return `$${v.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} B`;
  if (unidad === 'hijos por mujer') return v.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  if (unidad === 'por 100k') return v.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  if (unidad === 'COP') return v >= 1e6 ? `$${(v / 1e6).toFixed(2)}M` : `$${Math.round(v / 1e3)}k`;
  if (unidad === 'COP/gal') return `$${Math.round(v).toLocaleString('es-CO')}`;
  if (unidad === 'ha') return `${Math.round(v).toLocaleString('es-CO')} ha`;
  if (unidad === 'casos') return `${Math.round(v).toLocaleString('es-CO')}`;
  return v.toLocaleString('es-CO');
};

// --- Insignias: logros y alertas de cada gobierno, derivados de los datos (no editorial).
// Neutral por diseño: la cifra decide el tono. Para cada indicador con datos en el mandato,
// marca si alcanzó el mejor/peor valor de toda la serie (récord) o un movimiento fuerte (≥15%).
export const insigniasPorMandato = (m) => {
  const badges = [];
  for (const ind of indicadores) {
    const fila = statsPorMandato(ind).find((f) => f.mandato.id === m.id);
    if (!fila || fila.sinDatos) continue;
    const valores = ind.serie.filter((p) => p.valor != null).map((p) => p.valor);
    if (valores.length < 4) continue; // serie corta: no hay contexto para "récord de la serie"
    const menorMejor = ind.mejorEs === 'menor';
    const mejorVal = menorMejor ? Math.min(...valores) : Math.max(...valores);
    const peorVal = menorMejor ? Math.max(...valores) : Math.min(...valores);
    const puntos = ind.serie
      .filter((p) => p.valor != null && mandatoDePunto(p.fecha)?.id === m.id)
      .map((p) => p.valor);

    if (puntos.includes(mejorVal)) {
      badges.push({ ind: ind.id, tono: 'bien', texto: `${ind.nombre}: mejor de la serie`, valor: fmt(mejorVal, ind.unidad), peso: 3 });
    } else if (puntos.includes(peorVal)) {
      badges.push({ ind: ind.id, tono: 'mal', texto: `${ind.nombre}: peor de la serie`, valor: fmt(peorVal, ind.unidad), peso: 3 });
    } else if (fila.deltaPct != null && Math.abs(fila.deltaPct) >= 15) {
      const ok = mejoro(ind, fila);
      badges.push({
        ind: ind.id, tono: ok ? 'bien' : 'mal',
        texto: `${ind.nombre} ${ok ? '▼ mejoró' : '▲ empeoró'} ${Math.abs(fila.deltaPct).toFixed(0)}%`,
        valor: fmt(fila.ultimo, ind.unidad),
        peso: 1 + Math.min(1, Math.abs(fila.deltaPct) / 50),
      });
    }
  }
  return badges.sort((a, b) => b.peso - a.peso).slice(0, 6);
};
