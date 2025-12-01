import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function cleanText(text: string): string {
    if (!text) return "";
    return text
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold **text**
        .replace(/\*(.*?)\*/g, "$1")     // Remove italic *text*
        .replace(/__(.*?)__/g, "$1")     // Remove bold __text__
        .replace(/_(.*?)_/g, "$1")       // Remove italic _text_
        .replace(/```json/g, "")         // Remove json code block marker
        .replace(/```/g, "")             // Remove code block markers
        .replace(/`/g, "")               // Remove inline code markers
        .trim();
}
