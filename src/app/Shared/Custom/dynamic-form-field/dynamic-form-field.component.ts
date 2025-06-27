import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DynamicField } from '../../../B2B/kyc-info/kyc-info.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-form-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './dynamic-form-field.component.html',
  styleUrls: ['./dynamic-form-field.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicFormFieldComponent),
      multi: true
    }
  ]
})
export class DynamicFormFieldComponent implements ControlValueAccessor {
  @Input() field!: DynamicField;
  @Input() error: string = '';
  @Input() disabled: boolean = false;
  @Output() fileSelected = new EventEmitter<File>();

  value: any = '';
  selectedFiles: File[] = [];
  dragOver: boolean = false;

  private onChange: (value: any) => void = () => { };
  public onTouched: () => void = () => { };

  writeValue(value: any): void {
    this.value = value;
    if (this.field.field_type === 'File' && value instanceof File) {
      this.selectedFiles = [value];
    } else {
      this.selectedFiles = [];
    }
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(value: string | number | boolean | File): void {
    // console.log('Input value:', value);
    let newValue = value;
    if (this.field.field_type === 'Checkbox') {
      newValue = value as boolean;
    }
    this.value = newValue;
    this.onChange(newValue);
    this.onTouched();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []) as File[];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        console.error(`${file.name} exceeds 10MB limit`);
        return false;
      }
      if (this.field.field_name.toLowerCase().includes('image') && !file.type.startsWith('image/')) {
        console.error(`${file.name} is not an image`);
        return false;
      }
      return true;
    });
    this.selectedFiles = validFiles;
    const value = validFiles.length === 1 ? validFiles[0] : null;
    this.value = value;
    this.onChange(value);
    if (validFiles.length > 0) {
      this.fileSelected.emit(validFiles[0]);
    }
    this.onTouched();
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOver = false;
    const files = Array.from(event.dataTransfer?.files || []) as File[];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        console.error(`${file.name} exceeds 10MB limit`);
        return false;
      }
      if (this.field.field_name.toLowerCase().includes('image') && !file.type.startsWith('image/')) {
        console.error(`${file.name} is not an image`);
        return false;
      }
      return true;
    });
    this.selectedFiles = validFiles;
    const value = validFiles.length === 1 ? validFiles[0] : null;
    this.value = value;
    this.onChange(value);
    if (validFiles.length > 0) {
      this.fileSelected.emit(validFiles[0]);
    }
    this.onTouched();
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    const value = this.selectedFiles.length === 1 ? this.selectedFiles[0] : null;
    this.value = value;
    this.onChange(value);
  }

  getFieldId(): string {
    return `field_${this.field.id}`;
  }

  getPlaceholder(): string {
    return this.field.placeholder || `Enter ${this.field.field_name.toLowerCase()}`;
  }

  hasError(): boolean {
    return !!this.error;
  }

  getErrorMessage(): string {
    return this.error;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'xls':
      case 'xlsx':
        return 'table_chart';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      default:
        return 'attach_file';
    }
  }
}
