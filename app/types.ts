export interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  release_date: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string }[];
  followers: { total: number };
  genres: string[];
  popularity: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
