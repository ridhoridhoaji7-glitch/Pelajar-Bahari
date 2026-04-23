export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'news' | 'announcement' | 'agenda';
  authorId?: string;
  createdAt?: any;
  attachmentUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
}

export interface Member {
  id: string;
  name: string;
  nia?: string;
  address: string;
  phone: string;
  joinDate: string;
  position: string;
  organization: 'IPNU' | 'IPPNU';
  level: 'PC' | 'PAC' | 'PR';
  imageUrl?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  whatsapp?: string;
  instagram?: string;
}

export interface OrgContent {
  id: string;
  text: string;
  updatedAt?: any;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
}
