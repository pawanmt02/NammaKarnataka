/**
 * Namma Kannada - Karnataka Dialect Region Seed Data
 * Contains metadata for all dialect regions including coordinates for the map.
 */

import { DialectRegion, type RegionInfo, type CulturalArtifact } from "@/types";

export const DIALECT_REGIONS: RegionInfo[] = [
  {
    id: DialectRegion.NORTH_KARNATAKA,
    name: "North Karnataka",
    kannada_name: "ಉತ್ತರ ಕರ್ನಾಟಕ",
    nameKannada: "ಉತ್ತರ ಕರ್ನಾಟಕ",
    description:
      "The dialect of Dharwad, Belgaum, Bijapur, and Hubli-Dharwad region. Known for its distinctive vocabulary and intonation influenced by Marathi and Hindi.",
    center: [15.85, 75.02],
    color: "#FF6B35",
    districts: ["Dharwad", "Belgaum", "Bijapur", "Bagalkot", "Gadag", "Haveri"],
    sample_phrases: ["ಏನ ಮಾಡ್ತೀಯಾ? (What are you doing?)", "ಬರ್ರೀ ಇಲ್ಲಿ (Come here)", "ಛಲೋ ಅದ (It's good)"],
    samplePhrases: ["ಏನ ಮಾಡ್ತೀಯಾ? (What are you doing?)", "ಬರ್ರೀ ಇಲ್ಲಿ (Come here)", "ಛಲೋ ಅದ (It's good)"],
  },
  {
    id: DialectRegion.SOUTH_KARNATAKA,
    name: "South Karnataka",
    kannada_name: "ದಕ್ಷಿಣ ಕರ್ನಾಟಕ",
    nameKannada: "ದಕ್ಷಿಣ ಕರ್ನಾಟಕ",
    description:
      "The Mysuru-Mandya dialect, considered closest to 'standard' literary Kannada. Known for its musical quality and honorific usage.",
    center: [12.31, 76.66],
    color: "#004E89",
    districts: ["Mysuru", "Mandya", "Chamarajanagar"],
    sample_phrases: ["ಏನ್ ಮಾಡ್ತಿದ್ದೀರಾ? (What are you doing?)", "ಹೋಗ್ಬರ್ತೀನಿ (I'll go and come)", "ಊಟ ಆಯ್ತಾ? (Had food?)"],
    samplePhrases: ["ಏನ್ ಮಾಡ್ತಿದ್ದೀರಾ? (What are you doing?)", "ಹೋಗ್ಬರ್ತೀನಿ (I'll go and come)", "ಊಟ ಆಯ್ತಾ? (Had food?)"],
  },
  {
    id: DialectRegion.COASTAL_KARNATAKA,
    name: "Coastal Karnataka (Karavali)",
    kannada_name: "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    nameKannada: "ಕರಾವಳಿ ಕರ್ನಾಟಕ",
    description:
      "Kundapura, Mangaluru, and Udupi dialects with heavy Tulu and Konkani influences. Features unique verb conjugations and seafood vocabulary.",
    center: [13.34, 74.77],
    color: "#00A896",
    districts: ["Dakshina Kannada", "Udupi", "Uttara Kannada"],
    sample_phrases: ["ಎಂತ ಮಾಡ್ತಿದ್ದೆ? (What are you doing?)", "ಬಾಲೇ (Come)", "ಪೊರ್ಲು (Go/Walk)"],
    samplePhrases: ["ಎಂತ ಮಾಡ್ತಿದ್ದೆ? (What are you doing?)", "ಬಾಲೇ (Come)", "ಪೊರ್ಲು (Go/Walk)"],
  },
  {
    id: DialectRegion.OLD_MYSURU,
    name: "Old Mysuru Region",
    kannada_name: "ಹಳೆ ಮೈಸೂರು",
    nameKannada: "ಹಳೆ ಮೈಸೂರು",
    description:
      "The heritage dialect of Hassan, Tumkur, and parts of Bengaluru Rural. Preserves many archaic Kannada forms from the Hoysala era.",
    center: [13.0, 76.1],
    color: "#7B2D8E",
    districts: ["Hassan", "Tumkur", "Bengaluru Rural"],
    sample_phrases: ["ಹ್ಯಾಂಗಿದ್ದೀಯಾ? (How are you?)", "ಬರ್ಲಾ ಅಲ್ಲಿ (Come there)", "ಊಟಕ್ಕ ಬಾ (Come for food)"],
    samplePhrases: ["ಹ್ಯಾಂಗಿದ್ದೀಯಾ? (How are you?)", "ಬರ್ಲಾ ಅಲ್ಲಿ (Come there)", "ಊಟಕ್ಕ ಬಾ (Come for food)"],
  },
  {
    id: DialectRegion.HYDERABAD_KARNATAKA,
    name: "Hyderabad Karnataka",
    kannada_name: "ಹೈದರಾಬಾದ ಕರ್ನಾಟಕ",
    nameKannada: "ಹೈದರಾಬಾದ ಕರ್ನಾಟಕ",
    description:
      "Gulbarga, Raichur, Bidar, and Yadgir dialects strongly influenced by Urdu and Deccani. Features unique Perso-Arabic loanwords.",
    center: [16.83, 76.85],
    color: "#E63946",
    districts: ["Kalaburagi", "Raichur", "Bidar", "Yadgir", "Koppal", "Bellary"],
    sample_phrases: ["ಕ್ಯಾ ಮಾಡ್ತೀಯ? (What are you doing?)", "ಇಧರ್ ಬಾ (Come here)", "ಅಚ್ಛಾ ಐತಿ (It's fine)"],
    samplePhrases: ["ಕ್ಯಾ ಮಾಡ್ತೀಯ? (What are you doing?)", "ಇಧರ್ ಬಾ (Come here)", "ಅಚ್ಛಾ ಐತಿ (It's fine)"],
  },
  {
    id: DialectRegion.MALNAD,
    name: "Malnad (Havyaka)",
    kannada_name: "ಮಲೆನಾಡು",
    nameKannada: "ಮಲೆನಾಡು",
    description:
      "The Havyaka Kannada of Shimoga and Chikmagalur, spoken in the Western Ghats. Known for its archaic Dravidian vocabulary and forest-related terminology.",
    center: [13.93, 75.57],
    color: "#2D6A4F",
    districts: ["Shimoga", "Chikmagalur", "Kodagu (parts)"],
    sample_phrases: ["ಎಂತ ಮಾಡ್ತಿ? (What are you doing?)", "ಬಪ್ಪಾ (Come)", "ಜಾಲ ಐತ (It's nice)"],
    samplePhrases: ["ಎಂತ ಮಾಡ್ತಿ? (What are you doing?)", "ಬಪ್ಪಾ (Come)", "ಜಾಲ ಐತ (It's nice)"],
  },
  {
    id: DialectRegion.KODAGU,
    name: "Kodagu (Coorg)",
    kannada_name: "ಕೊಡಗು",
    nameKannada: "ಕೊಡಗು",
    description:
      "Kodava Takk, the language of Coorg with distinct Kodava vocabulary. Features a unique martial and agricultural lexicon.",
    center: [12.42, 75.74],
    color: "#DAA520",
    districts: ["Kodagu"],
    sample_phrases: ["ಎನ್ನ ಮಾಡುವ? (What are you doing?)", "ಬಾಡ (Come)", "ನಲ್ಲ ಉಂಡು (It's good)"],
    samplePhrases: ["ಎನ್ನ ಮಾಡುವ? (What are you doing?)", "ಬಾಡ (Come)", "ನಲ್ಲ ಉಂಡು (It's good)"],
  },
  {
    id: DialectRegion.SOLIGA,
    name: "Soliga Tribal",
    kannada_name: "ಸೋಲಿಗ",
    nameKannada: "ಸೋಲಿಗ",
    description:
      "The language of the Soliga tribal community in the BR Hills. One of Karnataka's most endangered linguistic traditions with unique nature vocabulary.",
    center: [11.93, 77.12],
    color: "#8B4513",
    districts: ["Chamarajanagar (BR Hills)"],
    sample_phrases: ["ಏನ್ ಮಾಡ್ತಿ? (What do you do?)", "ಬಾರಪ್ಪ (Come)", "ಕಾಡಿನಲ್ಲಿ ಹೋಗ (Go to forest)"],
    samplePhrases: ["ಏನ್ ಮಾಡ್ತಿ? (What do you do?)", "ಬಾರಪ್ಪ (Come)", "ಕಾಡಿನಲ್ಲಿ ಹೋಗ (Go to forest)"],
  },
];

