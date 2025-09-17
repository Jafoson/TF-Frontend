"use client";

import React from "react";
import styles from "./FilterChips.module.scss";
import { ArrowTopIcon, TriangleRightIcon } from "@/assets/icons";
import Image from "next/image";
import { SortDirectionEnum } from "@/enum/sortDirectionEnum";

type FilterChipsProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  sortDirection?: SortDirectionEnum;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  iconSize?: number;
  iconColor?: string;
  image?: string;
  imageSize?: number;
  variant?: "elevated" | "outlined";
  hasTrailingIcon?: boolean;
  isSelected?: boolean;
  selectedLabel?: string;
  selectedImg?: string;
  selectedIcon?: React.FC<React.SVGProps<SVGSVGElement>>;
  value?: string | number;
  onClick?: (value: string | number) => void;
};

function FilterChips({
  sortDirection,
  label,
  icon: Icon,
  iconSize = 16,
  iconColor,
  image,
  imageSize = 16,
  variant = "elevated",
  hasTrailingIcon = false,
  isSelected = false,
  selectedLabel,
  selectedImg,
  selectedIcon: SelectedIcon,
  value,
  onClick,
  ...props
}: FilterChipsProps) {
  return (
    <button
      className={`${styles.filterChips} ${styles[variant]}`}
      data-has-left-data={!!Icon || !!image || !!sortDirection}
      data-trailing-icon={hasTrailingIcon}
      data-selected={isSelected}
      type="button"
      onClick={onClick}
      value={value}
      {...props}
    >
      {sortDirection && (
        sortDirection === SortDirectionEnum.ASC ? (<ArrowTopIcon
        height={iconSize}
        width={iconSize}
        color={iconColor || "inherit"}
        className={styles.trailingIconAsc}
        />) : (<ArrowTopIcon
        height={iconSize}
        width={iconSize}
        color={iconColor || "inherit"}
        className={styles.trailingIconDesc}
        />)
      )}
      {Icon && !isSelected ? (
        <Icon
          height={iconSize}
          width={iconSize}
          color={iconColor || "inherit"}
        />
      ) : SelectedIcon && isSelected ? (
        <SelectedIcon
          height={iconSize}
          width={iconSize}
          color={iconColor || "inherit"}
        />
      ) : (
        Icon &&
        isSelected && (
          <Icon
            height={iconSize}
            width={iconSize}
            color={iconColor || "inherit"}
          />
        )
      )}
      {image && !isSelected ? (
        <Image
          src={image}
          alt={label}
          className={styles.image}
          width={imageSize}
          height={imageSize}
        />
      ) : selectedImg && isSelected ? (
        <Image
          src={selectedImg}
          alt={selectedLabel || label}
          className={styles.image}
          width={imageSize}
          height={imageSize}
        />
      ) : (
        image &&
        isSelected && (
          <Image
            src={image}
            alt={label}
            className={styles.image}
            width={imageSize}
            height={imageSize}
          />
        )
      )}
      <span className={styles.label}>
        {selectedLabel && isSelected ? selectedLabel : label}
      </span>
      
      {hasTrailingIcon && (
        <TriangleRightIcon
          height={iconSize}
          width={iconSize}
          color={iconColor || "inherit"}
          className={styles.trailingIcon}
        />
      )}
    </button>
  );
}

export default FilterChips;
