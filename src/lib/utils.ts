// Utility function for merging class names
// clsx and tailwind-merge will be installed as dependencies
// This is a placeholder that concatenates class names

type ClassValue = string | undefined | null | boolean | Record<string, boolean>

export function cn(...inputs: (ClassValue | ClassValue[])[]): string {
  return inputs
    .flat()
    .filter((cls) => typeof cls === 'string' && cls.length > 0)
    .join(' ')
}