export const CULTURAL_ARTIFACTS: CulturalArtifact[] = [
  {
    id: "mysore-peta",
    name: "Mysore Peta",
    kannada_name: "ಮೈಸೂರು ಪೇಟ",
    nameKannada: "ಮೈಸೂರು ಪೇಟ",
    description: "The iconic royal turban of the Mysore kingdom, symbolizing honor and dignity. Worn during Dasara celebrations.",
    period: "Wodeyar Dynasty (1399–1950)",
    region: DialectRegion.SOUTH_KARNATAKA,
    model_url: "/models/mysore-peta.glb",
    thumbnail_url: "/images/mysore-peta-thumb.jpg",
    associated_phrases: ["ಪೇಟ ಕಟ್ಟು", "ದಸರಾ ಹಬ್ಬ"],
    category: "attire",
  },
  {
    id: "bisi-bele-bath",
    name: "Bisi Bele Bath",
    kannada_name: "ಬಿಸಿ ಬೇಲೆ ಬಾತ್",
    nameKannada: "ಬಿಸಿ ಬೇಲೆ ಬಾತ್",
    description: "A spicy, protein-rich rice-lentil dish from the Old Mysuru region. The name literally means 'hot lentil rice'.",
    period: "Origins in Mysore Palace kitchens",
    region: DialectRegion.OLD_MYSURU,
    model_url: "/models/bisi-bele-bath.glb",
    thumbnail_url: "/images/bisi-bele-bath-thumb.jpg",
    associated_phrases: ["ಬಿಸಿ ಬೇಲೆ", "ಊಟದ ಪದ"],
    category: "cuisine",
  },
  {
    id: "ilkal-saree",
    name: "Ilkal Saree",
    kannada_name: "ಇಳಕಲ್ ಸೀರೆ",
    nameKannada: "ಇಳಕಲ್ ಸೀರೆ",
    description: "Traditional handloom saree from Ilkal in North Karnataka, known for its distinctive pallu with temple borders.",
    period: "8th Century CE (Chalukya era)",
    region: DialectRegion.NORTH_KARNATAKA,
    model_url: "/models/ilkal-saree.glb",
    thumbnail_url: "/images/ilkal-saree-thumb.jpg",
    associated_phrases: ["ಇಳಕಲ್ ಸೀರೆ", "ಮಗ್ಗದ ಕಸೂತಿ"],
    category: "attire",
  },
  {
    id: "yakshagana-crown",
    name: "Yakshagana Crown (Kireeta)",
    kannada_name: "ಯಕ್ಷಗಾನ ಕಿರೀಟ",
    nameKannada: "ಯಕ್ಷಗಾನ ಕಿರೀಟ",
    description: "The ornate crown worn during Yakshagana dance-drama performances, a signature art form of Coastal Karnataka.",
    period: "16th Century Vijayanagara period",
    region: DialectRegion.COASTAL_KARNATAKA,
    model_url: "/models/yakshagana-crown.glb",
    thumbnail_url: "/images/yakshagana-thumb.jpg",
    associated_phrases: ["ಯಕ್ಷಗಾನ", "ಬಯಲಾಟ", "ವೇಷ"],
    category: "craft",
  },
  {
    id: "kodava-peechekathi",
    name: "Kodava Peechekathi",
    kannada_name: "ಕೊಡವ ಪೀಚೆಕತ್ತಿ",
    nameKannada: "ಕೊಡವ ಪೀಚೆಕತ್ತಿ",
    description: "The ceremonial curved knife of the Kodava people, integral to their martial traditions and festivals.",
    period: "Ancient Kodava martial lineage",
    region: DialectRegion.KODAGU,
    model_url: "/models/peechekathi.glb",
    thumbnail_url: "/images/peechekathi-thumb.jpg",
    associated_phrases: ["ಪೀಚೆಕತ್ತಿ", "ಕೊಡವ ಸಂಪ್ರದಾಯ"],
    category: "craft",
  },
];

