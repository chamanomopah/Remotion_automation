# n8n Code Node - JavaScript Examples & Patterns

## 📋 Visão Geral

O Code node permite executar JavaScript ou Python customizado como parte do workflow. Este guia foca em JavaScript com exemplos práticos e padrões avançados.

## 🎯 Modos de Execução

### Run Once for All Items (Padrão)
Código executa **uma vez** independente do número de items de entrada.

```javascript
// Acesso a todos os items
const items = $input.all();

// Processar e retornar
return items.map(item => ({
  json: {
    ...item.json,
    processed: true
  }
}));
```

### Run Once for Each Item
Código executa **para cada item** individualmente.

```javascript
// Acesso ao item atual
const item = $input.item;

// Processar e retornar
return {
  json: {
    ...item.json,
    doubled: item.json.value * 2
  }
};
```

## 🔧 Built-in Methods & Variables

### Principais Variáveis

```javascript
$input        // Acesso aos dados de entrada
$json         // Shortcut para $input.item.json (por item)
$binary       // Acesso a dados binários
$node         // Info sobre o node atual
$workflow     // Info sobre o workflow
$execution    // Info sobre a execução
$vars         // Variáveis customizadas
$now          // Timestamp atual
$today        // Data de hoje
$itemIndex    // Índice do item atual (modo per-item)
```

### $input Methods

```javascript
// Obter todos items
const allItems = $input.all();

// Obter primeiro item
const firstItem = $input.first();

// Obter último item
const lastItem = $input.last();

// Obter item específico
const item = $input.item; // Item atual (per-item mode)
```

### $execution Methods

```javascript
// ID da execução
$execution.id

// Modo de execução
$execution.mode // 'manual', 'trigger', 'webhook'

// Variáveis globais (cache)
$execution.getGlobalVariable('key');
$execution.setGlobalVariable('key', value);
```

## 📊 Data Transformation Patterns

### Pattern 1: Filter Items

```javascript
// Filtrar items baseado em condição
const items = $input.all();

return items.filter(item => {
  return item.json.status === 'active' && 
         item.json.score > 50;
});
```

### Pattern 2: Map & Transform

```javascript
// Transformar estrutura de dados
const items = $input.all();

return items.map(item => ({
  json: {
    id: item.json.id,
    fullName: `${item.json.firstName} ${item.json.lastName}`,
    email: item.json.email.toLowerCase(),
    createdAt: new Date(item.json.timestamp).toISOString(),
    metadata: {
      source: 'api',
      processed: true,
      version: 2
    }
  }
}));
```

### Pattern 3: Reduce & Aggregate

```javascript
// Agregar dados
const items = $input.all();

const summary = items.reduce((acc, item) => {
  const category = item.json.category;
  
  if (!acc[category]) {
    acc[category] = {
      count: 0,
      total: 0,
      items: []
    };
  }
  
  acc[category].count++;
  acc[category].total += item.json.amount;
  acc[category].items.push(item.json.id);
  
  return acc;
}, {});

return [{ json: summary }];
```

### Pattern 4: Group By

```javascript
// Agrupar items por campo
const items = $input.all();

const grouped = items.reduce((acc, item) => {
  const key = item.json.category;
  
  if (!acc[key]) {
    acc[key] = [];
  }
  
  acc[key].push(item.json);
  return acc;
}, {});

// Retornar como array de grupos
return Object.entries(grouped).map(([category, items]) => ({
  json: {
    category,
    count: items.length,
    items
  }
}));
```

### Pattern 5: Flatten Nested Arrays

```javascript
// Achatar arrays aninhados
const items = $input.all();

return items.flatMap(item => {
  // Se item tem array de sub-items
  return item.json.orders.map(order => ({
    json: {
      userId: item.json.id,
      userName: item.json.name,
      orderId: order.id,
      orderTotal: order.total,
      orderDate: order.date
    }
  }));
});
```

## 🎨 String Manipulation

### Pattern 1: Clean & Normalize Text

```javascript
function cleanText(text) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-')      // Espaços para hífens
    .replace(/-+/g, '-');      // Múltiplos hífens para um
}

const items = $input.all();
return items.map(item => ({
  json: {
    ...item.json,
    slug: cleanText(item.json.title),
    cleanEmail: item.json.email.trim().toLowerCase()
  }
}));
```

### Pattern 2: Extract Data from Text

