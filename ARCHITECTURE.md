# Exelaki Backend Architecture

## 1. System Architecture

```mermaid
graph TB
    Client[Frontend Client]
    API[Express Server]
    Auth[Auth Service]
    DB[(MongoDB)]
    
    Client <--> |HTTP/CORS| API
    API <--> |JWT| Auth
    API <--> |Mongoose| DB
    Auth <--> |User Data| DB

    style Client fill:#2196F3,stroke:#1565C0,color:white
    style API fill:#4CAF50,stroke:#2E7D32,color:white
    style Auth fill:#FF9800,stroke:#EF6C00,color:white
    style DB fill:#9C27B0,stroke:#6A1B9A,color:white
```

## 2. Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant AC as AuthController
    participant AS as AuthService
    participant DB as MongoDB

    %% Register Flow
    C->>AC: POST /api/auth/register
    Note over AC: Validate input
    AC->>AS: registerUser(email, password)
    AS->>DB: Create user
    DB-->>AS: User created
    AS-->>AC: Return user
    AC-->>C: Send tokens

    %% Login Flow
    C->>AC: POST /api/auth/login
    Note over AC: Validate credentials
    AC->>AS: validateUser(email, password)
    AS->>DB: Find user
    DB-->>AS: User found
    AS-->>AC: Validate password
    AC-->>C: Send tokens

    %% Protected Route
    C->>AC: Request + Bearer Token
    Note over AC: Verify JWT
    Alt Valid token
        AC-->>C: Allow access
    else Invalid token
        AC-->>C: 401 Unauthorized
    end
```

## 3. API Routes Structure

```mermaid
graph LR
    API[/api]
    Auth[/auth]
    Entries[/entries]
    Budget[/budget]
    Categories[/categories]
    FinScore[/financial-score]
    
    API --> Auth & Entries & Budget & Categories & FinScore
    
    Auth --> Register[POST /register]
    Auth --> Login[POST /login]
    Auth --> Refresh[POST /refresh-token]
    
    Entries --> AddEntry[POST /]
    Entries --> GetEntries[GET /]
    Entries --> EditEntry[PUT /:id]
    Entries --> DeleteEntry[DELETE /:id]
    
    style API fill:#2196F3,stroke:#1565C0,color:white
    style Auth fill:#4CAF50,stroke:#2E7D32,color:white
    style Entries fill:#4CAF50,stroke:#2E7D32,color:white
    style Budget fill:#4CAF50,stroke:#2E7D32,color:white
```

## 4. Data Models

```mermaid
erDiagram
    User ||--o{ Budget : creates
    User ||--o{ Entry : records
    User ||--o{ Category : has
    Budget ||--o{ Entry : contains
    
    User {
        ObjectId _id
        string email
        string password
        datetime createdAt
    }
    
    Budget {
        ObjectId _id
        ObjectId userId
        string name
        number month
        number year
    }
    
    Entry {
        ObjectId _id
        ObjectId userId
        ObjectId budgetId
        string name
        number amount
        object category
    }
```

## 5. Request Flow

```mermaid
flowchart LR
    subgraph Client
        Request[HTTP Request]
    end
    
    subgraph Backend
        Middleware[CORS/Helmet]
        Auth[JWT Auth]
        Controller[Controller]
        Service[Service Layer]
        DB[(MongoDB)]
    end
    
    Request --> Middleware
    Middleware --> Auth
    Auth --> Controller
    Controller --> Service
    Service --> DB
    
    style Request fill:#2196F3,stroke:#1565C0,color:white
    style Middleware fill:#FF9800,stroke:#EF6C00,color:white
    style Auth fill:#FF9800,stroke:#EF6C00,color:white
    style Controller fill:#4CAF50,stroke:#2E7D32,color:white
    style Service fill:#4CAF50,stroke:#2E7D32,color:white
    style DB fill:#9C27B0,stroke:#6A1B9A,color:white
```

## 6. Directory Structure

```mermaid
graph TD
    Root[src/]
    Config[config/]
    Controllers[controllers/]
    Models[models/]
    Routes[routes/]
    Services[services/]
    Utils[utils/]
    Middleware[middleware/]
    
    Root --> Config & Controllers & Models & Routes & Services & Utils & Middleware
    
    Config --> MW[middleware.js]
    Config --> RT[routes.js]
    
    Controllers --> Auth[authController.js]
    Controllers --> Entry[entryController.js]
    Controllers --> Budget[budgetController.js]
    
    style Root fill:#FFA726,stroke:#F57C00,color:white
    style Config fill:#81C784,stroke:#388E3C,color:white
    style Controllers fill:#81C784,stroke:#388E3C,color:white
    style Models fill:#81C784,stroke:#388E3C,color:white
```

## 7. Key Components Reference

### Authentication Controller
```javascript:src/controllers/authController.js
startLine: 6
endLine: 102
```

### Middleware Configuration
```javascript:src/config/middleware.js
startLine: 5
endLine: 19
```

### Route Configuration
```javascript:src/config/routes.js
startLine: 7
endLine: 19
```

This architecture document provides a visual representation of the system's structure and interactions. The diagrams are color-coded for better understanding of different components and their relationships.