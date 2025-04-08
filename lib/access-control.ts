'use client';

// Role-based access control utilities

export type UserRole = 'admin' | 'auditor' | 'analyst' | 'executive';

// Define permissions for each role
export const rolePermissions = {
  admin: {
    canManageUsers: true,
    canEditFinancials: false,
    canRunStressTests: false,
    canViewReports: true,
    canEditGreenFields: false,
    description: 'Can manage users (add, edit, archive)'
  },
  auditor: {
    canManageUsers: false,
    canEditFinancials: true,
    canRunStressTests: false,
    canViewReports: true,
    canEditGreenFields: true, // Auditors can edit the green parts of the xcell sheet
    description: 'Can edit financial data (green fields only)'
  },
  analyst: {
    canManageUsers: false,
    canEditFinancials: false,
    canRunStressTests: true,
    canViewReports: true,
    canEditGreenFields: false,
    description: 'Can run stress tests and modify test parameters'
  },
  executive: {
    canManageUsers: false,
    canEditFinancials: false,
    canRunStressTests: false,
    canViewReports: true,
    canEditGreenFields: false,
    description: 'Can view reports and financial data'
  }
};

// Check if a user has a specific permission
export const hasPermission = (role: UserRole, permission: keyof typeof rolePermissions.admin): boolean => {
  if (!role || !rolePermissions[role]) return false;
  return Boolean(rolePermissions[role][permission]);
};

// Get editable fields for a role (for financial data)
export const getEditableFields = (role: UserRole): { balance: string[], income: string[] } => {
  // Default: no editable fields
  const noFields = { balance: [], income: [] };
  
  // Admin can't edit financials
  if (role === 'admin') return noFields;
  
  // Analyst can't edit financials directly
  if (role === 'analyst') return noFields;
  
  // Executive can only view reports
  if (role === 'executive') return noFields;
  
  // Auditor can edit specific fields (the "green parts")
  if (role === 'auditor') {
    return {
      balance: [
        'cash',
        'accountReceivable',
        'inventory',
        'longTermProperty',
        'longTermAsset'
      ],
      income: [
        'revenue',
        'contractingCost',
        'overhead',
        'salary',
        'rent'
      ]
    };
  }
  
  return noFields;
};

// Check if a specific field is editable by a role
export const isFieldEditable = (role: UserRole, section: 'balance' | 'income', field: string): boolean => {
  const editableFields = getEditableFields(role);
  return editableFields[section].includes(field);
};

// Get CSS class for editable fields
export const getFieldClass = (role: UserRole, section: 'balance' | 'income', field: string): string => {
  return isFieldEditable(role, section, field) 
    ? 'bg-green-100 border-green-300' // Green background for editable fields
    : 'bg-gray-100 border-gray-300';  // Gray background for non-editable fields
};
