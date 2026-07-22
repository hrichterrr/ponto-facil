# Ponto Fácil

Aplicativo de registro de ponto (entrada/saída) com foto, para funcionárias domésticas, com jornada de 9h (8h de trabalho + 1h de almoço não registrada separadamente).

## Funcionalidades
- Registro de ponto com foto (entrada/saída automático)
- Painel administrativo protegido por código (cadastro de funcionárias, histórico, fotos)
- Cálculo automático de horas e saldo mensal
- Exportação do fechamento mensal em planilha (.xlsx)
- E-mail de fechamento pré-preenchido
- Sincronização em tempo real opcional com Google Sheets (ver `COMO-CONFIGURAR.md`)
- Instalável como app (PWA) no Android e iOS, funciona offline
- Dados armazenados localmente no dispositivo (IndexedDB)

## Publicar
1. Suba estes arquivos para o GitHub (ou GitHub Pages / Netlify)
2. Se usar GitHub Pages: Settings → Pages → Branch: main → pasta raiz
3. Acesse o link gerado pelo Chrome (Android) ou Safari (iPad) e adicione à tela inicial

Veja o passo a passo completo em `COMO-CONFIGURAR.md`, incluindo como gerar um `.apk` nativo com o PWABuilder e como conectar a planilha de visualização em tempo real.

## Estrutura
```
index.html          - aplicativo completo (HTML/CSS/JS)
manifest.json        - configuração do PWA (ícone, nome, cores)
service-worker.js    - funcionamento offline
icon-192.png / icon-512.png - ícones do app
COMO-CONFIGURAR.md   - guia de publicação e configuração
```

---
Developed by HRichter
