# Security Code Patterns — BAD vs GOOD

## SQL Injection (CWE-89)
```javascript
// BAD: String concatenation
const query = "SELECT * FROM users WHERE id = " + userId;

// GOOD: Parameterized query
const query = "SELECT * FROM users WHERE id = $1";
const result = await db.query(query, [userId]);
```

## Hardcoded Secrets (CWE-798)
```javascript
// BAD: Secret in source code
const API_KEY = "sk-1234567890abcdef";

// GOOD: Environment variable
const API_KEY = process.env.API_KEY;
```

## XSS (CWE-79)
```javascript
// BAD: innerHTML with user input
element.innerHTML = userInput;

// GOOD: textContent or sanitize
element.textContent = userInput;
```

## Path Traversal (CWE-22)
```javascript
// BAD: Unsanitized file path
const file = fs.readFileSync(`./uploads/${req.params.name}`);

// GOOD: Resolve and validate
const safePath = path.resolve('./uploads', req.params.name);
if (!safePath.startsWith(path.resolve('./uploads'))) throw new Error('Invalid path');
```

## Insecure Deserialization (CWE-502)
```javascript
// BAD: Deserialize untrusted data
const obj = JSON.parse(userInput); eval(obj.code);

// GOOD: Validate schema before use
const parsed = schema.safeParse(JSON.parse(userInput));
if (!parsed.success) throw new Error('Invalid input');
```
