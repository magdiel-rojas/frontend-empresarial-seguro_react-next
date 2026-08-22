# Matriz de autorizacion - Boveda

Documento entregable de la Practica 2. Una fila por operacion. La columna
`authz.ts` apunta a la linea real de `src/lib/authz.ts` que implementa la regla:
si no podes apuntar a una linea concreta, esa regla esta regada por el codigo
en vez de vivir en la politica, y eso es un hallazgo que hay que anotar.

| Operacion | ANALISTA | APROBADOR | AUDITOR | Condicion ABAC | authz.ts |
|---|---|---|---|---|---|
| Ver solicitud | Solo su sucursal | Solo su sucursal | Todas | s.sucursalId === actor.sucursalId, salvo AUDITOR | L17 |
| Crear solicitud | Si | No | No | actor.rol !== 'ANALISTA' | L26 |
| Resolver solicitud | No | Si (con 3 condiciones) | No | misma sucursal + estado PENDIENTE + no es quien la creo | L37 |
| Ver bitacora | | | | | L54 |

## Los agujeros que justifican cada linea

Una linea por agujero: que se rompe si esa regla no existe.

Agujero A1: Se valida la sucursal debido a que los usuarios podian ver los de cualquier sucursal y no solo las de la suya.

Agujero A2: El Auditor deberia de poder ver solicitudes de cualquier sucursal por ende se valida que ella pueda ver cualquier solicitud, de cualquier sucursal.

Agujero B1: Se daba porque no se validaba el rol que tenia el usuario por ende se realiza la validacion para que el auditor no pudiera crear transacciones.

Agujero B1: Se daba porque no se validaba el rol que tenia el usuario por ende se realiza la validacion para que el aprobador no pudiera crear transacciones.

- Resolver / rol: 
- Resolver / sucursal: 
- Resolver / estado: 
- Resolver / doble control: 
- Ver / sucursal: 
- Ver / excepcion del auditor: 
- Crear / roles excluidos: 

## Evidencia de ataques fallidos

Para cada ataque: que se intento, que respondio la app, y **que quedo en la base**
(el estado sin cambiar es lo que prueba la defensa, no el mensaje de error).

1. 
2. 
3. 
4. 
5. 
