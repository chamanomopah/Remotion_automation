# DC Comics API - MediaWiki/Fandom Guide

## 📋 Visão Geral

O DC Database no Fandom (dc.fandom.com) é a maior base de dados online sobre DC Comics. Pode ser acessado via MediaWiki API, fornecendo informações sobre personagens, quadrinhos, filmes e muito mais.

## 🔗 Endpoints Principais

### Base URL
```
https://dc.fandom.com/api.php
```

### Estrutura Geral
```
https://dc.fandom.com/api.php?action={action}&format=json&...
```

## 📖 MediaWiki API - Ações Principais

### 1. Query Básica

```
action=query&format=json&formatversion=2
```

### 2. Buscar Personagens DC

#### Exemplo: Buscar Batman
```
https://dc.fandom.com/api.php?action=query&format=json&titles=Batman_(Bruce_Wayne)&prop=revisions&rvprop=content
```

#### Exemplo: Listar personagens por categoria
```
https://dc.fandom.com/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:Characters&cmlimit=50
```

#### Exemplo: Buscar por nome
```
https://dc.fandom.com/api.php?action=query&format=json&list=search&srsearch=Superman&srlimit=10
```

### 3. Obter Conteúdo Renderizado

#### Parse HTML
```
https://dc.fandom.com/api.php?action=parse&format=json&page=Wonder_Woman_(Diana_Prince)&prop=text|images
```

#### Conteúdo Wikitext
```
https://dc.fandom.com/api.php?action=query&format=json&titles=The_Flash_(Barry_Allen)&prop=revisions&rvprop=content&rvslots=main
```

## 🎯 Casos de Uso Práticos

### Caso 1: Listar Membros da Liga da Justiça
```
https://dc.fandom.com/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:Justice_League_Members&cmlimit=500
```

### Caso 2: Obter Informações de um Vilão
```
https://dc.fandom.com/api.php?action=query&format=json&titles=Joker_(New_Earth)&prop=revisions|categories|images&rvprop=content
```

### Caso 3: Buscar Personagens por Universo
```
https://dc.fandom.com/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:New_Earth_Characters&cmlimit=500
```

### Caso 4: Extrair Galeria de Imagens
```
https://dc.fandom.com/api.php?action=query&format=json&titles=Batman_(Bruce_Wayne)&prop=images&imlimit=max
```

### Caso 5: Buscar por Afiliação
```
https://dc.fandom.com/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:Batman_Family_Members
```

## 📊 Estrutura de Dados - Character Template

Template padrão do DC Database:

```wikitext
{{Character Template
|Image = Batman_0001.jpg
|RealName = Bruce Thomas Wayne
|CurrentAlias = Batman
|Aliases = Dark Knight, Caped Crusader, World's Greatest Detective
|Relatives = 
|Affiliation = [[Justice League]], [[Batman Family]]
|Base = [[Gotham City]]
|Alignment = Good
|Identity = Secret
|Race = Human
|Citizenship = American
|MaritalStatus = Single
|Occupation = Vigilante, Businessman, Philanthropist
|Gender = Male
|Height = 6' 2"
|Weight = 210 lbs
|Eyes = Blue
|Hair = Black
|Origin = Witnessed parents' murder, trained to fight crime
|Universe = [[New Earth]]
|PlaceOfBirth = [[Gotham City]]
|Status = Alive
|FirstAppearance = [[Detective Comics Vol 1 27|Detective Comics #27]]
|Creators = [[Bob Kane]], [[Bill Finger]]
}}
```

## 🔄 Paginação e Continuação

```javascript
// Implementação de paginação
async function fetchAllCharacters() {
  let allCharacters = [];
  let continueToken = null;
  
  do {
    const params = {
      action: 'query',
      format: 'json',
      list: 'categorymembers',
      cmtitle: 'Category:Characters',
      cmlimit: 500
    };
    
    if (continueToken) {
      params.cmcontinue = continueToken;
    }
    
    const response = await fetch('https://dc.fandom.com/api.php?' + new URLSearchParams(params));
    const data = await response.json();
    
    allCharacters.push(...data.query.categorymembers);
    
    continueToken = data.continue?.cmcontinue;
  } while (continueToken);
  
  return allCharacters;
}
```

## 🛠️ Implementação em n8n

### HTTP Request Node - Buscar Personagens

**Method:** GET  
**URL:** `https://dc.fandom.com/api.php`

**Query Parameters:**
```json
{
  "action": "query",
  "format": "json",
  "formatversion": "2",
  "list": "categorymembers",
  "cmtitle": "Category:Characters",
  "cmlimit": "500"
}
```

**Headers:**
```json
{
  "User-Agent": "DCComicsBot/1.0 (your@email.com)"
}
```

**Options > Pagination:**
- Pagination Mode: `Update a Parameter in Each Request`
- Parameter Type: `Query`
- Parameter Name: `cmcontinue`
- Parameter Value (Expression): `{{ $response.body.continue?.cmcontinue }}`
- Complete When (Expression): `{{ !$response.body.continue }}`

### Code Node - Parse Character Data