export const KARNATAKA_CENTER: [number, number] = [14.5, 75.7];
export const KARNATAKA_ZOOM = 7;

export const BADGE_INFO: Record<string, { name: string; icon: string; description: string }> = {
  mysuru_scholar: { name: "ಮೈಸೂರು Scholar", icon: "🎓", description: "Expert in Mysuru dialect" },
  karavali_expert: { name: "ಕರಾವಳಿ Expert", icon: "🌊", description: "Master of Coastal Kannada" },
  malnad_maven: { name: "ಮಲೆನಾಡು Maven", icon: "🌳", description: "Fluent in Havyaka Kannada" },
  north_ka_navigator: { name: "ಉತ್ತರ KA Navigator", icon: "🧭", description: "North Karnataka dialect expert" },
  kodagu_keeper: { name: "ಕೊಡಗು Keeper", icon: "⚔️", description: "Guardian of Kodava heritage" },
  polyglot: { name: "ಬಹುಭಾಷಿ", icon: "🗣️", description: "Knows 5+ dialect regions" },
  contributor_bronze: { name: "ಕೊಡುಗೆದಾರ Bronze", icon: "🥉", description: "10+ contributions" },
  contributor_silver: { name: "ಕೊಡುಗೆದಾರ Silver", icon: "🥈", description: "50+ contributions" },
  contributor_gold: { name: "ಕೊಡುಗೆದಾರ Gold", icon: "🥇", description: "100+ contributions" },
  quiz_master: { name: "ಕ್ವಿಜ್ Master", icon: "🏆", description: "Score 500+ in quizzes" },
};
