# Cómo contribuir

Gracias por querer aportar. Este es un proyecto de **datos públicos sin sesgo**: la regla de oro es que todo dato lleva su fuente oficial verificable. Sin fuente, no entra.

## Formas de contribuir

- **Reportar un dato incorrecto** → abre un issue con la plantilla _Dato incorrecto_. Incluye el valor actual, el correcto y el enlace a la fuente oficial.
- **Sugerir un indicador nuevo** → issue con la plantilla _Nuevo indicador_.
- **Corregir/agregar datos** → un PR editando el JSON (ver abajo).
- **Mejoras a la web o el CLI** → un PR con los cambios.

## Agregar o corregir un indicador

Los datos viven en `data/indicadores/<id>.json`. Cada archivo es la fuente de verdad; la web y el CLI lo leen tal cual.

1. Copia el esquema de un indicador existente (p. ej. `data/indicadores/inflacion.json`).
2. Campos obligatorios: `id`, `nombre`, `descripcion`, `unidad`, `mejorEs` (`mayor`|`menor`), `fuente`, `fuenteUrl`, `frecuencia`, y `serie` (`[{ fecha, valor, nota? }]`).
3. **`fuenteUrl` debe apuntar a la publicación oficial** (DANE, Banco de la República, MinHacienda, DNP, Registraduría, etc.), no a un medio.
4. Registra el indicador en `src/lib/data.js` (un import + una línea en el arreglo `indicadores`).
5. Corre `npm run build` — debe pasar sin errores.

## Verificación

- Todo valor nuevo se contrasta contra **al menos dos fuentes** cuando sea posible, o se marca `"verificado": false` con una `nota` explicando el origen y qué falta confirmar.
- Nada de adjetivos ni interpretación en los textos: describe el dato, no lo califiques.

## Estilo de commits y PRs

- Mensajes en español, en imperativo, describiendo el _qué_ y el _porqué_.
- Un PR = un cambio coherente. Enlaza el issue que resuelve.
- El CI corre `npm run build`; debe estar verde antes del merge.

## Código de conducta

Este proyecto se rige por el [Código de Conducta](CODE_OF_CONDUCT.md). Al participar, se espera que lo respetes.
