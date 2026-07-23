# Ponto Fácil — Guia de configuração completa

Este pacote contém o app (PWA) e as instruções para:
1. Publicar o app
2. Instalar como app "nativo" no Android (gerar .apk de verdade)
3. Ativar a visualização em tempo real dos pontos no seu computador

---

## 1. Publicar o app

1. Acesse **app.netlify.com/drop**
2. Arraste a pasta **inteira** com estes arquivos (index.html, manifest.json, service-worker.js, icon-192.png, icon-512.png) para dentro da página
3. Você recebe um link, por exemplo: `https://ponto-facil-xyz.netlify.app`

Guarde esse link — ele será usado nos próximos passos.

---

## 2. Gerar o .apk (app nativo de verdade) com o PWABuilder

1. Acesse **pwabuilder.com**
2. Cole o link do Netlify (passo 1) e clique em "Start"
3. Aguarde a análise (o site vai confirmar que o manifesto e o service worker estão corretos)
4. Clique em "Package for stores" → escolha **Android**
5. Baixe o pacote gerado (.apk ou .aab)
6. Transfira o .apk para o tablet (por cabo USB, e-mail para você mesmo, ou Google Drive) e instale tocando no arquivo
   - O Android vai pedir para permitir "instalar de fontes desconhecidas" na primeira vez — é normal, autorize apenas essa instalação
7. Pronto: o app aparece na gaveta de aplicativos do Android como um app nativo, com ícone próprio

---

## 3. Ativar a visualização em tempo real numa Planilha Google

Isso faz cada ponto batido no tablet aparecer automaticamente numa Planilha Google que você abre no computador.

### Passo A — Criar a planilha e o script
1. Acesse **sheets.google.com** e crie uma planilha nova, com o nome "Ponto Fácil - Registros"
2. No menu, clique em **Extensões → Apps Script**
3. Apague o conteúdo padrão e cole o código abaixo:

```javascript
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Registros');
  if (!sheet) {
    sheet = ss.insertSheet('Registros');
    sheet.appendRow(['ID', 'Data', 'Hora', 'Funcionária', 'Tipo', 'Recebido em']);
    sheet.setFrozenRows(1);
  }
  var data = JSON.parse(e.postData.contents);

  var lastRow = sheet.getLastRow();
  var ids = lastRow > 1 ? sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat() : [];

  if (ids.indexOf(data.id) === -1) {
    sheet.appendRow([
      data.id,
      data.data,
      data.hora,
      data.nome,
      data.tipo === 'entrada' ? 'Entrada' : 'Saída',
      new Date()
    ]);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return ContentService.createTextOutput('Ponto Fácil - endpoint ativo');
}
```

4. Clique em **Salvar** (ícone de disquete)

### Passo B — Publicar o script como "App da Web"
1. Clique em **Implantar → Nova implantação**
2. Clique no ícone de engrenagem ao lado de "Selecionar tipo" → escolha **App da Web**
3. Configure:
   - **Executar como**: Eu (seu e-mail)
   - **Quem pode acessar**: Qualquer pessoa
4. Clique em **Implantar**
5. Autorize as permissões quando solicitado (é o Google pedindo confirmação de que você mesmo criou o script — normal)
6. Copie a **URL do app da Web** (termina em `/exec`)

### Passo C — Conectar o app do tablet à planilha
1. No tablet, abra o Ponto Fácil
2. Toque em ⚙ → código administrativo → aba **Configurações**
3. Cole a URL copiada no campo "Visualização em tempo real (planilha Google)"
4. Toque em **Salvar**

Pronto! A partir de agora, toda vez que uma funcionária bater o ponto (com o tablet conectado à internet), o registro aparece automaticamente na planilha — que você pode deixar aberta no computador e atualizar a página para ver o mais recente.

---

## Como tudo funciona junto

- **Fonte oficial dos dados**: sempre o tablet (armazenamento local, funciona mesmo sem internet)
- **Planilha Google**: uma cópia "espelho" enviada em tempo real, só para consulta rápida no computador — não é o banco de dados principal
- **Fechamento mensal (.xlsx)**: continua funcionando do mesmo jeito, exportado direto do tablet, com todos os detalhes e fotos
- **Se o tablet ficar offline**: os pontos continuam sendo salvos normalmente; assim que a internet voltar, o app reenvia sozinho os pendentes para a planilha
