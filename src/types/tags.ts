export interface Tag {
  id: string;
  company_id: string;
  name: string;
  color: string;
  icon: string;
  category: 'contact' | 'booking';
  sort_order: number;
  created_at: string;
  created_by: string | null;
  modified_at: string;
  modified_by: string | null;
  contact_count: number;
}

export interface UpdateTagData {
  name?: string;
  color?: string;
  icon?: string;
}

export interface TagRelationship {
  id: string;
  tag_id: string;
  created_at: string;
  created_by: string | null;
}

export interface ContactTag extends TagRelationship {
  contact_id: string;
}

export interface BookingTag extends TagRelationship {
  booking_id: string;
}

export interface CreateTagData {
  name: string;
  color: string;
  icon: string;
  category: 'contact' | 'booking';
  sort_order?: number;
}
