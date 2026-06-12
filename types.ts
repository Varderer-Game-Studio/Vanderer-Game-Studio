export interface Game {
  id: string; title: string; logline: string; description: string;
  imageUrl: string; gallery: string[]; trailerUrl?: string;
  genres: string[]; status: 'In Development' | 'Released' | 'Prototype';
  accent: string; award?: string;
  steamUrl?: string; itchUrl?: string;
}
export interface TeamMember {
  id: string; name: string; role: string; clazz: string; classDescription: string;
  avatarUrl: string; specialties: string[]; tools: string[];
  bio: string; accent: string; portfolioUrl?: string;
}
