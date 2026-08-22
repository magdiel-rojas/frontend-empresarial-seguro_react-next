# Postura de seguridad — Bóveda

Documento entregable de la Práctica 3, y el mismo que pide el Proyecto Final.
No es un resumen de lo que hiciste: es la declaración de que controlás cada
riesgo, o de que lo aceptaste a sabiendas. Un riesgo aceptado y escrito es
ingeniería; un riesgo no visto es otra cosa. La diferencia es este documento.

Regla para llenarlo: cada fila necesita una **prueba** que la respalde. Si no
podés nombrar el comando que la verifica, ese control no está cubierto — y eso
va en la sección de riesgos aceptados, no escondido.

## 1. Cobertura de controles

Una fila por control. En "Cómo se verifica" va el comando exacto, no una idea.

| # | Control | Dónde vive (archivo) | Cómo se verifica (comando) | Estado |
|---|---|---|---|---|
| 1 | Sesión validada en servidor por render | src/app/**/page.tsx | `npm run build` (la ruta sale dinámica) | Cubierto |
| 2 | Ninguna ruta autenticada estática | src/app/**/page.tsx | `npm run build` (leer la tabla) | Cubierto |
| 3 | Acceso a datos solo tras el repositorio | src/lib/repository.ts y rutas/Server Actions que acceden a datos | `npm run test:p3` | Cubierto |
| 4 | `ResultadoAccion` uniforme, sin filtrar detalle | Server Actions de `src/app/` y tipos de acciones | `npm run test:p3` | Cubierto |
| 5 | `error.tsx` no renderiza `error.message` | `src/app/**/error.tsx` | `npm run test:p3` |Cubierto |
| 6 | Allowlist anti-SSRF en fetch de servidor | `src/lib/outbound.ts` | `npx vitest run tests/unit/practica-3/extra/outbound.test.ts` | Cubierto |
| 7 | Autorización pegada al dato (sin IDOR) | `src/lib/authz.ts`  y acceso a solicitudes | `npm run e2e` | Cubierto |
| 8 | Doble control (el creador no aprueba) | `src/lib/authz.ts` y flujo de aprobacion | `npm run test:authz`  | Cubierto |
| 9 | Cookie de sesión endurecida | `src/lib/sesion.ts` | `npx playwright test tests/e2e/auth.spec.ts` | Cubierto|
| 10 | Middleware como capa, no como borde | `src/proxy.ts` / middleware de proteccion | `npm run build` y `npx playwright test tests/e2e/auth.spec.ts` | Cubierto |

Estado: `Cubierto` / `Parcial` / `No cubierto`. Si es parcial, decí qué falta.

## 2. Bitácora de ataques

Estos son los ataques que ya vienen de las tablas de aceptación de las tres
prácticas. No son ataques nuevos: son los que ya tenés que ejecutar. Acá los
documentás juntos y con el mismo formato.

**La columna que importa es "En la base".** El mensaje de error no prueba nada:
un atacante no lee mensajes, mira efectos. Una acción puede responder
"No autorizado" *después* de haber escrito. Si esa celda queda vacía, el ataque
no está demostrado, por más que la app haya respondido con un error.

Veredicto: `BLOQUEADO` · `ENTRÓ` · `NO PROBADO`.

> Un ataque que **entró**, documentado con su efecto y su causa, vale más que
> cinco `BLOQUEADO` sin evidencia. Documentar un hueco propio es el ejercicio;
> esconderlo es lo único que no se acepta.

**No todos se ejecutan igual.** Cada fila trae su nivel, porque cambia la
herramienta y cambia lo que estás probando:

| Nivel | Qué significa | Con qué |
|---|---|---|
| `navegador` | Contra la app corriendo, a mano | DevTools, la barra de direcciones |
| `HTTP` | Contra la app, pero salteándote la interfaz | `curl`, copiando la petición real desde Network |
| `código` | Contra la función, sin app | `npx tsx borrador-ataques.ts` o un test |
| `build` | Inspección del artefacto, no una petición | `npm run build`, `grep` |

El anexo *Cómo se ejecuta cada ataque* del Material del Estudiante de cada
sesión trae la receta concreta de cada uno.

### De la Práctica 1 — autenticación y sesión

| # | Nivel | Ataque | Cómo lo ejecuté | Qué respondió la app | En la base | Veredicto |
|---|---|---|---|---|---|---|
| 1 | navegador | Credenciales inválidas | | | | |
| 2 | navegador | Usuario inexistente vs. contraseña mala (¿el mismo mensaje?) | | | | |
| 3 | navegador | Reusar la cookie copiada después del logout | | | | |
| 4 | navegador | Leer la cookie de sesión desde `document.cookie` | | | | |

### De la Práctica 2 — autorización

