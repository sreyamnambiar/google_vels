// Test location query detection
const queries = [
  "hospitals near vel tech avadi college",
  "find restaurants near me", 
  "near vel tech avadi college",
  "hospitals near chennai",
  "show me shops nearby"
];

const locationPattern = /\b(near|nearby|directions to|find .* near|hospitals? near|restaurants? near|shops? near|pharmacies? near|.* near .*)\b/i;

queries.forEach(query => {
  const isLocation = locationPattern.test(query);
  console.log(`"${query}" -> Location query: ${isLocation}`);
});

// Test search term extraction
function extractSearchTerms(message) {
  const patterns = [
    /find (.*?) near/i,
    /show me (.*?) near/i,
    /where are (.*?) near/i,
    /(.*?) near (.*)/i,
    /(hospitals?|restaurants?|shops?|pharmacies?|banks?|atms?|gas stations?|grocery stores?|cafes?|libraries?|parks?) near/i,
    /(accessible|wheelchair) (.*?) near/i
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      if (pattern.source.includes('(.*?) near (.*)')) {
        return `${match[1]} near ${match[2]}`;
      }
      return match[1] || match[0];
    }
  }

  const fallbackPattern = /(hospitals?|restaurants?|shops?|pharmacies?|banks?|atms?|gas stations?|grocery stores?|cafes?|libraries?|parks?|accessible places)/i;
  const fallbackMatch = message.match(fallbackPattern);
  
  return fallbackMatch ? fallbackMatch[0] + " near me" : 'accessible places near me';
}

console.log('\nSearch term extraction:');
queries.forEach(query => {
  const terms = extractSearchTerms(query);
  console.log(`"${query}" -> "${terms}"`);
});