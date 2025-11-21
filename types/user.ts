export enum UserRole {
  CEO = 7,
  PHARMA_MANAGER = 6,
  PROCUREMENT_MANAGER = 5,
  TECHNICAL_MANAGER = 4,
  SITE_MANAGER = 3,
  SITE_PHARMA_MANAGER = 2,
  TECHNICAL_FRIDGE_MANAGER = 1,
}

export const UserRoleNames: Record<UserRole, string> = {
  [UserRole.CEO]: "CEO",
  [UserRole.PHARMA_MANAGER]: "Pharma Manager",
  [UserRole.PROCUREMENT_MANAGER]: "Procurement Manager",
  [UserRole.TECHNICAL_MANAGER]: "Technical Manager",
  [UserRole.SITE_MANAGER]: "Site Manager",
  [UserRole.SITE_PHARMA_MANAGER]: "Site Pharma Manager",
  [UserRole.TECHNICAL_FRIDGE_MANAGER]: "Technical Fridge Manager",
};

export const getRoleName = (roleId: number): string => {
  return UserRoleNames[roleId as UserRole] || "Unknown";
};

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_role: UserRole;
}

export interface UserResponse {
  success: boolean;
  user?: User;
  error?: string;
}
