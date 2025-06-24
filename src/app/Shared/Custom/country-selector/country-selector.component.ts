import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { animate, style, transition, trigger } from '@angular/animations';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface Countries {
  id: number;
  created_at: string;
  modified_at: string;
  name: string;
  code: number;
  currency: string;
  logo: string;
  timezone: string;
  active: boolean;
}

@Component({
  selector: 'app-country-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './country-selector.component.html',
  styleUrls: ['./country-selector.component.css'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-in-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({ opacity: 0, transform: 'translateY(-10px)' })),
      ]),
    ]),
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountrySelectorComponent),
      multi: true
    }
  ]
})
export class CountrySelectorComponent implements ControlValueAccessor, OnChanges {
  @Input() countries: Countries[] = [];
  @Input() placeholder = 'Select your country';
  @Input() label = 'Country';
  @Input() required = false;
  @Input() error = '';
  @Input() disabled = false;

  @Output() countrySelected = new EventEmitter<Countries>();

  isOpen = false;
  searchTerm = '';
  selectedCountry: Countries | null = null;
  filteredCountries: Countries[] = [];
  highlightedIndex = -1;

  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['countries'] && this.countries) {
      this.filteredCountries = this.countries.filter(country => country.active);
      if (this.selectedCountry) {
        this.selectedCountry = this.countries.find(country => country.id === this.selectedCountry?.id) || null;
      }
    }
  }

  writeValue(value: any): void {
    if (value) {
      this.selectedCountry = this.countries.find(country => country.id === value) || null;
    } else {
      this.selectedCountry = null;
    }
    this.onChange(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDropdown() {
    if (this.disabled) return;

    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchTerm = '';
      this.filteredCountries = this.countries.filter(country => country.active);
      this.highlightedIndex = -1;
      setTimeout(() => {
        const searchInput = document.getElementById('country-search');
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
    this.onTouched();
  }

  selectCountry(country: Countries) {
    this.selectedCountry = country;
    this.isOpen = false;
    this.searchTerm = '';
    this.onChange(country.id);
    this.countrySelected.emit(country);
    this.onTouched();
  }

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.filterCountries();
    this.highlightedIndex = -1;
  }

  filterCountries() {
    if (!this.searchTerm.trim()) {
      this.filteredCountries = this.countries.filter(country => country.active);
    } else {
      this.filteredCountries = this.countries.filter(
        country =>
          country.active &&
          (country.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            country.code.toString().includes(this.searchTerm))
      );
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (!this.isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        this.toggleDropdown();
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.isOpen = false;
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex = Math.min(this.highlightedIndex + 1, this.filteredCountries.length - 1);
        this.scrollToHighlighted();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex = Math.max(this.highlightedIndex - 1, -1);
        this.scrollToHighlighted();
        break;
      case 'Enter':
        event.preventDefault();
        if (this.highlightedIndex >= 0 && this.filteredCountries[this.highlightedIndex]) {
          this.selectCountry(this.filteredCountries[this.highlightedIndex]);
        }
        break;
    }
  }

  scrollToHighlighted() {
    setTimeout(() => {
      const highlighted = document.querySelector('.country-option.highlighted');
      if (highlighted) {
        highlighted.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.country-selector');
    if (dropdown && !dropdown.contains(target)) {
      this.isOpen = false;
    }
  }

  getDisplayText(): string {
    return this.selectedCountry ? this.selectedCountry.name : this.placeholder;
  }

  hasError(): boolean {
    return !!this.error;
  }

  handleImageError(event: Event) {
    const target = event.target as HTMLElement;
    target.style.display = 'none';
  }
}
