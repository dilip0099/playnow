import fs from "fs";
import path from "path";
import { GameMetadata } from "../types/game";

const gamesPath = path.join(process.cwd(), "src/data/games.json");
const games: GameMetadata[] = JSON.parse(fs.readFileSync(gamesPath, "utf-8"));

console.log(`Auditing and enhancing ${games.length} games for 100% unique SEO descriptions...`);

let count = 0;

const CATEGORY_HOOKS: Record<string, string[]> = {
  action: [
    "Experience adrenaline-fueled combat and intense reflexes in this fast-paced action game.",
    "Test your timing, agility, and combat strategy in this action-packed browser title.",
    "Dive into explosive action where quick thinking and sharp maneuvers are required to win.",
  ],
  puzzle: [
    "Challenge your logic and spatial problem-solving skills with this engaging puzzle experience.",
    "Sharpen your brain with strategic tile-matching, maze-solving, and mind-bending challenges.",
    "Train your focus and analytical thinking in this addictively satisfying puzzle game.",
  ],
  arcade: [
    "Enjoy classic arcade nostalgia packed with high scores, fast action, and responsive controls.",
    "Test your endurance and quick reactions in this retro-inspired arcade challenge.",
    "Relive timeless arcade mechanics designed for instant play and continuous replayability.",
  ],
  racing: [
    "Put your pedal to the metal in high-speed track battles and extreme vehicle maneuvering.",
    "Master sharp turns, drift control, and acceleration in this thrilling racing title.",
    "Burn rubber across challenging tracks while unlocking faster rides and upgrade paths.",
  ],
  adventure: [
    "Embark on an epic journey filled with exploration, mystery, and hidden secrets to discover.",
    "Navigate mysterious worlds, solve environmental obstacles, and uncover storyline paths.",
    "Step into an immersive adventure where every choice and discovery brings new rewards.",
  ],
  strategy: [
    "Outsmart your opponents through resource management, tactical positioning, and long-term planning.",
    "Build your army, manage defenses, and execute precise strategic plays to claim victory.",
    "Test your decision-making abilities in high-stakes tactical battles and economic expansion.",
  ],
  sports: [
    "Show off your athletic skills, precise timing, and competitive sportsmanship on the field.",
    "Execute game-winning plays, perfect your swing or shot, and dominate the leaderboard.",
    "Experience realistic physics and intuitive controls in this competitive sports challenge.",
  ],
  multiplayer: [
    "Compete against real players worldwide in fast-paced, real-time multiplayer arena battles.",
    "Team up or go solo in high-octane .io style multiplayer matches designed for continuous action.",
    "Test your skills against live opponents in global multiplayer leaderboards and tactical arenas.",
  ],
  classic: [
    "Enjoy timeless classic gameplay rules refined for smooth, modern web browsers.",
    "Master the traditional strategy and patient calculation of classic board and card gaming.",
    "Play authentic classic games with smooth animations, customizable rules, and no downloads.",
  ],
};

function getUniqueHook(category: string, id: string): string {
  const hooks = CATEGORY_HOOKS[category.toLowerCase()] || CATEGORY_HOOKS.action;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 33 + id.charCodeAt(i)) >>> 0;
  }
  return hooks[hash % hooks.length];
}

const updatedGames = games.map((game) => {
  const originalDesc = (game.description || "").trim();
  
  // If the description is already enhanced or contains PlayThorn specific details, keep it
  if (originalDesc.includes("PlayThorn") && originalDesc.length > 200) {
    return game;
  }

  const hook = getUniqueHook(game.category, game.id);
  const cleanOriginal = originalDesc
    .replace(/^play\s+.*?online\s+for\s+free\b/i, "")
    .replace(/\bgame\s+monetize\b/gi, "PlayThorn")
    .replace(/\bgamepix\b/gi, "PlayThorn")
    .trim();

  const formattedTitle = game.derivedTitle || game.title;
  const uniqueSuffix = ` Play ${formattedTitle} free and unblocked directly in your browser on PlayThorn — optimized for instant fullscreen loading on both desktop and mobile devices with zero downloads.`;

  const newDescription = `${hook} ${cleanOriginal ? cleanOriginal + "." : ""}${uniqueSuffix}`;

  count++;
  return {
    ...game,
    description: newDescription,
  };
});

fs.writeFileSync(gamesPath, JSON.stringify(updatedGames, null, 2), "utf-8");
console.log(`Successfully updated ${count} game descriptions with unique, SEO-friendly PlayThorn copy!`);
