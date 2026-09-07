export type FeedPost = {
  id: string;
  author: string;
  avatar: string;
  location: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  tags: string[];
  createdAt: string;
};

export type Comment = {
  id: string;
  postId: string;
  author: string;
  avatar: string;
  body: string;
  likes: number;
  createdAt: string;
  isLocal?: boolean;
};

export type Experience = {
  id: string;
  title: string;
  city: string;
  price: number;
  currency: string;
  duration: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  description: string;
};

export type Hotel = {
  id: string;
  name: string;
  city: string;
  area: string;
  priceFrom: number;
  currency: string;
  rating: number;
  image: string;
  amenities: string[];
  description: string;
};

export type RoutePlan = {
  id: string;
  title: string;
  days: number;
  cities: string[];
  image: string;
  highlights: string[];
  summary: string;
};

export type NightlifeSpot = {
  id: string;
  name: string;
  type: "bar" | "club" | "rooftop";
  area: string;
  city: string;
  vibe: string;
  image: string;
  cover?: number;
  openUntil: string;
  rating: number;
  reviewCount: number;
};

export type PlaceReview = {
  id: string;
  placeId: string;
  placeType: "nightlife" | "experience";
  author: string;
  rating: number;
  body: string;
  tags: string[];
  createdAt: string;
};

export type CommunityPost = {
  id: string;
  author: string;
  title: string;
  body: string;
  tags: string[];
  replies: number;
  createdAt: string;
  kind: "ask-local" | "tip" | "meetup";
};

export type ForumThread = {
  id: string;
  board: string;
  title: string;
  author: string;
  replies: number;
  views: number;
  pinned?: boolean;
  createdAt: string;
  body: string;
};

export type ForumReply = {
  id: string;
  threadId: string;
  author: string;
  body: string;
  likes: number;
  createdAt: string;
  isLocal?: boolean;
  accepted?: boolean;
};

export type Meetup = {
  id: string;
  title: string;
  host: string;
  city: string;
  area: string;
  when: string;
  spots: number;
  going: number;
  tags: string[];
  description: string;
};

export type TravelerProfile = {
  handle: string;
  name: string;
  avatar: string;
  bio: string;
  city: string;
  followers: number;
  following: number;
  posts: number;
  isLocal?: boolean;
};

export const feedPosts: FeedPost[] = [
  {
    id: "p1",
    author: "mina.seoul",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
    location: "Hongdae, Seoul",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&h=1100&fit=crop",
    caption: "Neon alleys after rain. Hongdae never sleeps.",
    likes: 1284,
    comments: 42,
    tags: ["seoul", "hongdae", "night"],
    createdAt: "2h"
  },
  {
    id: "p2",
    author: "busan.wave",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop",
    location: "Haeundae, Busan",
    image: "https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?w=900&h=1100&fit=crop",
    caption: "Morning surf + coffee. Busan weekend mode.",
    likes: 892,
    comments: 28,
    tags: ["busan", "beach"],
    createdAt: "5h"
  },
  {
    id: "p3",
    author: "jeju.trail",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop",
    location: "Hallasan, Jeju",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&h=1100&fit=crop",
    caption: "Cloud line at Hallasan. Pack layers.",
    likes: 2103,
    comments: 67,
    tags: ["jeju", "hike"],
    createdAt: "1d"
  },
  {
    id: "p4",
    author: "market.finder",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop",
    location: "Gwangjang Market, Seoul",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=900&h=1100&fit=crop",
    caption: "Bindaetteok + makgeolli run. Local favorites only.",
    likes: 1560,
    comments: 51,
    tags: ["food", "market"],
    createdAt: "1d"
  }
];

export const comments: Comment[] = [
  {
    id: "cm1",
    postId: "p1",
    author: "alex.from.berlin",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
    body: "Which alley is this? Heading to Hongdae Friday.",
    likes: 12,
    createdAt: "1h"
  },
  {
    id: "cm2",
    postId: "p1",
    author: "local.yuna",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    body: "Walk from Exit 9 toward playground street — best neon after 10pm.",
    likes: 48,
    createdAt: "45m",
    isLocal: true
  },
  {
    id: "cm3",
    postId: "p2",
    author: "sofia.mx",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
    body: "Surfboard rental tips? First timer.",
    likes: 6,
    createdAt: "3h"
  },
  {
    id: "cm4",
    postId: "p3",
    author: "kenji.osaka",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
    body: "Did you take the cable car or hike up?",
    likes: 9,
    createdAt: "20h"
  },
  {
    id: "cm5",
    postId: "p4",
    author: "mia.uk",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=80&h=80&fit=crop",
    body: "Saving this — is English menu common there?",
    likes: 4,
    createdAt: "18h"
  }
];

