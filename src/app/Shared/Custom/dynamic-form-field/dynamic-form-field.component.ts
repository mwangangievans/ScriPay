import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { DynamicField } from '../../../B2B/kyc-info/kyc-info.component';

@Component({
  selector: 'app-dynamic-form-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-form-field.component.html',
  styleUrls: ['./dynamic-form-field.component.css']
})
export class DynamicFormFieldComponent {
  @Input() field!: DynamicField;
  @Input() control!: FormControl;
  @Input() error: string = '';
  @Input() disabled: boolean = false;
  @Output() fileSelected = new EventEmitter<File>();

  value: any = '';
  selectedFiles: File[] = [];
  dragOver: boolean = false;

  private onChange = (value: any) => { };
  public onTouched = () => { };

  writeValue(value: any): void {
    this.value = value;
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

  onInputChange(event: any): void {
    const value = event.target.value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  onCheckboxChange(event: any): void {
    const value = event.target.checked;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  onFileChange(event: any): void {
    const files = Array.from(event.target.files) as File[];
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
    this.onChange(validFiles.length === 1 ? validFiles[0] : validFiles);
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
    if (validFiles.length > 0) {
      this.selectedFiles = validFiles;
      this.onChange(validFiles.length === 1 ? validFiles[0] : validFiles);
      this.fileSelected.emit(validFiles[0]);
      this.onTouched();
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.onChange(this.selectedFiles.length === 1 ? this.selectedFiles[0] : this.selectedFiles);
  }

  getFieldId(): string {
    return `field_${this.field.id}`;
  }

  getPlaceholder(): string {
    return this.field.placeholder || `Enter ${this.field.field_name.toLowerCase()}`;
  }

  hasError(): boolean {
    return this.control?.invalid && this.control?.touched;
  }

  getErrorMessage(): string {
    if (!this.control?.errors) return this.error;

    const errors = this.control.errors;
    if (errors['required']) return `${this.field.field_name} is required`;
    if (errors['email']) return 'Please enter a valid email address';
    if (errors['pattern']) return `Invalid ${this.field.field_name.toLowerCase()} format`;
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters required`;
    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;

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
