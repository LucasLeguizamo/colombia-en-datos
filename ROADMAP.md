# Roadmap — Colombia en Datos

**Norte:** ser LA referencia que la gente cita cuando discute "a qué gobierno le fue mejor" — el link que se pega en la pelea de X/WhatsApp y cierra la discusión con datos oficiales.

**Ventana de lanzamiento: 7 de agosto de 2026** — posesión del nuevo presidente. El mandato de Petro se cierra y TODO el país va a estar comparando gobiernos esa semana. Un sitio que muestre "el gobierno Petro completo, en datos, junto a Uribe/Santos/Duque" lanzado ese día tiene su momento de máxima demanda garantizado. Faltan ~4 semanas: el alcance del MVP se recorta a lo que quepa, la fecha no se mueve.

---

## Fase 0 — Datos core (semanas 1–2, jul 2026)

La credibilidad es el producto. Sin datos impecables no hay nada.

- Esquema JSON definitivo: serie, unidad, fuente, `sourceUrl`, `methodologyBreak`.
- Ingesta manual (script, no pipeline aún) de los **3 indicadores estrella**: TRM, inflación, desempleo — historia completa 2002–2026.
- Definición de mandatos con fechas exactas de posesión (el corte importa: ¿la inflación de agosto 2026 es de Petro o del entrante? Regla explícita y documentada).
- **Verificación cruzada**: cada serie contrastada contra 2 fuentes antes de publicar. Un solo dato malo el día del lanzamiento mata el proyecto.

**Salida:** `data/` con 3 series completas y verificadas.

## Fase 1 — MVP web + lanzamiento (semanas 3–4 → 7 de agosto)

- Una página por indicador: gráfica con bandas de color por mandato + tabla inicio/fin/promedio/delta por gobierno.
- Página "Balance Petro 2022–2026": el contenido diseñado para compartirse esa semana.
- **OG images por indicador**: la gráfica ES la imagen al pegar el link en X/WhatsApp. Esto es el 50% de la distribución — no es opcional.
- Bilingüe no; español primero. English después (audiencia es Colombia).
- Deploy en Vercel con dominio propio (`colombiaendatos.co` o similar — comprar ya).
- **Lanzamiento 7 de agosto**: hilo en X con las 3 gráficas del balance Petro, post con metodología transparente, repo público desde el día uno.

**Métrica de éxito:** el link citado por al menos 1 cuenta grande (periodista/economista) la semana de posesión.

## Fase 2 — Amplitud + CLI (ago–sep 2026)

- Los otros 7 indicadores v1 (deuda externa, tasas TES, PIB, intervención BanRep, reservas, salario mínimo real, EMBI).
- Página "Compara dos gobiernos" (elige 2 mandatos, todos los indicadores lado a lado) — la feature más compartible.
- CLI `npx coldata` (lee los mismos JSON). Público objetivo: periodistas de datos y devs — los multiplicadores.
- Embeds: `<iframe>` por gráfica para que medios la incrusten con crédito. Cada embed es un backlink y un lector nuevo.

## Fase 3 — Pipeline + comunidad (oct–dic 2026)

- GitHub Action mensual: ingesta → PR con datos nuevos → revisión humana → merge. El sitio se actualiza solo.
- CONTRIBUTING.md + issues "good first indicator": convertir correcciones en contribuidores.
- Newsletter mensual mínima: "el mes en 5 datos" (reusa los JSON, cero contenido nuevo).
- Indicadores v2: pobreza monetaria, Gini, IED, exportaciones, petróleo vs presupuesto.

## Fase 4 — Máxima expresión (2027)

- **API pública documentada** (`api.colombiaendatos.co`) — que otros construyan encima; cada app que la use cementa el proyecto como infraestructura.
- **MCP server**: que cualquier agente de IA pueda responder "¿cómo estaba el desempleo con Duque?" citando el sitio. (Sinergia directa con lo aprendido en OpenTicket.)
- Datos subnacionales (desempleo por ciudad, pobreza por departamento).
- Alianza con una facultad de economía o un medio de datos (La Silla Vacía, Datasketch) para validación metodológica pública — el sello de seriedad.
- Réplica del modelo a otro país (Argentina/México) si la arquitectura aguanta: el repo se vuelve plantilla de "país en datos".

---

## Métricas de impacto

| Horizonte | Métrica | Meta |
|---|---|---|
| Ago 2026 | Visitas semana de lanzamiento / cita de cuenta grande | 10k visitas · ≥1 cita |
| Dic 2026 | Embeds activos en medios · stars del repo | 5 medios · 300 stars |
| 2027 | Consumidores de API/MCP · contribuidores externos | 20 integraciones · 10 contribuidores |

## Riesgos

- **Politización**: el proyecto muere si parece de un bando. Antídoto: metodología pública, fuentes oficiales linkeadas, cero adjetivos en el sitio, y mostrar datos que incomodan a TODOS los gobiernos por igual.
- **Series incompletas 2002+**: algunas APIs oficiales no llegan tan atrás. Antídoto: fase 0 valida cobertura antes de prometer; huecos se muestran como huecos (`null`), no se interpolan.
- **La fecha**: 4 semanas es apretado. Antídoto: el MVP es 3 indicadores y 2 páginas. Todo lo demás es fase 2.