```javascript
// Extrair dados com regex
const items = $input.all();

return items.map(item => {
  const text = item.json.description;
  
  // Extrair emails
  const emails = text.match(/[\w.-]+@[\w.-]+\.\w+/g) || [];
  
  // Extrair URLs
  const urls = text.match(/https?:\/\/[^\s]+/g) || [];
  
  // Extrair hashtags
  const hashtags = text.match(/#\w+/g) || [];
  
  return {
    json: {
      ...item.json,
      extracted: {
        emails,
        urls,
        hashtags
      }
    }
  };
});
```

### Pattern 3: Template String Building

```javascript
const items = $input.all();

return items.map(item => {
  const template = `
    Dear ${item.json.name},
    
    Your order #${item.json.orderId} has been processed.
    Total: $${item.json.total.toFixed(2)}
    
    Thank you for your purchase!
  `.trim();
  
  return {
    json: {
      ...item.json,
      emailBody: template
    }
  };
});
```

## 📅 Date & Time Operations

### Pattern 1: Date Formatting

```javascript
const items = $input.all();

return items.map(item => {
  const date = new Date(item.json.timestamp);
  
  return {
    json: {
      ...item.json,
      formatted: {
        iso: date.toISOString(),
        local: date.toLocaleString('pt-BR'),
        dateOnly: date.toISOString().split('T')[0],
        timeOnly: date.toLocaleTimeString('pt-BR'),
        unix: Math.floor(date.getTime() / 1000)
      }
    }
  };
});
```

### Pattern 2: Date Calculations

```javascript
const items = $input.all();

return items.map(item => {
  const created = new Date(item.json.createdAt);
  const now = new Date();
  
  // Diferença em dias
  const diffMs = now - created;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Adicionar 30 dias
  const expiresAt = new Date(created);
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  return {
    json: {
      ...item.json,
      ageInDays: diffDays,
      expiresAt: expiresAt.toISOString(),
      isExpired: now > expiresAt
    }
  };
});
```

### Pattern 3: Working with Moment.js (Available in Cloud)

```javascript
// moment está disponível no n8n Cloud
const moment = require('moment');

const items = $input.all();

return items.map(item => {
  const date = moment(item.json.date);
  
  return {
    json: {
      ...item.json,
      formatted: date.format('DD/MM/YYYY HH:mm'),
      fromNow: date.fromNow(),
      quarter: date.quarter(),
      weekOfYear: date.week(),
      isWeekend: [0, 6].includes(date.day())
    }
  };
});
```

## 🔢 Number Operations

### Pattern 1: Calculations & Formatting

```javascript
const items = $input.all();

return items.map(item => {
  const value = item.json.price;
  const quantity = item.json.quantity;
  
  return {
    json: {
      ...item.json,
      subtotal: value * quantity,
      tax: (value * quantity * 0.1).toFixed(2),
      total: (value * quantity * 1.1).toFixed(2),
      formatted: {
        price: `R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
        percentage: `${(item.json.discount * 100).toFixed(1)}%`
      }
    }
  };
});
```

### Pattern 2: Statistical Operations

```javascript
const items = $input.all();
const values = items.map(item => item.json.value);

// Cálculos estatísticos
const sum = values.reduce((a, b) => a + b, 0);
const avg = sum / values.length;
const min = Math.min(...values);
const max = Math.max(...values);
const median = values.sort((a, b) => a - b)[Math.floor(values.length / 2)];

return [{
  json: {
    count: values.length,
    sum,
    average: avg,
    min,
    max,
    median,
    range: max - min
  }
}];
```

## 🔐 Data Validation

### Pattern 1: Validate & Filter

```javascript
function isValidEmail(email) {
  return /^[\w.-]+@[\w.-]+\.\w+$/.test(email);
}

function isValidPhone(phone) {
  return /^\+?[\d\s()-]{10,}$/.test(phone);
}

const items = $input.all();

return items.filter(item => {
  const isValid = 
    item.json.name && 
    item.json.name.length >= 3 &&
    isValidEmail(item.json.email) &&
    isValidPhone(item.json.phone);
  
  if (!isValid) {
    console.log(`Invalid item: ${item.json.id}`);
  }
  
  return isValid;
});
```

### Pattern 2: Add Validation Flags

```javascript
const items = $input.all();