| # | Nivel | Ataque | Cómo lo ejecuté | Qué respondió la app | En la base | Veredicto |
|---|---|---|---|---|---|---|
| 5 | HTTP | Aprobar por `curl` con la sesión de un analista | | | | |
| 6 | navegador | Abrir una solicitud de otra sucursal por URL | | | | |
| 7 | HTTP | Monto negativo saltándose la validación del formulario | | | | |
| 8 | código | Aprobar la solicitud que uno mismo creó (ver nota) | | | | |
| 9 | navegador | Reusar la cookie tras logout (regresión de la P1) | | | | |

**Nota sobre el 8.** Por la app **no se puede**: crear exige `ANALISTA`, resolver
exige `APROBADOR`, y cada usuario tiene un solo rol, así que nadie puede crear y
aprobar la misma solicitud. La cuarta línea de `authz.ts` es defensa en
profundidad para el día que exista un rol con ambos permisos. Se ataca llamando
al servicio con una solicitud cuyo `creadaPor` sea el propio actor.

### De la Práctica 3 — SSR e integración

Ojo con estos: **Bóveda todavía no hace ningún fetch saliente**, así que la
superficie de SSRF no existe en la app. Los ataques 11 y 12 se ejercen contra
`validarDestino` como función, no contra la aplicación corriendo. Eso no los
hace menos reales: es la defensa construida **antes** de que exista el agujero,
que es justo el argumento del bloque 4.

| # | Nivel | Ataque | Cómo lo ejecuté | Qué respondió | En la base | Veredicto |
|---|---|---|---|---|---|---|
| 10 | build | ¿Alguna ruta autenticada sale `○` (estática) en la tabla del build? | | | n/a | |
| 11 | código | Pasarle a `validarDestino` la metadata de la nube, un rango privado y el loopback en decimal | | | n/a | |
| 12 | código | Un destino permitido que responde 302 hacia una IP interna: ¿el `fetch` lo sigue? | | | n/a | |
| 13 | HTTP | Provocar un error interno y leer qué se filtra en el mensaje | | | | |
| 14 | build | ¿Hay algún componente o página que consulte datos sin pasar por el repositorio? | | | n/a | |

### Tu propio ataque

Uno que no esté en las tablas de arriba. Puede fallar: si lo intentaste y la
defensa aguantó, eso también se documenta. Si no se te ocurrió ninguno, decilo
acá en vez de dejarlo en blanco.

| Ataque | Por qué pensaste que podía funcionar | Qué pasó | Veredicto |
|---|---|---|---|
| | | | |

### De los 14, ¿cuáles convertiste en test?

La regla: **cada ataque que encontrás a mano, convertilo en el test que lo
impida en el futuro — si la defensa vive en lógica pura.** Los que pasan por
HTTP o por el navegador van a Playwright; los que atacan una función pura van a
Vitest. Modelos que ya están en el repositorio:

- `tests/unit/practica-2/extra/authz-efecto.test.ts` — ataca el servicio y verifica que el estado en base no cambió
- `tests/unit/practica-3/extra/outbound.test.ts` — la allowlist contra seis destinos
- `tests/e2e/idor.spec.ts` — el IDOR entre sucursales, en el navegador

| Ataque (#) | Test que lo cubre | Unitario o E2E |
|---|---|---|
| | | |
| | | |

**Comprobación de que tu suite defiende algo:** rompé a propósito una línea de
`src/lib/authz.ts`, corré `npm run test:p3`, y confirmá que alguno se pone en
rojo. Si todo sigue verde, la suite no está defendiendo nada. Restaurá con
`git checkout -- src/lib/authz.ts` y anotá qué test se cayó.

## 3. Riesgos aceptados

Lo que decidiste NO cerrar, y por qué. Esta sección vale tanto como la primera.
Para cada uno: cuál es el riesgo, por qué se acepta, y qué lo compensa mientras tanto.

| Riesgo | Por qué se acepta | Qué lo compensa | Cuándo se revisa |
|---|---|---|---|
| DNS rebinding en el fetch saliente | | | |
| | | | |
| | | | |

## 4. Evidencia

Cómo se corrió y qué dio. Pegar la salida real, no de memoria.

```
npm run test:p3    ->
npm run e2e        ->
npm run build      ->  (ninguna ruta autenticada estatica)
npm run grade      ->  (reporte por criterio)
```

Ojo con `test:p3`: arrastra p1 y p2 como regresión. Que esté verde **no** prueba
que hiciste el trabajo de la Práctica 3 — prueba que no rompiste lo anterior.
Lo de la Práctica 3 se demuestra con el build, el E2E y los tests que escribas vos.

## 5. Lo que falta

Honestidad explícita. Qué quedó sin hacer y qué haría falta para cerrarlo.

-
-
