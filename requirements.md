# LegalSaga AI — Project Requirements

## Functional Requirements

### FR1 — Document Input
- FR1.1: System shall accept plain text input from users
- FR1.2: System shall accept PDF file uploads up to 20MB
- FR1.3: System shall accept image uploads (JPG, PNG, WEBP, BMP, TIFF, GIF)
- FR1.4: System shall extract text from uploaded PDFs using pdf-parse
- FR1.5: System shall extract text from scanned images using OCR.space API

### FR2 — Document Analysis
- FR2.1: System shall generate a simplified plain-language summary
- FR2.2: System shall identify and categorize risks as High, Medium, or Low
- FR2.3: System shall extract key information including dates, obligations, and financial terms
- FR2.4: System shall support multiple output languages
- FR2.5: System shall store analysis results in the database

### FR3 — Q&A System
- FR3.1: System shall allow users to ask questions about analyzed documents
- FR3.2: System shall provide contextual answers based on document content
- FR3.3: System shall store Q&A history linked to specific documents

### FR4 — Document Writer
- FR4.1: System shall allow users to select document types
- FR4.2: System shall generate complete legal documents based on user input
- FR4.3: System shall follow Indian contract law in generated documents
- FR4.4: System shall format documents with proper headings and clauses

### FR5 — Legal Adviser Locator
- FR5.1: System shall detect user location using IP geolocation
- FR5.2: System shall display nearby lawyers on a map
- FR5.3: System shall show lawyer contact information and distance

### FR6 — User Management
- FR6.1: System shall allow users to register with name, email, and password
- FR6.2: System shall allow registered users to login
- FR6.3: System shall maintain user sessions
- FR6.4: System shall show each user only their own documents
- FR6.5: System shall allow users to delete their own documents
- FR6.6: System shall allow users to logout

### FR7 — Law Library
- FR7.1: System shall provide information about major Indian laws
- FR7.2: System shall present legal information in plain language

## Non-Functional Requirements

### NFR1 — Performance
- NFR1.1: Document analysis shall complete within 30 seconds
- NFR1.2: Page load time shall be under 3 seconds
- NFR1.3: OCR extraction shall complete within 20 seconds

### NFR2 — Security
- NFR2.1: User passwords shall be hashed using bcrypt
- NFR2.2: Session data shall be encrypted
- NFR2.3: API keys shall be stored as environment variables
- NFR2.4: Users shall only access their own documents

### NFR3 — Usability
- NFR3.1: Application shall be responsive on mobile and desktop
- NFR3.2: UI shall be intuitive without requiring training
- NFR3.3: Error messages shall be clear and helpful

### NFR4 — Reliability
- NFR4.1: Application shall have 99% uptime
- NFR4.2: Database shall be backed up automatically
- NFR4.3: System shall handle API failures gracefully

### NFR5 — Scalability
- NFR5.1: System shall support multiple concurrent users
- NFR5.2: Database shall scale to handle growing document storage

### NFR6 — Compatibility
- NFR6.1: Application shall work on Chrome, Firefox, Safari, and Edge
- NFR6.2: Application shall work on Android and iOS mobile browsers
- NFR6.3: Application shall support Node.js v20 and above

## System Requirements

### Hardware Requirements
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel Core i3 | Intel Core i5 or higher |
| RAM | 4 GB | 8 GB |
| Storage | 256 GB | 512 GB SSD |
| Network | Broadband | High-speed broadband |

### Software Requirements
| Software | Version |
|----------|---------|
| Node.js | v20.19.0 or higher |
| npm | v10 or higher |
| Git | Latest |
| VS Code | Latest |
| Browser | Chrome/Firefox/Edge (latest) |

### API Requirements
| API | Purpose | Free Tier |
|-----|---------|-----------|
| Groq API | AI document analysis | 14,400 req/day |
| OCR.space | Text extraction from images | 25,000 req/month |
| Neon PostgreSQL | Database hosting | 512 MB storage |
| ip-api.com | IP geolocation | 1,000 req/day |
| OpenStreetMap | Lawyer location data | Unlimited |