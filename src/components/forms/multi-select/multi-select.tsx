import { useEffect, useMemo, useRef, useState } from "react";
import "./multi-select.css";
import { SearchIcon } from "@/components/common/icons";
import Checkbox from "../checkbox";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  placeholder?: string;
  selectedValues: string[];
  setSelectedValues: (selectedValues: string[]) => void;
}

const MultiSelect = ({
  placeholder,
  options,
  selectedValues,
  setSelectedValues,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const highlightedRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(
    () =>
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [options, searchTerm]
  );

  useEffect(() => {
    if (highlightedRef.current && optionsRef.current) {
      const optionsContainer = optionsRef.current;
      const highlightedElement = highlightedRef.current;

      const containerRect = optionsContainer.getBoundingClientRect();
      const elementRect = highlightedElement.getBoundingClientRect();

      if (elementRect.bottom > containerRect.bottom) {
        // Scroll down if below visible area
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      } else if (elementRect.top < containerRect.top) {
        // Scroll up if above visible area
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && event.key !== "Escape") {
      setIsOpen(true);
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;

      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;

      case "Enter":
        event.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;

      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;

      default:
        break;
    }
  };

  const handleSelect = (option: Option) => {
    if (!selectedValues.some((value) => value === option.value)) {
      // Check if item is not already selected
      setSelectedValues([...selectedValues, option.value]);
    } else {
      // Unselect, if already selected
      setSelectedValues(
        selectedValues.filter((value) => value !== option.value)
      );
    }
    setSearchTerm("");
  };

  return (
    <div className="form-multi-select" ref={wrapperRef}>
      <div
        className="form-multi-select-content"
        onClick={() => inputRef.current?.focus()}
      >
        <SearchIcon className="form-multi-select-search-icon" />
        {/* {searchTerm ? (
          <span className="form-multi-select-search-text">{searchTerm}</span>
        ) : placeholder ? (
          <span className="form-multi-select-placeholder">{placeholder}</span>
        ) : null} */}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Search..."}
          onClick={() => setIsOpen(true)}
        />
      </div>
      <div className="form-multi-select-backdrop"></div>

      {isOpen && (
        <div className="options-list" ref={optionsRef}>
          {filteredOptions.map((option, index) => (
            <div
              key={option.value}
              ref={highlightedIndex === index ? highlightedRef : null}
              className={`option ${
                highlightedIndex === index ? "highlighted" : ""
              }`}
              onClick={() => {
                handleSelect(option);
                inputRef.current?.focus();
              }}
            >
              <Checkbox
                checked={selectedValues.includes(option.value)}
                label={option.label}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
