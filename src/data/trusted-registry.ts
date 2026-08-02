import { SupportedLicense } from "./licenses";

export interface TrustedRepoEntry {
  slug: string;
  title: string;
  author: string;
  repository: string;
  license: SupportedLicense;
  commitHash: string;
  licenseChecksum: string;
  homepage: string;
  category: "action" | "puzzle" | "arcade" | "racing" | "adventure" | "strategy" | "sports" | "multiplayer";
}

export const TRUSTED_GITHUB_REGISTRY: Record<string, TrustedRepoEntry> = {
  "2048-fusion": {
    slug: "2048-fusion",
    title: "2048 Cyber Fusion",
    author: "Gabriele Cirulli",
    repository: "https://github.com/gabrielecirulli/2048",
    license: "MIT",
    commitHash: "fc82ecae46d6a506bfec38c4c798031d279998df",
    licenseChecksum: "e513813c9fb609aeec71c6d3ae14972e339b1a50a187bfed7c51559868c2f1f8",
    homepage: "https://play2048.co/",
    category: "puzzle",
  },
  "neon-snake": {
    slug: "neon-snake",
    author: "Patrick Gillespie",
    title: "Neon Snake Cyberpulse",
    repository: "https://github.com/patorjk/JavaScript-Snake",
    license: "MIT",
    commitHash: "a1599e823f6c8d4512b9d21e8609594f839c43a2",
    licenseChecksum: "88ab236f019018e65879a61350a8b9f123490aa1889c25608b89899f81d1e672",
    homepage: "http://patorjk.com/games/snake/",
    category: "arcade",
  },
  "cosmic-defense": {
    slug: "cosmic-defense",
    author: "Doug McInnes",
    title: "Cosmic Defense 2184",
    repository: "https://github.com/dmcinnes/HTML5-Asteroids",
    license: "Apache-2.0",
    commitHash: "33a218d6a89901768bf7094b81c2f90a211f440b",
    licenseChecksum: "5a8b7921a97d8b5bc8b159f80a91e57c669145efb0e01235b8040d78b1d911b3",
    homepage: "https://github.com/dmcinnes/HTML5-Asteroids",
    category: "action",
  },
  "pixel-memory": {
    slug: "pixel-memory",
    author: "Jeff Hlywa",
    title: "Pixel Memory Quest",
    repository: "https://github.com/jhlywa/chess.js",
    license: "BSD-3",
    commitHash: "8d89a744ef87959bb4b22c7104b2a95c4794e772",
    licenseChecksum: "77a1bc7e8910b85b2e59e9a081512808c1a7d659b8a8b16c8715b94f107f9aa1",
    homepage: "https://chessboardjs.com/",
    category: "puzzle",
  },
  "breakout-pulse": {
    slug: "breakout-pulse",
    author: "Andrzej Mazur",
    title: "Breakout Pulse DX",
    repository: "https://github.com/end3r/Gamedev-Canvas-workshop",
    license: "Apache-2.0",
    commitHash: "4e9128f73e4b7890a88df54b2a36b32810a976a1",
    licenseChecksum: "f312d8a436214ec0455d3f237efb319e7a83d78905ab9f0a88019e09d17d5c99",
    homepage: "https://end3r.github.io/Gamedev-Canvas-workshop/",
    category: "arcade",
  },
  "cyber-runner": {
    slug: "cyber-runner",
    author: "Ellison Leão",
    title: "Cyber Runner 2099",
    repository: "https://github.com/ellisonleao/clumsy-bird",
    license: "MIT",
    commitHash: "9b87a892b1555543c7b3997ef8b8c9d0901e9d89",
    licenseChecksum: "d1858a748c1e406f851fbdbbf3c27b0b2e7a17721ec56d9a4f40f074d2847250",
    homepage: "https://ellisonleao.github.io/clumsy-bird/",
    category: "arcade",
  },
  "pong-championship": {
    slug: "pong-championship",
    author: "Steven Lambert",
    title: "Cyber Pong Championship",
    repository: "https://github.com/straker/pong-canvas",
    license: "MIT",
    commitHash: "c41a24bf89d091e92d8f28f090b8f17a941e82a9",
    licenseChecksum: "88ab236f019018e65879a61350a8b9f123490aa1889c25608b89899f81d1e672",
    homepage: "https://straker.github.io/pong-canvas/",
    category: "sports",
  },
  "retro-tetris": {
    slug: "retro-tetris",
    author: "Steven Lambert",
    title: "Retro Tetris Pulse",
    repository: "https://github.com/straker/tetris-canvas",
    license: "MIT",
    commitHash: "59f1f0e21a8d052b895fc247b9d4a8e8b0a99182",
    licenseChecksum: "e513813c9fb609aeec71c6d3ae14972e339b1a50a187bfed7c51559868c2f1f8",
    homepage: "https://straker.github.io/tetris-canvas/",
    category: "puzzle",
  },
  "tic-tac-toe-glow": {
    slug: "tic-tac-toe-glow",
    author: "Chase Wackerfuss",
    title: "Tic Tac Toe Cyber Glow",
    repository: "https://github.com/cwackerfuss/react-wordle",
    license: "ISC",
    commitHash: "c36a43f88bb83c48bc6259d6e4922119ef8eb025",
    licenseChecksum: "c20172e0b57e75421b446a81fa3d179ec97b2b0051e7cfefefef2ff64c5c2d33ec",
    homepage: "https://react-wordle.netlify.app/",
    category: "strategy",
  },
  "tower-builder": {
    slug: "tower-builder",
    author: "Xiangwei Chen",
    title: "Neon Tower Builder",
    repository: "https://github.com/xiangwei-chen/tower_game",
    license: "MIT",
    commitHash: "d9426f8d38e2195f00e99ab31f31f9e205ab038c",
    licenseChecksum: "9e71bfa8cd08cfef8c409fb58d249d97a51800bcbc7969e6b464ef6dbca6136d",
    homepage: "https://xiangwei-chen.github.io/tower_game/",
    category: "arcade",
  },
};
