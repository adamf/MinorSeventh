# Minor Seventh 🎵

A modern, responsive ear training web application for learning musical intervals. Built with modern web technologies and designed for both desktop and mobile devices.

## Features

- **Interval Quiz Mode**: Test your ability to recognize musical intervals
- **Interval Training Mode**: Practice by listening to any interval on demand
- **13 Intervals**: From unison to octave, including all common intervals
- **Configurable Options**: Toggle arpeggios and change interval direction (ascending/descending)
- **Responsive Design**: Works great on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Space/Enter to play, number keys (1-9, 0) for quick interval selection
- **Modern Audio**: Uses Web Audio API for reliable, cross-browser audio playback

## Technology Stack

- **Vite** - Next-generation frontend build tool
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **Web Audio API** - Native browser audio (no Flash required!)
- **Vanilla JavaScript** - No framework dependencies, pure ES modules

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/adamf/MinorSeventh.git
cd MinorSeventh

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space / Enter | Play current interval |
| 1-9, 0 | Select interval (1=Unison, 2=Minor 2nd, etc.) |

## Project Structure

```
MinorSeventh/
├── src/
│   ├── index.html      # Main HTML file
│   ├── main.js         # Application logic
│   ├── audio.js        # Web Audio API manager
│   ├── intervals.js    # Interval definitions
│   └── styles.css      # Tailwind CSS styles
├── public/
│   └── samples/        # Audio sample files (MP3)
├── package.json
├── vite.config.js
└── README.md
```

## License

This webapp is licensed under the BSD License.

The musical note samples included are free to use in your applications.

### Third-party Licenses

- The original jQuery/jQuery UI code was licensed under the MIT License
- SoundManager 2 was licensed under the BSD License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Adam Fletcher - [feedback@minorseventh.com](mailto:feedback@minorseventh.com)

---

*Originally created in 2010, modernized in 2024 with ❤️*
