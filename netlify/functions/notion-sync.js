exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!token || !databaseId) {
    return { statusCode: 500, body: 'Notion sync not configured (missing NOTION_TOKEN or NOTION_DATABASE_ID)' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { id, data, hora, nome, tipo, casa } = payload;
  if (!id || !data || !hora || !nome || !tipo) {
    return { statusCode: 400, body: 'Missing fields (id, data, hora, nome, tipo)' };
  }

  const notionRes = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        'Funcionária': { title: [{ text: { content: nome } }] },
        'Tipo': { select: { name: tipo === 'entrada' ? 'Entrada' : 'Saída' } },
        'Data e Hora': { date: { start: `${data}T${hora}` } },
        'ID': { rich_text: [{ text: { content: id } }] },
        'Casa': { select: { name: casa || 'Casa' } }
      }
    })
  });

  if (!notionRes.ok) {
    const errText = await notionRes.text();
    return { statusCode: notionRes.status, body: errText };
  }

  return { statusCode: 200, body: JSON.stringify({ status: 'ok' }) };
};
