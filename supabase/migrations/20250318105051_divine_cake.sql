/*
  # Add Optimized Indexes for Contact Queries

  1. Changes
    - Add composite index for company_id + id for efficient cursor pagination
    - Add composite index for company_id + created_at for time-based queries
    - Add composite index for company_id + last_name for name-based sorting
  
  2. Purpose
    - Optimize cursor-based pagination performance
    - Improve sorting and filtering operations
    - Support efficient count operations
*/

-- Add composite indexes for efficient pagination and filtering
CREATE INDEX IF NOT EXISTS idx_contacts_company_cursor ON contacts(company_id, id);
CREATE INDEX IF NOT EXISTS idx_contacts_company_created ON contacts(company_id, created_at);
CREATE INDEX IF NOT EXISTS idx_contacts_company_name ON contacts(company_id, last_name, first_name);