```javascript
// Função para extrair dados do Character Template
function parseCharacterData(wikitext) {
  const data = {
    name: '',
    realName: '',
    aliases: [],
    affiliation: [],
    powers: [],
    status: '',
    universe: '',
    firstAppearance: ''
  };
  
  // Extrair Character Template
  const templateMatch = wikitext.match(/\{\{Character Template([\s\S]*?)\}\}/i);
  if (!templateMatch) return null;
  
  const template = templateMatch[1];
  
  // Parse campos individuais
  const parseField = (fieldName) => {
    const regex = new RegExp(`\\|${fieldName}\\s*=\\s*([^|]*?)(?=\\n\\||\\n\\}\\})`, 'i');
    const match = template.match(regex);
    return match ? match[1].trim() : '';
  };
  
  data.realName = parseField('RealName');
  data.name = parseField('CurrentAlias') || parseField('Name');
  data.status = parseField('Status');
  data.universe = parseField('Universe');
  data.firstAppearance = parseField('FirstAppearance');
  
  // Parse aliases (podem ser separados por vírgula ou ponto e vírgula)
  const aliasesStr = parseField('Aliases');
  if (aliasesStr) {
    data.aliases = aliasesStr.split(/[,;]/).map(a => a.trim()).filter(Boolean);
  }
  
  // Parse affiliation (remover wiki links)
  const affiliationStr = parseField('Affiliation');
  if (affiliationStr) {
    data.affiliation = affiliationStr
      .replace(/\[\[([^\]|]*?)(?:\|[^\]]*)?\]\]/g, '$1')
      .split(/[,;]/)
      .map(a => a.trim())
      .filter(Boolean);
  }
  
  return data;
}

// Processar todos os items
const results = [];

for (const item of $input.all()) {
  try {
    const wikitext = item.json.revisions?.[0]?.slots?.main?.content;
    
    if (wikitext) {
      const characterData = parseCharacterData(wikitext);
      
      if (characterData) {
        results.push({
          json: {
            pageTitle: item.json.title,
            pageId: item.json.pageid,
            ...characterData
          }
        });
      }
    }
  } catch (error) {
    console.error(`Error parsing ${item.json.title}:`, error);
  }
}

return results;
```

## 🔍 Categorias Importantes DC Database

### Personagens
```
Category:Characters - Todos os personagens
Category:Heroes - Heróis
Category:Villains - Vilões
Category:Justice_League_Members - Liga da Justiça
Category:Batman_Family_Members - Família Batman
Category:Superman_Family_Members - Família Superman
Category:Green_Lantern_Corps_Members - Lanterna Verde
Category:Teen_Titans_Members - Jovens Titãs
```

### Universos
```
Category:New_Earth_Characters - Pré-Flashpoint
Category:Prime_Earth_Characters - Pós-Flashpoint/Rebirth
Category:Earth-One_Characters - Era de Prata
Category:Earth-Two_Characters - Era de Ouro
```

### Tipos
```
Category:Humans - Humanos
Category:Metahumans - Meta-humanos
Category:Aliens - Alienígenas
Category:Amazons - Amazonas
Category:Atlanteans - Atlantes
Category:Kryptonians - Kryptonianos
```

## 📈 Query Avançada - Generator Pattern

Combinar geradores com propriedades para queries eficientes:

```
https://dc.fandom.com/api.php?action=query&format=json&generator=categorymembers&gcmtitle=Category:Justice_League_Members&prop=info|categories|pageimages&pilimit=max
```

Isso retorna:
- Informações da página
- Categorias associadas
- Imagem principal
- Tudo em uma única request

## 🚀 Rate Limits e Otimização

### Best Practices

1. **Batch Requests**: Agrupe até 50 títulos por request
```
titles=Batman_(Bruce_Wayne)|Superman_(Clark_Kent)|Wonder_Woman_(Diana_Prince)
```

2. **Use formatversion=2**: Estrutura de resposta mais limpa
```
formatversion=2
```

3. **Limite Propriedades**: Solicite apenas o necessário
```
prop=info|categories  # Não: prop=*
```

4. **Cache Inteligente**: Implemente cache com TTL
```javascript
const CACHE_TTL = 3600000; // 1 hora
```

### Rate Limits
- **200 requests/minuto** para usuários anônimos
- **500 requests/minuto** para usuários autenticados
- Use `maxlag` parameter para respeitar a carga do servidor

## 🔧 Troubleshooting

### Problema: Caracteres Especiais
```javascript
// Encode títulos corretamente
const title = encodeURIComponent('Harley Quinn (Harleen Quinzel)');
```

### Problema: Timeout
```javascript
// Adicione timeout e retry
const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, { timeout: 30000 });
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

## 🔗 Recursos Adicionais

- **DC Database**: https://dc.fandom.com
- **API Sandbox**: https://dc.fandom.com/Special:ApiSandbox
- **MediaWiki API Docs**: https://www.mediawiki.org/wiki/API:Main_page
- **Fandom API Info**: https://dev.fandom.com/wiki/Dev_Wiki:Sandbox/API

## 💡 Exemplo Completo: Workflow n8n

### Workflow: Extrair Top 100 Heróis DC

1. **HTTP Request** - Listar heróis
2. **Code** - Parse dados
3. **HTTP Request** - Obter detalhes (loop)
4. **Code** - Processar e limpar
5. **Set** - Formatar output
6. **Webhook/Database** - Salvar resultados

---

**Nota**: O DC Database usa estrutura similar ao Marvel Database, ambos baseados em MediaWiki/Fandom.