export const experiences: Experience[] = [
  {
    id: "e1",
    title: "Nami Island + Petite France Day Trip",
    city: "Gapyeong",
    price: 49,
    currency: "USD",
    duration: "10 hours",
    rating: 4.8,
    reviews: 12400,
    image: "https://images.unsplash.com/photo-1534274867514-d5b47ef89ed7?w=800&h=600&fit=crop",
    category: "Day trip",
    description: "Skip-the-line coach from Seoul with English guide and free time on Nami Island."
  },
  {
    id: "e2",
    title: "Hanbok Rental + Gyeongbokgung Photo Walk",
    city: "Seoul",
    price: 29,
    currency: "USD",
    duration: "3 hours",
    rating: 4.9,
    reviews: 8300,
    image: "https://images.unsplash.com/photo-1548115184-85cac22f4d35?w=800&h=600&fit=crop",
    category: "Culture",
    description: "Pick a hanbok, enter the palace free, and get curated photo spots."
  },
  {
    id: "e3",
    title: "DMZ Half-Day Tour from Seoul",
    city: "Paju",
    price: 65,
    currency: "USD",
    duration: "6 hours",
    rating: 4.7,
    reviews: 15200,
    image: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&h=600&fit=crop",
    category: "History",
    description: "Passport required. Includes Imjingak and Dora Observatory when open."
  },
  {
    id: "e4",
    title: "Busan City Pass: Temples + Beach Spots",
    city: "Busan",
    price: 39,
    currency: "USD",
    duration: "Flexible",
    rating: 4.6,
    reviews: 2100,
    image: "https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?w=800&h=600&fit=crop",
    category: "Pass",
    description: "Digital pass for Haedong Yonggungsa, Gamcheon, and selected cafes."
  },
  {
    id: "e5",
    title: "Jeju Black Pork BBQ + Night Market Walk",
    city: "Jeju",
    price: 55,
    currency: "USD",
    duration: "4 hours",
    rating: 4.8,
    reviews: 980,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop",
    category: "Food",
    description: "Small-group tasting with English host near Dongmun market."
  }
];

export const hotels: Hotel[] = [
  {
    id: "h1",
    name: "Signiel Seoul",
    city: "Seoul",
    area: "Jamsil",
    priceFrom: 420,
    currency: "USD",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=700&fit=crop",
    amenities: ["Pool", "Sky lounge", "Spa", "Airport transfer"],
    description: "Iconic tower stay with Han River views — for a landmark Seoul night."
  },
  {
    id: "h2",
    name: "L7 Hongdae",
    city: "Seoul",
    area: "Hongdae",
    priceFrom: 110,
    currency: "USD",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&h=700&fit=crop",
    amenities: ["Transit", "Nightlife access", "Cafe"],
    description: "Walk to clubs, street food, and late trains — young Seoul basecamp."
  },
  {
    id: "h3",
    name: "Paradise Hotel Busan",
    city: "Busan",
    area: "Haeundae",
    priceFrom: 180,
    currency: "USD",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=700&fit=crop",
    amenities: ["Beach", "Casino", "Spa"],
    description: "Oceanfront classic for beach mornings and neon nights."
  },
  {
    id: "h4",
    name: "Hotel Conti Jeju",
    city: "Jeju",
    area: "Seogwipo",
    priceFrom: 95,
    currency: "USD",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&h=700&fit=crop",
    amenities: ["Breakfast", "Car park", "Near waterfall"],
    description: "South Jeju quiet stay near Jeongbang waterfall and cafes."
  }
];

