import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function tryCatch<T>(
  x: () => Promise<T>
): Promise<[any, T | undefined]> {
  try {
    const data = await x();
    return [undefined, data];
  } catch (error) {
    return [error, undefined];
  }
}
