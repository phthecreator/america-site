# Handoff — 2026-11-25 (v2.0.0)

## Estado
- Site no ar = `main` = tag `v2.0.0`. Hospedagem: Hostinger (compartilhada), deploy via SSH (alias `hostinger-america`, ver memória do projeto).
- Branch de trabalho: `feature/catalogo-v2` (igual ao `main`). Stashes `squad-live` e `catalogo-viewer` intocados (só locais).
- Domínio renovado até 28/11/2027. Certificado Let's Encrypt renova sozinho.

## Feito nesta sessão
Ver `CHANGELOG.md` [2.0.0]. Stories: `docs/stories/0.1.*` e `docs/stories/2.1.*`.

## Deploy (rotina)
1. `npm run build` → conferir que os PDFs não viraram `.icloud`.
2. Backup no servidor: `tar czf ~/backup-site-<data>.tar.gz --exclude='*.pdf' -C <public_html> .`
3. Enviar só o que mudou (scp). Nunca reenviar o PDF de 48 MB.
4. Conferir com curl (home, `/catalogo-2026`, PDF, cabeçalhos) e no navegador.
Rollback: `tar xzf ~/backup-site-<data>.tar.gz -C <public_html>`.

## Auditoria de segredos (2026-11-25)
- `.env` e `.env.example`: só chaves vazias; `.env` ignorado e nunca commitado.
- Histórico git (todas as branches), stashes, site no ar, memória e transcrição da IA: nenhum segredo encontrado.
- Repo no GitHub é **público** — nunca commitar `.env`, chaves ou senhas.
- `.gitignore`: passou a ignorar `*.icloud`.

## Pendências
- [ ] A partir de 02/12/2026: subir HSTS para 1 ano (`max-age=31536000`) se nada quebrou.
- [ ] DNS no hPanel (Pedro): TXT `@` = `v=spf1 -all`; TXT `_dmarc` = `v=DMARC1; p=reject;` (o domínio não envia e-mail).
- [ ] hPanel: senha forte + 2FA; apagar conta FTP se ninguém usa.
- [ ] Teste em iPhone e Android reais (até agora só emulação).
- [ ] Decidir se apaga o PDF antigo de 48 MB (hoje redireciona).
- [ ] Epics 1 e 3 (catálogo em HTML) cancelados por ora — orçar à parte com o cliente.
- `squad-live-game/` (cópia antiga) movido para fora: `PRIMEIROS PROJETOS/squad-live-game-copia-antiga-america-site/`. A versão principal (com .git) é `PRIMEIROS PROJETOS/squad-live-game/`.
