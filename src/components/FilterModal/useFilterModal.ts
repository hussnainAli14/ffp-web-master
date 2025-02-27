import { useCallback, useEffect, useRef, useState } from 'react';

import { Props, UseFilterModal } from './FilterModal.types';

const useFilterModal = <T,>(props: Props<T>): UseFilterModal<T> => {
  const {
    selectedItems: initialSelectedItems,
    items,
    onSave,
    onBack,
    defaultValue,
  } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<T[]>(initialSelectedItems);
  const [limit, setLimit] = useState<number>(100);

  const states = {
    search,
    setSearch,
    selectedItems,
    setSelectedItems,
  };

  const filteredItems = items.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  ).slice(0, limit);

  const handleSearch = (key: string) => {
    setSearch(key);
    setLimit(100);
  };

  const toggleItem = (value: T) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((item) => item !== value)
        : [...prevSelected, value]
    );
  };

  const selectItem = (value?: T) => {
    if (value) {
      setSelectedItems([value]);
    } else if (defaultValue) {
      setSelectedItems([defaultValue.value]);
    } else {
      setSelectedItems([]);
    }
  };

  const selectAll = () => {
    setSelectedItems(items
      .filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
      .map((item) => item.value));
  };

  const clearAll = () => {
    if (defaultValue) {
      setSelectedItems([defaultValue.value]);
    } else {
      setSelectedItems([]);
    }
  };

  const handleSave = () => {
    onSave(selectedItems);
  };

  const handleBack = () => {
    onBack();
  };

  const _handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight) {
      setLimit((prevLimit) => Math.min(prevLimit + 100, items.length));
    }
  }, [items.length]);

  useEffect(() => {
    const scrollableElement = scrollRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', _handleScroll);
      return () => {
        scrollableElement.removeEventListener('scroll', _handleScroll);
      };
    }
  }, [_handleScroll]);

  return {
    ...states,
    filteredItems,
    handleSearch,
    toggleItem,
    selectItem,
    selectAll,
    clearAll,
    handleSave,
    handleBack,
    scrollRef,
  };
};

export default useFilterModal;