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

## 4. Compartilhar com amigos sem misturar os registros (Notion)

Além da planilha, o app já envia cada ponto batido em tempo real para um banco de dados no Notion — isso acontece sozinho, por trás dos panos, sem precisar colar nenhum link (diferente da planilha). A chave de acesso ao Notion fica configurada uma única vez no Netlify (por você), e vale para todo mundo que usar esse mesmo link/app.

Isso é o que te permite compartilhar o app com amigos **sem bagunçar seus próprios registros**:

1. Todo tablet/instalação tem seu próprio nome de casa em **⚙ → código administrativo → Configurações → "Nome da casa / anfitriã"**
2. Cada ponto batido carrega esse nome junto para o Notion, numa coluna chamada **Casa**
3. No Notion, já existe uma visualização pronta chamada **"Por Casa"** (aba ao lado de "Default view", na base "Ponto Fácil — Registros") que agrupa automaticamente os registros por casa — a sua fica separada da dos seus amigos, mesmo estando no mesmo banco de dados

### Passo a passo para um amigo usar o app
1. Ele instala o mesmo app (mesmo link do Netlify ou mesmo .apk que você já gerou)
2. Na primeira vez, entra em ⚙ → código administrativo (o padrão é `1234`, ele pode trocar) → Configurações
3. Preenche o **nome da casa dele** (ex: o nome da casa/pousada/família dele) e salva
4. **Importante:** ele deve deixar o campo "planilha Google" em branco — esse campo aponta para a SUA planilha pessoal; se ele colar o mesmo link ali, os pontos dele vão aparecer misturados na sua planilha (o Notion, que já separa por Casa, continua funcionando normalmente mesmo com esse campo vazio)
5. Pronto — os pontos dele passam a aparecer no Notion, agrupados no grupo dele na view "Por Casa", sem se misturar com os seus

---

## Como tudo funciona junto

- **Fonte oficial dos dados**: sempre o tablet (armazenamento local, funciona mesmo sem internet)
- **Planilha Google**: uma cópia "espelho" enviada em tempo real, só para consulta rápida no computador — não é o banco de dados principal, e é individual (só vale para quem colar o próprio link)
- **Notion**: um banco compartilhado por todos que usam o app, com os registros de cada instalação separados pela coluna "Casa" (veja seção 4)
- **Fechamento mensal (.xlsx)**: continua funcionando do mesmo jeito, exportado direto do tablet, com todos os detalhes e fotos
- **Se o tablet ficar offline**: os pontos continuam sendo salvos normalmente; assim que a internet voltar, o app reenvia sozinho os pendentes para a planilha e para o Notion