return items.map(item => {
  const validations = {
    hasName: !!item.json.name,
    hasEmail: !!item.json.email,
    emailValid: /^[\w.-]+@[\w.-]+\.\w+$/.test(item.json.email || ''),
    ageValid: item.json.age >= 18,
    scoreInRange: item.json.score >= 0 && item.json.score <= 100
  };
  
  const isValid = Object.values(validations).every(v => v === true);
  
  return {
    json: {
      ...item.json,
      validation: {
        ...validations,
        isValid,
        errors: Object.entries(validations)
          .filter(([_, valid]) => !valid)
          .map(([field]) => field)
      }
    }
  };
});
```

## 🔄 Async Operations

### Pattern 1: Sequential Async Calls

```javascript
// Importante: usar async/await
const items = $input.all();
const results = [];

for (const item of items) {
  // Simular operação assíncrona
  await new Promise(resolve => setTimeout(resolve, 100));
  
  results.push({
    json: {
      ...item.json,
      processed: true,
      timestamp: new Date().toISOString()
    }
  });
}

return results;
```

### Pattern 2: Parallel Async Processing

```javascript
const items = $input.all();

// Processar todos em paralelo
const results = await Promise.all(
  items.map(async (item) => {
    // Operação assíncrona
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      json: {
        ...item.json,
        processed: true
      }
    };
  })
);

return results;
```

## 🎯 Advanced Patterns

### Pattern 1: Deduplicate Items

```javascript
const items = $input.all();
const seen = new Set();

return items.filter(item => {
  const key = item.json.email || item.json.id;
  
  if (seen.has(key)) {
    return false;
  }
  
  seen.add(key);
  return true;
});
```

### Pattern 2: Merge Data from Multiple Sources

```javascript
// Assumindo que há 2 inputs conectados
const users = $input.all('Users');
const orders = $input.all('Orders');

// Criar mapa de usuários
const userMap = new Map(
  users.map(item => [item.json.id, item.json])
);

// Juntar orders com users
return orders.map(order => ({
  json: {
    ...order.json,
    user: userMap.get(order.json.userId) || null
  }
}));
```

### Pattern 3: Create Multiple Items from One

```javascript
// Split one item into multiple
const items = $input.all();

return items.flatMap(item => {
  // Criar um item para cada tag
  return item.json.tags.map(tag => ({
    json: {
      itemId: item.json.id,
      itemName: item.json.name,
      tag: tag,
      timestamp: new Date().toISOString()
    }
  }));
});
```

### Pattern 4: Conditional Branching

```javascript
const items = $input.all();

const categorized = {
  high: [],
  medium: [],
  low: []
};

items.forEach(item => {
  const score = item.json.score;
  
  if (score >= 80) {
    categorized.high.push(item);
  } else if (score >= 50) {
    categorized.medium.push(item);
  } else {
    categorized.low.push(item);
  }
});

// Retornar todos em um array com categoria
return [
  ...categorized.high.map(item => ({ json: { ...item.json, category: 'high' } })),
  ...categorized.medium.map(item => ({ json: { ...item.json, category: 'medium' } })),
  ...categorized.low.map(item => ({ json: { ...item.json, category: 'low' } }))
];
```

## 🐛 Debugging & Logging

### Console.log para Debug

```javascript
const items = $input.all();

console.log('Total items:', items.length);
console.log('First item:', items[0]);
console.log('JSON keys:', Object.keys(items[0].json));

// Processar
return items;
```

### Error Handling

```javascript
const items = $input.all();
const results = [];
const errors = [];

for (const item of items) {
  try {
    // Processar item
    const processed = {
      json: {
        ...item.json,
        result: item.json.value * 2
      }
    };
    results.push(processed);
  } catch (error) {
    console.error(`Error processing item ${item.json.id}:`, error);
    errors.push({
      json: {
        itemId: item.json.id,
        error: error.message
      }
    });
  }
}

// Retornar apenas sucessos ou incluir erros?
return results;
// ou
// return [...results, ...errors];
```

## 📚 Available Libraries (n8n Cloud)

```javascript
// crypto - Node.js crypto module
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update('text').digest('hex');

// moment - Date manipulation
const moment = require('moment');
const formatted = moment().format('YYYY-MM-DD');
```

## 💡 Best Practices

1. **Sempre retorne array de items**
2. **Use `console.log()` para debug**
3. **Mantenha código limpo e comentado**
4. **Trate erros adequadamente**
5. **Use async/await para operações assíncronas**
6. **Aproveite built-in methods ($input, $json, etc)**

---

**Recursos Oficiais:**
- [Code Node Docs](https://docs.n8n.io/code/code-node/)
- [Code Cookbook](https://docs.n8n.io/code/cookbook/code-node/)
- [Built-in Methods](https://docs.n8n.io/code/builtin/overview/)
