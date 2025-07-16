// Function to generate a consistent anonymous ID based on user ID
export const generateAnonymousId = (userId: string): string => {
  // Create a simple hash of the user ID to generate a consistent anonymous ID
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Generate a 6-character anonymous ID
  const anonymousId = Math.abs(hash).toString(36).substring(0, 6).toUpperCase();
  return `User${anonymousId}`;
} 