export const places = [
  {
    id: "the-stud",
    name: "The Stud",
    city: "San Francisco, CA",
    lat: 37.7599,
    lng: -122.4148,
    status: "erased",
    years: "1966–2019",
    reason: "Rising rents and redevelopment pressures",
    communities: ["Queer", "Drag", "Leather"],
    story:
      "The Stud was one of San Francisco's oldest continuously operating gay bars. It served as a cultural anchor for drag performers, leather communities, and queer nightlife for over five decades before closing due to displacement pressures.",
    quote:
      "When spaces like this disappear, we lose more than buildings — we lose memory.",
  },
  {
    id: "stonewall-inn",
    name: "Stonewall Inn",
    city: "New York, NY",
    lat: 40.734,
    lng: -74.002,
    status: "active",
    years: "1967–present",
    reason: "N/A — still operating",
    communities: ["Queer", "Trans", "LGBTQ+"],
    story:
      "The Stonewall Inn was the site of the 1969 uprising that sparked the modern LGBTQ+ rights movement. It continues to operate as a bar and National Monument, serving as a living memorial and gathering place.",
    quote: "The first time we ever had a place to be ourselves.",
  },
  {
    id: "palace-disco",
    name: "Palace Disco",
    city: "San Francisco, CA",
    lat: 37.7845,
    lng: -122.4092,
    status: "erased",
    years: "1970s–1984",
    reason: "Redevelopment and displacement in SoMa",
    communities: ["Black queer", "Disco", "Ballroom"],
    story:
      "Palace Disco was a vital space for Black queer and trans communities in San Francisco's SoMa district. It hosted early ballroom and disco culture before redevelopment erased the neighborhood's queer nightlife.",
    quote: "That was where we could be free — no one judged you on the floor.",
  },
  {
    id: "el-rio",
    name: "El Rio",
    city: "San Francisco, CA",
    lat: 37.7488,
    lng: -122.4094,
    status: "threatened",
    years: "1978–present",
    reason: "Mission District gentrification and rising costs",
    communities: ["Latino/a queer", "Mission", "POC"],
    story:
      "El Rio has been a cornerstone of San Francisco's Mission District and Latinx queer community for decades. It faces ongoing pressure from rising rents and changing demographics.",
    quote: "El Rio isn't just a bar — it's where our community holds space.",
  },
  {
    id: "club-bath",
    name: "Club Baths (Everard Baths)",
    city: "New York, NY",
    lat: 40.738,
    lng: -73.991,
    status: "erased",
    years: "1888–1985",
    reason: "Fire (1985); prior police raids and stigma",
    communities: ["Gay men", "Leather", "Cruising"],
    story:
      "The Everard Baths were one of the oldest and most significant gay bathhouses in the US. They provided refuge and community for gay men through decades of criminalization. A tragic fire in 1985 closed them; the building was later demolished.",
    quote: "It was one of the few places we could exist without hiding.",
  },
  {
    id: "aunt-charlies",
    name: "Aunt Charlie's Lounge",
    city: "San Francisco, CA",
    lat: 37.7862,
    lng: -122.4122,
    status: "threatened",
    years: "1987–present",
    reason: "Tenderloin redevelopment and rent increases",
    communities: ["Trans", "Drag", "Older queer"],
    story:
      "Aunt Charlie's is one of the last remaining queer bars in the Tenderloin and a historic haven for trans women and drag performers. It has survived decades of change but remains under threat from development.",
    quote: "Aunt Charlie's is family when your blood family isn't.",
  },
  {
    id: "sisterspace",
    name: "SisterSpace (Women's Building)",
    city: "San Francisco, CA",
    lat: 37.7592,
    lng: -122.4212,
    status: "active",
    years: "1979–present",
    reason: "N/A — still operating",
    communities: ["Lesbian", "Women", "Feminist"],
    story:
      "The Women's Building has housed SisterSpace and countless lesbian and feminist organizations. It remains a hub for activism, art, and community for women and nonbinary people.",
    quote: "This building holds our history and our future.",
  },
  {
    id: "sylvias-lounge",
    name: "Sylvia's Lounge",
    city: "Chicago, IL",
    lat: 41.8319,
    lng: -87.6272,
    status: "erased",
    years: "1962–2012",
    reason: "Building sale and South Side disinvestment",
    communities: ["Black LGBTQ+", "South Side", "Ballroom"],
    story:
      "Sylvia's was a legendary Black LGBTQ+ bar on Chicago's South Side and a key site for ballroom and house culture. Its closure marked the loss of a rare safe space for Black queer Chicagoans.",
    quote: "Sylvia's was home. When it closed, we lost a piece of the map.",
  },
];

/** Alias for places (used by Map.jsx). */
export const PLACES = places;

/** Default map center (continental US). */
export const MAP_CENTER = { lat: 39, lng: -98 };

/** Default zoom level. */
export const MAP_ZOOM = 4;

/**
 * @param {string} id
 * @returns {typeof places[number] | undefined}
 */
export function getPlaceById(id) {
  return places.find((p) => p.id === id);
}
