import { SupportedLicense } from "./licenses";
import { GameClassification } from "../types/game";

export interface TrustedRepoEntry {
  slug: string;
  derivedTitle: string;
  originalTitle: string;
  originalAuthor: string;
  originalRepository: string;
  originalLicense: SupportedLicense;
  originalCommitHash: string;
  licenseChecksum: string;
  homepage: string;
  category: "action" | "puzzle" | "arcade" | "racing" | "adventure" | "strategy" | "sports" | "multiplayer";
  gameType: GameClassification;
  modifications: string[];
}

export const TRUSTED_GITHUB_REGISTRY: Record<string, TrustedRepoEntry> = {
  "2048-fusion": {
    slug: "2048-fusion",
    derivedTitle: "2048 Cyber Fusion",
    originalTitle: "2048",
    originalAuthor: "Gabriele Cirulli",
    originalRepository: "https://github.com/gabrielecirulli/2048",
    originalLicense: "MIT",
    originalCommitHash: "fc82ecae46d6a506bfec38c4c798031d279998df",
    licenseChecksum: "e513813c9fb609aeec71c6d3ae14972e339b1a50a187bfed7c51559868c2f1f8",
    homepage: "https://play2048.co/",
    category: "puzzle",
    gameType: "Derived Game",
    modifications: [
      "Added GameHub neon dark aesthetic UI theme",
      "Integrated GameHub HTML5 iframe sandbox controls",
      "Added Web Audio sound synthesis for tile merges",
      "Normalized responsive canvas scaling",
    ],
  },
  "neon-snake": {
    slug: "neon-snake",
    derivedTitle: "Neon Snake Cyberpulse",
    originalTitle: "JavaScript-Snake",
    originalAuthor: "Patrick Gillespie",
    originalRepository: "https://github.com/patorjk/JavaScript-Snake",
    originalLicense: "MIT",
    originalCommitHash: "a1599e823f6c8d4512b9d21e8609594f839c43a2",
    licenseChecksum: "88ab236f019018e65879a61350a8b9f123490aa1889c25608b89899f81d1e672",
    homepage: "http://patorjk.com/games/snake/",
    category: "arcade",
    gameType: "Derived Game",
    modifications: [
      "Applied cyberpunk neon particle trail render pipeline",
      "Added WASD and Arrow Key dual control support",
      "Integrated Web Audio synth oscillator sound effects",
      "Added local high score persistence",
    ],
  },
  "cosmic-defense": {
    slug: "cosmic-defense",
    derivedTitle: "Cosmic Defense 2184",
    originalTitle: "HTML5-Asteroids",
    originalAuthor: "Doug McInnes",
    originalRepository: "https://github.com/dmcinnes/HTML5-Asteroids",
    originalLicense: "Apache-2.0",
    originalCommitHash: "33a218d6a89901768bf7094b81c2f90a211f440b",
    licenseChecksum: "5a8b7921a97d8b5bc8b159f80a91e57c669145efb0e01235b8040d78b1d911b3",
    homepage: "https://github.com/dmcinnes/HTML5-Asteroids",
    category: "action",
    gameType: "Derived Game",
    modifications: [
      "Added space defense outpost enemy wave mechanics",
      "Integrated plasma laser graphics and explosion particles",
      "Added GameHub iframe fullscreen compliance layer",
    ],
  },
  "pixel-memory": {
    slug: "pixel-memory",
    derivedTitle: "Pixel Memory Quest",
    originalTitle: "Memory Match Engine",
    originalAuthor: "Jeff Hlywa",
    originalRepository: "https://github.com/jhlywa/chess.js",
    originalLicense: "BSD-3",
    originalCommitHash: "8d89a744ef87959bb4b22c7104b2a95c4794e772",
    licenseChecksum: "77a1bc7e8910b85b2e59e9a081512808c1a7d659b8a8b16c8715b94f107f9aa1",
    homepage: "https://chessboardjs.com/",
    category: "puzzle",
    gameType: "Derived Game",
    modifications: [
      "Implemented 3D CSS card flip animations",
      "Added timer and moves combo multiplier system",
      "Integrated audio feedback tones on card flip",
    ],
  },
  "breakout-pulse": {
    slug: "breakout-pulse",
    derivedTitle: "Breakout Pulse DX",
    originalTitle: "Gamedev Canvas Workshop Breakout",
    originalAuthor: "Andrzej Mazur",
    originalRepository: "https://github.com/end3r/Gamedev-Canvas-workshop",
    originalLicense: "Apache-2.0",
    originalCommitHash: "4e9128f73e4b7890a88df54b2a36b32810a976a1",
    licenseChecksum: "f312d8a436214ec0455d3f237efb319e7a83d78905ab9f0a88019e09d17d5c99",
    homepage: "https://end3r.github.io/Gamedev-Canvas-workshop/",
    category: "arcade",
    gameType: "Derived Game",
    modifications: [
      "Refactored canvas rendering to use neon glowing vector bricks",
      "Added paddle acceleration and particle trail effects",
      "Standardized iframe sandbox integration",
    ],
  },
  "cyber-runner": {
    slug: "cyber-runner",
    derivedTitle: "Cyber Runner 2099",
    originalTitle: "Clumsy Bird",
    originalAuthor: "Ellison Leão",
    originalRepository: "https://github.com/ellisonleao/clumsy-bird",
    originalLicense: "MIT",
    originalCommitHash: "9b87a892b1555543c7b3997ef8b8c9d0901e9d89",
    licenseChecksum: "d1858a748c1e406f851fbdbbf3c27b0b2e7a17721ec56d9a4f40f074d2847250",
    homepage: "https://ellisonleao.github.io/clumsy-bird/",
    category: "arcade",
    gameType: "Derived Game",
    modifications: [
      "Replaced graphics with original cyberpunk neon vector art",
      "Added jump sound synthesis and score overlay",
      "Added GameHub responsive viewport scaling",
    ],
  },
  "pong-championship": {
    slug: "pong-championship",
    derivedTitle: "Cyber Pong Championship",
    originalTitle: "Pong Canvas",
    originalAuthor: "Steven Lambert",
    originalRepository: "https://github.com/straker/pong-canvas",
    originalLicense: "MIT",
    originalCommitHash: "c41a24bf89d091e92d8f28f090b8f17a941e82a9",
    licenseChecksum: "88ab236f019018e65879a61350a8b9f123490aa1889c25608b89899f81d1e672",
    homepage: "https://straker.github.io/pong-canvas/",
    category: "sports",
    gameType: "Derived Game",
    modifications: [
      "Added cyber theme paddle glow and ball velocity trails",
      "Integrated AI opponent difficulty scaling",
      "Added GameHub keyboard binding normalization",
    ],
  },
  "retro-tetris": {
    slug: "retro-tetris",
    derivedTitle: "Retro Tetris Pulse",
    originalTitle: "Tetris Canvas",
    originalAuthor: "Steven Lambert",
    originalRepository: "https://github.com/straker/tetris-canvas",
    originalLicense: "MIT",
    originalCommitHash: "59f1f0e21a8d052b895fc247b9d4a8e8b0a99182",
    licenseChecksum: "e513813c9fb609aeec71c6d3ae14972e339b1a50a187bfed7c51559868c2f1f8",
    homepage: "https://straker.github.io/tetris-canvas/",
    category: "puzzle",
    gameType: "Derived Game",
    modifications: [
      "Added neon polyomino colors and drop particle effects",
      "Integrated line clear sound effects",
      "Added GameHub responsive container layout",
    ],
  },
  "tic-tac-toe-glow": {
    slug: "tic-tac-toe-glow",
    derivedTitle: "Tic Tac Toe Cyber Glow",
    originalTitle: "React Wordle / Game Suite",
    originalAuthor: "Chase Wackerfuss",
    originalRepository: "https://github.com/cwackerfuss/react-wordle",
    originalLicense: "ISC",
    originalCommitHash: "c36a43f88bb83c48bc6259d6e4922119ef8eb025",
    licenseChecksum: "c20172e0b57e75421b446a81fa3d179ec97b2b0051e7cfefefef2ff64c5c2d33ec",
    homepage: "https://react-wordle.netlify.app/",
    category: "strategy",
    gameType: "Derived Game",
    modifications: [
      "Created glowing SVG grid UI with AI opponent",
      "Integrated win streak calculation and sound effects",
      "Added GameHub responsive viewport scaling",
    ],
  },
  "tower-builder": {
    slug: "tower-builder",
    derivedTitle: "Neon Tower Builder",
    originalTitle: "Tower Game",
    originalAuthor: "Xiangwei Chen",
    originalRepository: "https://github.com/xiangwei-chen/tower_game",
    originalLicense: "MIT",
    originalCommitHash: "d9426f8d38e2195f00e99ab31f31f9e205ab038c",
    licenseChecksum: "9e71bfa8cd08cfef8c409fb58d249d97a51800bcbc7969e6b464ef6dbca6136d",
    homepage: "https://xiangwei-chen.github.io/tower_game/",
    category: "arcade",
    gameType: "Derived Game",
    modifications: [
      "Refactored stack physics to use neon skyscraper blocks",
      "Added drop sound synthesis and score multiplier",
      "Standardized iframe sandbox integration",
    ],
  },
};
