# Colombia en Datos

Plataforma open source y 100% pública con los indicadores económicos de Colombia, organizados por mandato presidencial desde Uribe I (2002) hasta hoy. Web + CLI. El objetivo: que cualquier persona pueda ver, comparar y descargar el panorama económico de cada gobierno sin sesgo, con la fuente oficial de cada dato.

## Por qué existe

Los datos existen (Banco de la República, DANE, MinHacienda) pero están dispersos, en formatos hostiles y nadie los presenta por período de gobierno. La discusión pública sobre "a quién le fue mejor" se da sin datos a la mano.

## Indicadores (v1)

| Indicador | Fuente oficial | Frecuencia |
|---|---|---|
| Deuda externa (total, % PIB) | Banco de la República | Trimestral |
| Tasa de interés de la deuda / TES | MinHacienda / BanRep | Mensual |
| TRM (precio del dólar) | BanRep / Superfinanciera | Diaria |
| Inflación (IPC) | DANE | Mensual |
| Desempleo | DANE (GEIH) | Mensual |
| PIB (crecimiento) | DANE | Trimestral |
| Tasa de intervención BanRep | BanRep | Por decisión |
| Reservas internacionales | BanRep | Mensual |
| Salario mínimo (nominal y real) | MinTrabajo | Anual |
| Riesgo país (EMBI) | JP Morgan (vía BanRep) | Diaria |

Backlog v2: pobreza monetaria, Gini, exportaciones/importaciones, inversión extranjera directa, precio del petróleo vs presupuesto.

## Períodos presidenciales

Uribe I (2002–2006) · Uribe II (2006–2010) · Santos I (2010–2014) · Santos II (2014–2018) · Duque (2018–2022) · Petro (2022–2026) · siguientes.

Cada indicador se puede ver: serie completa, recortado por mandato, y comparativo entre mandatos (valor inicial, final, promedio, delta %).

## Arquitectura

```
colombia-en-datos/
├── apps/
│   ├── web/          # Astro (SSG) en Vercel — gráficas SVG y comparativos
│   └── cli/          # npm: npx coldata — consultas desde terminal
├── packages/
│   └── data/         # JSON versionado: la fuente de verdad
└── pipeline/         # Scripts de ingesta desde APIs oficiales (GitHub Action mensual)
```

Principios:

- **Datos como archivos JSON versionados en el repo**, no base de datos. Git da historia, auditoría y PRs de corrección gratis. La web y el CLI leen los mismos JSON.
- **Pipeline con GitHub Actions** (cron mensual) que consulta las APIs oficiales, normaliza y abre un PR con los datos nuevos — revisión humana antes de merge.
- **Cada dato lleva su fuente y URL** en el JSON. Sin fuente, no entra.
- Web estática (SSG con Astro, gráficas SVG server-rendered) — gratis en Vercel, sin backend ni JS de cliente.

### Correr la web localmente

```bash
cd apps/web
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/ estático
```

## CLI

```bash
npx coldata inflacion --desde 2002              # serie completa
npx coldata trm --mandato petro                 # recorte por gobierno
npx coldata comparar desempleo uribe1 duque     # comparativo
npx coldata export deuda-externa --json > d.json
```

## Fuentes de datos (APIs)

- **Banco de la República**: API de estadísticas (series SUAMECA) — TRM, tasas, reservas, deuda.
- **DANE**: no tiene API estable; scraping de boletines + datos.gov.co (Socrata API).
- **datos.gov.co**: Socrata, API abierta, cubre varios datasets oficiales.
- **Decisión pendiente**: validar cobertura histórica 2002+ de cada API antes de fijar el esquema (algunas series oficiales arrancan después).

## Roadmap

1. **Fase 0 — Datos**: esquema JSON, ingesta manual de 3 indicadores (TRM, inflación, desempleo) con historia completa 2002+.
2. **Fase 1 — Web MVP**: una gráfica por indicador con bandas de color por mandato + tabla comparativa. Deploy público.
3. **Fase 2 — CLI**: `npx coldata`, lee los mismos JSON desde el repo (raw.githubusercontent).
4. **Fase 3 — Pipeline**: GitHub Action mensual con PR automático.
5. **Fase 4 — Resto de indicadores** + página "compara dos gobiernos".

## Licencia y comunidad

MIT para el código, CC0/ODbL para los datos. CONTRIBUTING.md con el proceso de agregar un indicador (requisito: fuente oficial verificable).

## Subagentes

- [data-pipeline](agents/data-pipeline.md) — ingesta y validación de datos oficiales
- [dataviz-ui](agents/dataviz-ui.md) — gráficas y comparativos en la web
- [cli-dev](agents/cli-dev.md) — el CLI npm
