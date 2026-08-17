import { RepositorioMemoria } from "@/lib/repository.memory";
import { firmarRefreshToken, rotarRefresh } from "@/lib/refresh";

const SESSION_SECRET="@costarricense.cr"
const repo = new RepositorioMemoria();
const sesion = await repo.crearSesion('u-ana');

const vigente = await firmarRefreshToken(sesion.id, sesion.refreshActual, SESSION_SECRET);
console.log('Primero token', vigente);
console.log('rotación normal', await rotarRefresh(repo, vigente, SESSION_SECRET));

console.log('reutilizamos el viejo', await rotarRefresh(repo, vigente, SESSION_SECRET));
console.log('sesión revocada', (await repo.buscarSesion(sesion.id))?.revocadaEn !== null);

const bitacora = await repo.listarAuditoria();
console.log('motivo', bitacora.find(a => a.evento === 'ACCESO_DENEGADO')?.metadatos.motivo);