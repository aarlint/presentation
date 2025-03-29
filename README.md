# PowerPoint Generator - Frontend-Only Version

This is a frontend-only version of the PowerPoint Generator application that allows you to create PowerPoint presentations from YAML definitions without requiring a backend server.

## Features

- Create PowerPoint presentations from YAML definitions
- Real-time YAML validation
- Client-side PowerPoint generation
- Local storage for presentation history
- Download generated presentations directly

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository
2. Navigate to the client directory:
   ```
   cd client
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Running the Application

To start the development server with auto-refresh:

```
npm run dev
```

Or use the standard start command:

```
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000) (or another port if 3000 is already in use).

### Building for Production

To build the application for production:

```
npm run build
```

The build artifacts will be stored in the `build/` directory.

## How It Works

This frontend-only version uses:

1. **Client-side PowerPoint Generation**: Uses the pptxgenjs library to generate PowerPoint files directly in the browser
2. **Browser Storage**: Stores presentation metadata and content in localStorage/sessionStorage
3. **In-memory File Generation**: Creates PowerPoint files in memory and offers direct download

## YAML Format

The application expects YAML in the following format:

```yaml
presentation:
  metadata:
    title: "My Presentation"
    author: "Your Name"
    date: "2025-03-07"
    default_font:
      family: "Arial"
      size: 12
      color: "#000000"

  pages:
    - page:
        title: "Introduction"
        layout: "title_and_content"
        background:
          color: "#FFFFFF"
        content_blocks:
          - block:
              type: "text"
              position:
                x: "10%"
                y: "25%"
                width: "80%"
                height: "50%"
              content:
                text: "Welcome to my presentation!"
                font:
                  size: 18
                alignment: "center"
```

## Limitations

- Browser storage limits (typically 5-10MB for localStorage)
- No multi-device synchronization
- Limited to browser capabilities

## License

ISC