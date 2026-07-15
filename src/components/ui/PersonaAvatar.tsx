import Image from "next/image";
import { profile } from "@/data/profile";

const sizeClasses = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
  fab: "h-[3.75rem] w-[3.75rem]",
  hero: "h-40 w-40 md:h-48 md:w-48",
} as const;

export function PersonaAvatar({
  size = "md",
  className = "",
  priority = false,
}: {
  size?: keyof typeof sizeClasses;
  className?: string;
  priority?: boolean;
}) {
  const px =
    size === "hero" ? 192 : size === "fab" ? 60 : size === "md" ? 40 : 36;

  return (
    <Image
      src={profile.personaAvatar}
      alt={`${profile.shortName} avatar`}
      width={px}
      height={px}
      priority={priority}
      className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
    />
  );
}
