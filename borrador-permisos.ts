type Rol = 'ANALISTA' | 'APROBADOR' | 'AUDITOR';
type Actor = { usuarioId: string; rol: Rol; sucursalId: string };
type Solicitud = { id: string; sucursalId: string; creadaPor: string; estado: string; monto: number };
type Decision = { permitido: boolean; motivo?: string };

const denegar = (motivo: string): Decision => ({ permitido: false, motivo });

const ana: Actor = { usuarioId: 'u-ana', rol: 'ANALISTA', sucursalId: 'central' };
const beto: Actor = { usuarioId: 'u-beto', rol: 'APROBADOR', sucursalId: 'central' };
const dina: Actor = { usuarioId: 'u-dina', rol: 'AUDITOR', sucursalId: 'central' };
const edu: Actor = { usuarioId: 'u-edu', rol: 'ANALISTA', sucursalId: 'heredia' };

const deCentral: Solicitud = { id: 'sol-1', sucursalId: 'central', creadaPor: 'u-ana', estado: 'PENDIENTE', monto: 5000000, };
const deHeredia: Solicitud = { id: 'sol-2', sucursalId: 'heredia', creadaPor: 'u-edu', estado: 'PENDIENTE', monto: 800000, };

function puedeVer(actor: Actor, s: Solicitud): Decision {
   if (actor.sucursalId !== s.sucursalId && actor.rol !== 'AUDITOR') {
      return denegar('La solicitud pertenece a otra sucursal');
   }
   return { permitido: true };
}

console.log('ana ve la de central:', puedeVer(ana, deCentral));
console.log('ana ve la de heredia:', puedeVer(ana, deHeredia));
console.log('dina (auditora) ve la de heredia:', puedeVer(dina, deHeredia));
console.log('edu (ANALISTA) ve la de heredia:', puedeVer(edu, deCentral));

function puedeCrear(actor: Actor): Decision {
   if (actor.rol !== 'ANALISTA') {
      return denegar('Solo un analista puede crear solicitudes');
   }
   return { permitido: true };
}

console.log('dina (auditora) crea:', puedeCrear(dina));
console.log('beto (aprobador) crea:', puedeCrear(beto));