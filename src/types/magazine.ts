// Magazine layout types

export type LayoutType = 
  | 'full-image'           // Full page background image with overlay text
  | 'image-left'           // Image on left, text on right
  | 'image-right'          // Image on right, text on left
  | 'two-columns'          // Two equal columns with images
  | 'header-image'         // Large header image with text below
  | 'text-only'            // Full text page with elegant typography
  | 'gallery-grid';        // Grid of multiple images

export type ImageFit = 'cover' | 'contain';

export interface MagazineImage {
  id: string;
  url: string;
  position: 'main' | 'secondary' | 'background' | 'grid-1' | 'grid-2' | 'grid-3' | 'grid-4';
  fit: ImageFit;
  caption?: string;
}

export interface MagazinePage {
  id: string;
  pageNumber: number;
  layoutType: LayoutType;
  text: string;
  images: MagazineImage[];
  backgroundColor?: string;
  textColor?: string;
}

export interface MagazineConfig {
  pages: MagazinePage[];
  coverTitle?: string;
  coverSubtitle?: string;
}

export const LAYOUT_TEMPLATES: Record<LayoutType, { 
  name: string; 
  description: string;
  icon: string;
  imagePositions: MagazineImage['position'][];
}> = {
  'full-image': {
    name: 'Imagem de Fundo',
    description: 'Imagem em tela cheia com texto sobreposto',
    icon: '🖼️',
    imagePositions: ['background']
  },
  'image-left': {
    name: 'Imagem à Esquerda',
    description: 'Imagem na esquerda, texto na direita',
    icon: '◧',
    imagePositions: ['main']
  },
  'image-right': {
    name: 'Imagem à Direita',
    description: 'Texto na esquerda, imagem na direita',
    icon: '◨',
    imagePositions: ['main']
  },
  'two-columns': {
    name: 'Duas Colunas',
    description: 'Duas imagens lado a lado com legendas',
    icon: '▥',
    imagePositions: ['main', 'secondary']
  },
  'header-image': {
    name: 'Imagem de Cabeçalho',
    description: 'Grande imagem no topo, texto abaixo',
    icon: '▤',
    imagePositions: ['main']
  },
  'text-only': {
    name: 'Apenas Texto',
    description: 'Página de texto com tipografia elegante',
    icon: '📝',
    imagePositions: []
  },
  'gallery-grid': {
    name: 'Galeria',
    description: 'Grade de 4 imagens',
    icon: '⊞',
    imagePositions: ['grid-1', 'grid-2', 'grid-3', 'grid-4']
  }
};

export function createEmptyPage(pageNumber: number): MagazinePage {
  return {
    id: crypto.randomUUID(),
    pageNumber,
    layoutType: 'text-only',
    text: '',
    images: [],
    backgroundColor: undefined,
    textColor: undefined
  };
}

export function createEmptyImage(position: MagazineImage['position']): MagazineImage {
  return {
    id: crypto.randomUUID(),
    url: '',
    position,
    fit: 'cover'
  };
}
