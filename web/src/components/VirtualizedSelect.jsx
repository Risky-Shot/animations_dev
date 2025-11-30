import {
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  SelectLabel,
  SelectContent,
  SelectItem,
  SelectPositioner,
  Portal,
  useSelectContext,
} from "@chakra-ui/react";

import { Virtuoso } from "react-virtuoso";

import {memo, useCallback} from 'react';

const VirtualizedOptionList = memo(function VirtualizedOptionList({ items, value, disabled = false }) {
  const select = useSelectContext();

  const ITEM_HEIGHT = 36; // adjust if your option height differs
  const MAX_HEIGHT = 300;
  const computedHeight = items && items.length > 0
    ? Math.min(items.length * ITEM_HEIGHT, MAX_HEIGHT)
    : ITEM_HEIGHT; // fallback minimum height

  return (
    <Virtuoso
      style={{ height: computedHeight, maxHeight: MAX_HEIGHT }}
      totalCount={items.length}
      itemContent={(index) => {
        const item = items[index];
        const isSelected = value === item;

        return (
          <SelectItem
            key={item}
            item={item}
            onClick={() => {
              select.setValue([item]);   // update selected
              select.setOpen(false);     // close dropdown
            }}
            style={{
              backgroundColor: isSelected ? 'rgba(255, 99, 71, 0.50)' : undefined,
              padding: '8px 12px',
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          >
            {item}
          </SelectItem>
        );
      }}
    />
  );
}, (a, b) => a.items === b.items && a.value === b.value && a.disabled === b.disabled);

function VirtualizedSelect({
  items = [],
  value,
  onChange,
  placeholder = "Select animation",
  width = '100%',
  disabled = false
}) {
  // wrap onValueChange to avoid passing inline function reference into memo comparator
  const handleValueChange = useCallback((e) => {
    if (!disabled && typeof onChange === 'function') {
      onChange(e.value[0]);
    }
  }, [onChange, disabled]);

  return (
    <SelectRoot
      w={width}
      value={value ? [value] : []}
      onValueChange={handleValueChange}
      disabled={disabled}
      colorPalette='red'
    >
      <SelectLabel color='white'>Found : {items.length}</SelectLabel>
      <SelectTrigger 
        aria-disabled={disabled}
        style={disabled ? { pointerEvents: 'none', opacity: 0.6 } : undefined}
      >
        <SelectValueText color={"white"} placeholder={placeholder} disabled={disabled}>
          {value ? value : ""}
        </SelectValueText>
      </SelectTrigger>

      <Portal>
        <SelectPositioner>
          <SelectContent p={0}>
            <VirtualizedOptionList items={items} value={value} disabled={disabled} />
          </SelectContent>
        </SelectPositioner>
      </Portal>

    </SelectRoot>
  );
}

// custom comparator: ignore onChange identity and only re-render when relevant props change
function areEqual(prev, next) {
  return prev.items === next.items
    && prev.value === next.value
    && prev.disabled === next.disabled
    && prev.width === next.width
    && prev.placeholder === next.placeholder;
}

export default memo(VirtualizedSelect, areEqual);