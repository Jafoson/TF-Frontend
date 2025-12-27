'use client'


import React, { useEffect, useRef, useState } from 'react';
import styles from './FilterChipsWrapper.module.scss';
import FilterChips from '@/components/atoms/Chips/FilterChips/FilterChips';
import { FilterIcon } from '@/assets/icons';
import { useTranslations } from 'next-intl';

interface FilterChipsWrapperProps {
  children: React.ReactNode;
  trailingItem?: React.ReactNode;
  hasDivider?: boolean;
}

export default function FilterChipsWrapper({ 
  children, 
  trailingItem,
  hasDivider = false
}: FilterChipsWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [overflowItems, setOverflowItems] = useState<number[]>([]);
  const [showOverflow, setShowOverflow] = useState(false);
  const [mobil, setMobil] = useState(true);
  const t = useTranslations("filterChipsWrapper");
  
  const recalc = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Alle Kind-Elemente (Items + Button falls vorhanden)
    const children = Array.from(wrapper.querySelectorAll(`.${styles.item}`)) as HTMLElement[];

    const wrapperWidth = wrapper.clientWidth;
    const isMobile = window.innerWidth < 601;
    setMobil(isMobile);
    
    // Bei Mobile: alle Items in overflow verschieben
    if (isMobile) {
      const allIndices = Array.from({ length: children.length }, (_, i) => i);
      setVisibleItems([]);
      setOverflowItems(allIndices);
      return;
    }

    let total = 0;
    const fit: number[] = [];
    const overflow: number[] = [];

    for (let i = 0; i < children.length; i++) {
      const w = children[i].offsetWidth;
      // Platz für einen Button + Padding (60px Reserve)
      if (total + w + 110 <= wrapperWidth) {
        total += w + 8; // 8px Gap
        fit.push(i);
      } else {
        overflow.push(i);
      }
    }
    setVisibleItems(fit);
    setOverflowItems(overflow);
  };

  useEffect(() => {
    // Nach Mount alle Breiten messen
    recalc();
    const resizeObs = new ResizeObserver(() => recalc());
    if (wrapperRef.current) resizeObs.observe(wrapperRef.current);
    
    // Auch auf Fenstergrößenänderungen reagieren
    const handleResize = () => recalc();
    window.addEventListener('resize', handleResize);
    
    return () => {
      resizeObs.disconnect();
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper} data-has-divider={hasDivider}>
      <div className={styles.contenWrapper}>
      <div className={styles.content} ref={wrapperRef}>
        {/* Alle Items werden gerendert, aber nur visibleItems sind wirklich sichtbar */}
        {React.Children.toArray(children).map((item, idx) => (
          <div
            key={(item as React.ReactElement)?.key ?? idx}
            className={`${styles.item} ${
              visibleItems.includes(idx)
                ? styles.visible
                : styles.hidden
            }`}
          >
            {item}
          </div>
        ))}

        {overflowItems.length > 0 && (
          <FilterChips
            label={mobil ? t("filters") : t("moreFilters")}
            onClick={() => setShowOverflow((prev) => !prev)}
            hasTrailingIcon
            variant="elevated"
            icon={mobil ? FilterIcon : undefined}
          />
        )}
      </div>
      {trailingItem && (
          <div className={styles.trailingItem}>
            {trailingItem}
          </div>
        )}
      </div>

      {overflowItems.length > 0 && (
        <div className={`${styles.overflowRow} ${showOverflow ? styles.visible : ''}`}>
          {overflowItems.map((idx) => {
            const item = React.Children.toArray(children)[idx];
            return (
              <div key={idx} className={styles.item}>
                {item}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
