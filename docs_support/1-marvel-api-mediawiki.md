# Marvel API - MediaWiki/Fandom Guide

## ⚠️ Aviso Importante
A Marvel API oficial (developer.marvel.com) **NÃO FUNCIONA MAIS**. Este documento foca em alternativas usando MediaWiki API via Fandom.

## 📋 Visão Geral

O Marvel Database no Fandom (marvel.fandom.com) contém mais de 80.000 personagens catalogados e pode ser acessado via MediaWiki API. Esta é a melhor alternativa para obter dados da Marvel após o encerramento da API oficial.

## 🔗 Endpoints Principais

### Base URL
```
https://marvel.fandom.com/api.php
```

### Estrutura Geral
```
https://marvel.fandom.com/api.php?action={action}&format=json&...
```

## 📖 MediaWiki API - Ações Principais

### 1. Query (Consulta de Dados)
A ação mais importante para recuperar informações:

```
action=query
```

#### Parâmetros Comuns:
- `format=json` - Formato da resposta
- `formatversion=2` - Usar versão 2 da API (recomendado)
- `list=` - Tipo de listagem
- `prop=` - Propriedades para recuperar
- `titles=` - Títulos de páginas específicas

### 2. Buscar Personagens

#### Exemplo: Buscar informações de um personagem específico
```
https://marvel.fandom.com/api.php?action=query&format=json&titles=Spider-Man_(Peter_Parker)&prop=revisions&rvprop=content
```

#### Exemplo: Listar todos personagens em uma categoria
```
https://marvel.fandom.com/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:Characters&cmlimit=50
```

#### Exemplo: Buscar páginas por texto
```
https://marvel.fandom.com/api.php?action=query&format=json&list=search&srsearch=Iron+Man&srlimit=10
```

### 3. Obter Conteúdo de Páginas

#### Parse (Renderizado HTML)
```
https://marvel.fandom.com/api.php?action=parse&format=json&page=Spider-Man_(Peter_Parker)&prop=text
```

#### Revisions (Conteúdo Wikitext)
```
https://marvel.fandom.com/api.php?action=query&format=json&titles=Spider-Man_(Peter_Parker)&prop=revisions&rvprop=content&rvslots=main
```

### 4. Listar Categorias

#### Todas as categorias de um personagem:
```
https://marvel.fandom.com/api.php?action=query&format=json&titles=Spider-Man_(Peter_Parker)&prop=categories&cllimit=max
```

#### Membros de uma categoria:
```
https://marvel.fandom.com/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:Avengers_(Earth-616)&cmlimit=500
```

## 🎯 Casos de Uso Práticos

### Caso 1: Obter Lista de Todos os Heróis
```
https://marvel.fandom.com/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:Heroes&cmlimit=500&cmcontinue={token}
```

### Caso 2: Extrair Dados de Infobox
```
https://marvel.fandom.com/api.php?action=query&format=json&titles=Thor_(Thor_Odinson)&prop=revisions&rvprop=content
```
Depois processar o wikitext para extrair o template `{{Character Template`.

### Caso 3: Buscar por Afiliação
```
https://marvel.fandom.com/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:X-Men_(Earth-616)/Members
```

### Caso 4: Obter Imagens de um Personagem
```
https://marvel.fandom.com/api.php?action=query&format=json&titles=Wolverine_(James_Howlett)&prop=images&imlimit=max
```

## 🔄 Paginação

A API MediaWiki usa tokens de continuação:

```javascript
// Primeira requisição
let url = 'https://marvel.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:Characters&cmlimit=500&format=json';

// Na resposta, verificar se existe "continue"
{
  "continue": {
    "cmcontinue": "page|...|...",
    "continue": "-||"
  }
}

// Próxima requisição adiciona o cmcontinue:
url += '&cmcontinue=' + encodeURIComponent(response.continue.cmcontinue);
```

## 📊 Estrutura de Dados - Character Template

O Marvel Fandom usa templates padronizados. Campos principais:

