const WORDLIST = [
  "apple", "brave", "crane", "drift", "eagle", "flame", "grape", "haste", 
  "ivory", "jelly", "knife", "lemon", "mango", "noble", "ocean", "pearl", 
  "quest", "river", "stone", "train", "unity", "vivid", "whale", "xenon", 
  "yacht", "zebra", "amber", "baker", "cloud", "dance", "earth", "frost",
  "ghost", "heart", "igloo", "juice", "koala", "lunar", "magic", "ninja",
  "oasis", "panda", "quilt", "radar", "sugar", "tiger", "umbra", "venom",
  "wheat", "yield", "badge", "cabin", "delta", "echo", "fairy", "giant",
  "honey", "ideal", "joker", "karma", "laser", "melon", "nexus", "orbit",
  "pixel", "quiet", "robot", "scout", "tulip", "ultra", "viper", "wagon",
  "alpha", "brick", "charm", "dream", "elite", "forge", "globe", "house",
  "iron", "jewel", "kitty", "laser", "mouse", "night", "olive", "piano",
  "queen", "raven", "smile", "tower", "union", "value", "watch", "youth"
];

/**
 * Generate a random 6-word backup phrase
 */
export function generateBackupPhrase() {
  const phrase = [];
  const array = new Uint32Array(6);
  window.crypto.getRandomValues(array);
  
  for (let i = 0; i < 6; i++) {
    const wordIndex = array[i] % WORDLIST.length;
    phrase.push(WORDLIST[wordIndex]);
  }
  
  return phrase.join(" ");
}

/**
 * Hash a string (PIN or Backup Phrase) using SHA-256
 * @param {string} message 
 * @returns {Promise<string>} Hex representation of the hash
 */
export async function hashString(message) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message.trim().toLowerCase()); // normalize phrases
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}
