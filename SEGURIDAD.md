Si se filtra el refresh con rotación y detección de reuso, el atacante puede usarlo hasta que sea rotado.
En cada uso se emite un refresh nuevo y el anterior queda inválido.
Si alguien intenta reutilizar el anterior, se detecta el robo y se revoca toda la sesión.
Así, el impacto queda limitado y genera una señal de auditoría.
Sin rotación ni detección, el refresh filtrado sigue siendo válido hasta su expiración o revocación manual.
El atacante puede renovarlo repetidamente y mantener acceso durante toda su vigencia.
Además, el sistema no distingue entre el usuario legítimo y quien robó el token.