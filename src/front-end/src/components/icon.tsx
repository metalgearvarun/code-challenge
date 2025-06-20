// Icon.tsx
import React from "react";
import * as Icons from "phosphor-react";
import { IconProps as PhosphorIconProps } from "phosphor-react";

type IconName = keyof typeof Icons;

export interface IconProps extends Omit<PhosphorIconProps, "size"> {
  name: IconName;
  size?: number | string;
}

export const Icon = ({
  name,
  size = 24,
  color = "currentColor",
  weight = "regular",
  ...rest
}: IconProps) => {
  const PhosphorIcon = Icons[name] as React.ElementType;

  if (!PhosphorIcon) {
    console.warn(`Icon "${name.toString}" does not exist in phosphor-react`);
    return null;
  }

  return <PhosphorIcon size={size} color={color} weight={weight} {...rest} />;
};
