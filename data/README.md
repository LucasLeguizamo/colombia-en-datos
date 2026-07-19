# data — la fuente de verdad

JSON versionado en git. La web y el CLI leen estos mismos archivos. Sin base de datos: git da historia, auditoría y PRs de corrección gratis.

## Archivos

- `mandatos.json` — períodos presidenciales con fechas exactas de posesión.
- `indicadores/<id>.json` — una serie por indicador (TRM, inflación, desempleo, deuda externa %PIB, deuda GNC %PIB, deuda per cápita).
- `congreso.json` — composición de Cámara y Senado por partido en cada mandato.
- `gabinetes.json` — gabinete ministerial de cada gobierno.

## Esquema

### `mandatos.json` (array)

```jsonc
{
  "id": "petro",                 // slug único
  "nombre": "Petro",             // etiqueta corta
  "presidente": "Gustavo Petro Urrego",
  "inicio": "2022-08-07",        // fecha de posesión (ISO)
  "fin": "2026-08-07",           // posesión del siguiente
  "color": "#dc2626"             // banda en las gráficas
}
```

**Regla de corte:** un mandato es dueño del período `[inicio, fin)`. La posesión es el 7 de agosto. Un dato con fecha ≥ `inicio` y < `fin` pertenece a ese mandato.

### `indicadores/<id>.json`

```jsonc
{
  "id": "inflacion",             // == nombre de archivo
  "nombre": "Inflación (IPC)",
  "descripcion": "…",
  "unidad": "%",
  "mejorEs": "menor",            // "menor" | "mayor" — dirección buena para el delta
  "fuente": "DANE",
  "fuenteUrl": "https://…",      // link oficial verificable. Sin fuente, no entra.
  "frecuencia": "anual",         // "diaria" | "mensual" | "trimestral" | "anual"
  "verificado": false,           // true solo tras verificación cruzada (2 fuentes)
  "nota": "…",                   // contexto: quiebres metodológicos, estado de la serie
  "serie": [
    { "fecha": "2022", "valor": 13.12 },
    { "fecha": "2025", "valor": null } // hueco explícito, nunca interpolar
  ]
}
```

Formato de `fecha` según `frecuencia`: `YYYY` (anual), `YYYY-MM` (mensual), `YYYY-MM-DD` (diaria/trimestral).

### `congreso.json`

`periodos[]`, uno por mandato: `{ mandato, senado: { total, partidos[] }, camara: { total, partidos[] } }`, con `partidos[] = { partido, curules, bloque }` y `bloque = "gobierno" | "oposicion" | "independiente"` (posición al **inicio** del gobierno).

### `gabinetes.json`

`gobiernos[]`, uno por mandato: `{ mandato, gabinete[] }`, con `gabinete[] = { cargo, nombre, nota }`. Cuando un cargo rotó, se lista el titular más destacado/de mayor duración y las rotaciones van en `nota`.

## Reglas

1. **Cada dato lleva su fuente.** Sin `fuenteUrl` oficial, no entra.
2. **Huecos como `null`, nunca interpolados.**
3. **`verificado: true` solo tras contraste con 2 fuentes** (ver Fase 0 en ROADMAP).
4. Los valores actuales son **semilla anual** (`verificado: false`) para levantar el sitio. Reemplazar por series completas verificadas antes del lanzamiento del 7-ago-2026.