```wikitext
{{Character Template
|Image = 
|RealName = Peter Benjamin Parker
|CurrentAlias = Spider-Man
|Aliases = 
|Relatives = 
|Affiliation = Avengers, Fantastic Four
|Base = New York City
|Alignment = Good
|Identity = Secret
|Race = Human (Mutate)
|Citizenship = 
|Marital = Married
|Occupation = 
|Gender = Male
|Height = 5'10"
|Weight = 167 lbs
|Eyes = Hazel
|Hair = Brown
|Origin = 
|Universe = Earth-616
|PlaceOfBirth = 
|PlaceOfDeath = 
|Status = Alive
|FirstAppearance = 
}}
```

## 🛠️ Implementação em n8n

### HTTP Request Node - Configuração

**Method:** GET  
**URL:** `https://marvel.fandom.com/api.php`

**Query Parameters:**
```
action: query
format: json
formatversion: 2
list: categorymembers
cmtitle: Category:Characters
cmlimit: 500
```

**Paginação:**
- Enable Pagination: Yes
- Pagination Mode: Update a Parameter in Each Request
- Parameter Type: Query
- Parameter Name: cmcontinue
- Parameter Value: `{{ $response.body.continue?.cmcontinue }}`
- Complete When: `{{ !$response.body.continue }}`

### Function Node - Parse Wikitext

```javascript
// Extrair dados do Character Template
function parseCharacterTemplate(wikitext) {
  const templateRegex = /\{\{Character Template([\s\S]*?)\}\}/;
  const match = wikitext.match(templateRegex);
  
  if (!match) return null;
  
  const template = match[1];
  const fields = {};
  
  // Parse cada campo
  const fieldRegex = /\|(\w+)\s*=\s*([^\|]*?)(?=\n\||\n\}\})/g;
  let fieldMatch;
  
  while ((fieldMatch = fieldRegex.exec(template)) !== null) {
    const key = fieldMatch[1].trim();
    const value = fieldMatch[2].trim();
    fields[key] = value;
  }
  
  return fields;
}

// Processar items
const results = [];
for (const item of $input.all()) {
  const content = item.json.content;
  const characterData = parseCharacterTemplate(content);
  
  if (characterData) {
    results.push({
      json: {
        title: item.json.title,
        ...characterData
      }
    });
  }
}

return results;
```

## 🔍 Rate Limits e Boas Práticas

1. **User-Agent**: Sempre configure um User-Agent identificável
   ```
   User-Agent: MyMarvelApp/1.0 (contact@example.com)
   ```

2. **Rate Limiting**: Respeite os limites
   - Máximo 200 requisições por minuto
   - Use batch requests quando possível

3. **Caching**: Implemente cache local para dados estáticos

4. **Continuação**: Sempre processe tokens de continuação para paginação

## 📚 Categorias Úteis

```
Category:Characters - Todos os personagens
Category:Heroes - Heróis
Category:Villains - Vilões
Category:Earth-616 - Universo principal
Category:Avengers_(Earth-616)/Members - Membros dos Vingadores
Category:X-Men_(Earth-616)/Members - Membros dos X-Men
Category:Mutants - Mutantes
Category:Humans - Humanos
Category:Aliens - Alienígenas
```

## 🔗 Recursos Adicionais

- **MediaWiki API Sandbox**: https://marvel.fandom.com/Special:ApiSandbox
- **Documentação MediaWiki**: https://www.mediawiki.org/wiki/API:Main_page
- **Marvel Database**: https://marvel.fandom.com/wiki/Marvel_Database

## ⚡ Dicas Avançadas

### 1. Batch Requests
Use `titles=` com múltiplos valores separados por pipe:
```
titles=Spider-Man_(Peter_Parker)|Iron_Man_(Tony_Stark)|Thor_(Thor_Odinson)
```

### 2. Generator Pattern
Combine list + prop para eficiência:
```
action=query&generator=categorymembers&gcmtitle=Category:Avengers&prop=info|categories
```

### 3. Extrair Links Internos
```
prop=links&pllimit=max
```

### 4. Histórico de Revisões
```
prop=revisions&rvlimit=10&rvprop=timestamp|user|comment
```

---

**Nota**: Esta documentação é baseada no MediaWiki API usado pelo Fandom. A estrutura pode variar ligeiramente entre diferentes wikis do Fandom.
