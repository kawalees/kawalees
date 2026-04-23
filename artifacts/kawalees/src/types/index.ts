export interface Artist {
  id: string;
  name: string;
  imageUrl?: string;
  specialty: string;
  featured?: boolean;
  country: string;
  city?: string;
  experience: string;
  education?: string;
  workTypes?: string;
  languages?: string;
  dialects?: string;
  bio?: string;
  works?: string[];
  portfolioLinks?: string[];
}

export interface Project {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  roles: string[];
  status: "open" | "closed";
  featured?: boolean;
  deadline?: string;
  producer?: string;
}