export const routes: RoutePlan[] = [
  {
    id: "r1",
    title: "Seoul 4 Days: Palaces → Nightlife",
    days: 4,
    cities: ["Seoul"],
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=900&h=700&fit=crop",
    highlights: ["Gyeongbokgung", "Bukchon", "Hongdae", "Han River picnic"],
    summary: "Classic first-timer loop with one late-night district deep dive."
  },
  {
    id: "r2",
    title: "Seoul + Busan Express (5 Days)",
    days: 5,
    cities: ["Seoul", "Busan"],
    image: "https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?w=900&h=700&fit=crop",
    highlights: ["KTX transfer", "Haeundae", "Gamcheon", "Temple by the sea"],
    summary: "City + coast combo with one KTX hop and zero dead time."
  },
  {
    id: "r3",
    title: "Jeju Slow Loop (3 Days)",
    days: 3,
    cities: ["Jeju"],
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900&h=700&fit=crop",
    highlights: ["Hallasan trail", "Udo ferry", "Black pork", "Coast cafe"],
    summary: "Rent a car, chase cliffs, eat well, sleep early."
  }
];

export const nightlife: NightlifeSpot[] = [
  {
    id: "n1",
    name: "Cakeshop",
    type: "club",
    area: "Itaewon",
    city: "Seoul",
    vibe: "Underground house / techno",
    image: "https://images.unsplash.com/photo-1571266028241-d75975a1bcbb?w=800&h=600&fit=crop",
    cover: 20000,
    openUntil: "5:00",
    rating: 4.7,
    reviewCount: 312
  },
  {
    id: "n2",
    name: "Bar Cham",
    type: "bar",
    area: "Seongsu",
    city: "Seoul",
    vibe: "Craft cocktails, calm booths",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop",
    openUntil: "2:00",
    rating: 4.8,
    reviewCount: 188
  },
  {
    id: "n3",
    name: "Soap Seoul",
    type: "club",
    area: "Itaewon",
    city: "Seoul",
    vibe: "Big-room weekends",
    image: "https://images.unsplash.com/photo-1566417713940-ae1153c2c2d4?w=800&h=600&fit=crop",
    cover: 30000,
    openUntil: "6:00",
    rating: 4.5,
    reviewCount: 540
  },
  {
    id: "n4",
    name: "The Booth Hongdae",
    type: "bar",
    area: "Hongdae",
    city: "Seoul",
    vibe: "Craft beer + board games",
    image: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=800&h=600&fit=crop",
    openUntil: "1:00",
    rating: 4.6,
    reviewCount: 97
  },
  {
    id: "n5",
    name: "Gwangalli Rooftop",
    type: "rooftop",
    area: "Gwangalli",
    city: "Busan",
    vibe: "Bridge lights + soju highballs",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop",
    openUntil: "1:30",
    rating: 4.4,
    reviewCount: 76
  }
];

export const placeReviews: PlaceReview[] = [
  {
    id: "pr1",
    placeId: "n1",
    placeType: "nightlife",
    author: "night.owl",
    rating: 5,
    body: "Best sound system in Itaewon. Arrive before 1am or queue forever.",
    tags: ["techno", "queue"],
    createdAt: "2d"
  },
  {
    id: "pr2",
    placeId: "n1",
    placeType: "nightlife",
    author: "sofia.mx",
    rating: 4,
    body: "Friendly door for solo travelers. Cash for cover.",
    tags: ["solo", "cash"],
    createdAt: "5d"
  },
  {
    id: "pr3",
    placeId: "n2",
    placeType: "nightlife",
    author: "alex.from.berlin",
    rating: 5,
    body: "Quiet enough to talk. English menu on request.",
    tags: ["cocktails", "date"],
    createdAt: "1d"
  },
  {
    id: "pr4",
    placeId: "n3",
    placeType: "nightlife",
    author: "kenji.osaka",
    rating: 4,
    body: "Huge floor, tourist-heavy weekends. Fun if you go with a crew.",
    tags: ["weekend", "crew"],
    createdAt: "4d"
  },
  {
    id: "pr5",
    placeId: "e2",
    placeType: "experience",
    author: "mia.uk",
    rating: 5,
    body: "Hanbok staff helped with photos. Palace free entry was real.",
    tags: ["hanbok", "palace"],
    createdAt: "3d"
  }
];

export const communityPosts: CommunityPost[] = [
  {
    id: "c1",
    author: "alex.from.berlin",
    title: "Anyone doing language exchange in Hapjeong this week?",
    body: "Looking for Korean/English 1:1 or small group. Cafe preferred.",
    tags: ["language", "seoul"],
    replies: 14,
    createdAt: "3h",
    kind: "meetup"
  },
  {
    id: "c2",
    author: "sofia.mx",
    title: "Best SIM / eSIM for 10 days?",
    body: "Landing Incheon Friday. Need data + Kakao. What worked for you?",
    tags: ["tips", "arrival"],
    replies: 31,
    createdAt: "8h",
    kind: "ask-local"
  },
  {
    id: "c3",
    author: "kenji.osaka",
    title: "Foreigner-friendly hiking crew for Bukhansan",
    body: "Intermediate pace, Saturday early start. DM if joining.",
    tags: ["hike", "meetup"],
    replies: 9,
    createdAt: "1d",
    kind: "meetup"
  },
  {
    id: "c4",
    author: "local.yuna",
    title: "Ask a local: hidden rainy-day cafes in Seongsu?",
    body: "Locals only — no franchise chains. Laptop-friendly OK.",
    tags: ["ask-local", "seongsu", "cafe"],
    replies: 22,
    createdAt: "6h",
    kind: "ask-local"
  }
];

export const forumThreads: ForumThread[] = [
  {
    id: "f1",
    board: "Housing",
    title: "Short-term stay near Konkuk Uni — safe areas?",
    author: "traveler.nz",
    replies: 22,
    views: 841,
    pinned: true,
    createdAt: "2d",
    body: "Flying in for 3 weeks. Want walkable to subway, quiet at night, under ₩80k/night. Gunja vs Children's Grand Park side?"
  },
  {
    id: "f2",
    board: "Visas",
    title: "Tourist stay extension — what documents did you need?",
    author: "mia.uk",
    replies: 45,
    views: 2103,
    createdAt: "3d",
    body: "First extension at Seoul immigration. Appointment tips + what they actually checked?"
  },
  {
    id: "f3",
    board: "Food",
    title: "Spicy-level survival guide for first timers",
    author: "chef.nomad",
    replies: 67,
    views: 3901,
    createdAt: "5d",
    body: "Map Korean spice words to real heat. Looking for mild-but-local recommendations."
  },
  {
    id: "f4",
    board: "Nightlife",
    title: "Itaewon vs Hongdae on a Friday — where first?",
    author: "night.owl",
    replies: 38,
    views: 1540,
    createdAt: "6d",
    body: "Solo traveler, house/techno lean. Want one solid plan for Friday night."
  }
];

export const forumReplies: ForumReply[] = [
  {
    id: "fr1",
    threadId: "f1",
    author: "local.yuna",
    body: "Children's Grand Park side is quieter. Avoid walk-up goshiwons if you need sleep — check noise reviews.",
    likes: 34,
    createdAt: "1d",
    isLocal: true,
    accepted: true
  },
  {
    id: "fr2",
    threadId: "f1",
    author: "alex.from.berlin",
    body: "Stayed near Konkuk station Exit 3 — late food + Line 2. Felt fine at night.",
    likes: 11,
    createdAt: "1d"
  },
  {
    id: "fr3",
    threadId: "f4",
    author: "night.owl",
    body: "Cakeshop first, then walk to Hook if still awake. Hongdae is louder but more casual bars.",
    likes: 19,
    createdAt: "5d"
  },
  {
    id: "fr4",
    threadId: "f2",
    author: "local.yuna",
    body: "Bring passport, flight out, bank balance print, and hotel booking. Arrive 30 min early.",
    likes: 52,
    createdAt: "2d",
    isLocal: true,
    accepted: true
  }
];

export const meetups: Meetup[] = [
  {
    id: "m1",
    title: "Hongdae street food crawl",
    host: "mina.seoul",
    city: "Seoul",
    area: "Hongdae",
    when: "Fri 7:30 PM",
    spots: 8,
    going: 5,
    tags: ["food", "hongdae"],
    description: "Tteokbokki → bungeoppang → late coffee. English OK. Meet at Exit 9."
  },
  {
    id: "m2",
    title: "Bukhansan beginner hike",
    host: "kenji.osaka",
    city: "Seoul",
    area: "Bukhansan",
    when: "Sat 7:00 AM",
    spots: 6,
    going: 4,
    tags: ["hike", "outdoors"],
    description: "Intermediate pace, 4–5h. Bring water + transit card. Foreigner-friendly."
  },
  {
    id: "m3",
    title: "Seongsu cafe cowork + tips",
    host: "local.yuna",
    city: "Seoul",
    area: "Seongsu",
    when: "Sun 2:00 PM",
    spots: 10,
    going: 3,
    tags: ["ask-local", "cafe"],
    description: "Ask a local anything: SIM, transit, weekend trips. First coffee on you."
  },
  {
    id: "m4",
    title: "Haeundae sunset hangout",
    host: "busan.wave",
    city: "Busan",
    area: "Haeundae",
    when: "Sat 5:30 PM",
    spots: 12,
    going: 7,
    tags: ["busan", "beach"],
    description: "Beach walk + cheap dinner. Couchsurfing-style hangout — no lodging offers."
  }
];

export const profiles: TravelerProfile[] = [
  {
    handle: "mina.seoul",
    name: "Mina",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop",
    bio: "Seoul nights, film grain, neon maps.",
    city: "Seoul",
    followers: 12400,
    following: 320,
    posts: 186,
    isLocal: true
  },
  {
    handle: "busan.wave",
    name: "Jun",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop",
    bio: "Surf mornings. Bridge lights at night.",
    city: "Busan",
    followers: 8300,
    following: 210,
    posts: 94,
    isLocal: true
  },
  {
    handle: "jeju.trail",
    name: "Hana",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop",
    bio: "Hallasan weekends. Pack layers.",
    city: "Jeju",
    followers: 5600,
    following: 180,
    posts: 71,
    isLocal: true
  },
  {
    handle: "market.finder",
    name: "Leo",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop",
    bio: "Markets first. Always hungry.",
    city: "Seoul",
    followers: 4100,
    following: 540,
    posts: 120
  },
  {
    handle: "local.yuna",
    name: "Yuna",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop",
    bio: "Ask-a-local host. Seongsu / Hapjeong.",
    city: "Seoul",
    followers: 9800,
    following: 140,
    posts: 55,
    isLocal: true
  },
  {
    handle: "kenji.osaka",
    name: "Kenji",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop",
    bio: "Osaka → Seoul hiker. Foreigner-friendly trails.",
    city: "Seoul",
    followers: 2200,
    following: 410,
    posts: 28
  },
  {
    handle: "alex.from.berlin",
    name: "Alex",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop",
    bio: "Berlin → Korea for a month. Language exchange + cocktails.",
    city: "Seoul",
    followers: 980,
    following: 260,
    posts: 12
  },
  {
    handle: "sofia.mx",
    name: "Sofia",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop",
    bio: "First-timer tips, SIMs, and solo-friendly nights.",
    city: "Seoul",
    followers: 1540,
    following: 190,
    posts: 19
  },
  {
    handle: "mia.uk",
    name: "Mia",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=120&h=120&fit=crop",
    bio: "UK traveler. Palaces, markets, soft spice only.",
    city: "Seoul",
    followers: 760,
    following: 300,
    posts: 9
  },
  {
    handle: "night.owl",
    name: "Noah",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=120&h=120&fit=crop",
    bio: "Club queues and late trains. Itaewon / Hongdae.",
    city: "Seoul",
    followers: 3100,
    following: 120,
    posts: 44
  },
  {
    handle: "traveler.nz",
    name: "Sam",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120&h=120&fit=crop",
    bio: "NZ backpacker · buses and guesthouses.",
    city: "Busan",
    followers: 430,
    following: 88,
    posts: 6
  },
  {
    handle: "chef.nomad",
    name: "Rina",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=120&h=120&fit=crop",
    bio: "Food crawl maps. Black pork to budae jjigae.",
    city: "Jeju",
    followers: 5200,
    following: 200,
    posts: 63
  }
];

export function getProfile(handle: string) {
  return profiles.find((p) => p.handle === handle);
}

export function getCommentsForPost(postId: string) {
  return comments.filter((c) => c.postId === postId);
}

export function getReviewsForPlace(placeId: string) {
  return placeReviews.filter((r) => r.placeId === placeId);
}

export function getForumReplies(threadId: string) {
  return forumReplies.filter((r) => r.threadId === threadId);
}

export function getPostsByTag(tag: string) {
  const t = tag.toLowerCase();
  return feedPosts.filter((p) => p.tags.some((x) => x.toLowerCase() === t));
}

export function getPostsByLocation(location: string) {
  const q = decodeURIComponent(location).toLowerCase();
  return feedPosts.filter((p) => p.location.toLowerCase().includes(q));
}
