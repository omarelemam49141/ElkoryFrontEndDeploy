import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IOffer } from '../../../Models/ioffer';
import { GenericService } from '../../../services/generic.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SuccessSnackbarComponent } from '../../notifications/success-snackbar/success-snackbar.component';
import { FailedSnackbarComponent } from '../../notifications/failed-snackbar/failed-snackbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../../../services/offer.service';
import { IEditOffer } from '../../../Models/iedit-offer';

@Component({
  selector: 'app-add-new-offer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-new-offer.component.html',
  styleUrl: './add-new-offer.component.scss'
})
export class AddNewOfferComponent implements OnInit, OnDestroy {
  //notification properties
  notificationDurationInSeconds: number = 5;

  //subscriptions properties
  subscriptions: Subscription[] = [];

  //form properties
  addOfferForm!: FormGroup;
  offerToEdit: IOffer | null = null;
  selectedImage: string = '';

  constructor(private fb: FormBuilder,
    private genericService: GenericService<IOffer>,
    private snackBar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private offerService: OfferService
  ) {
    this.addOfferForm = this.fb.group({
      title: [this.offerToEdit?.title?? "", [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: [this.offerToEdit?.description?? "", [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
      offerDate: this.fb.group({
        year: [this.offerToEdit?.offerDate?.getFullYear()??"", [Validators.required, Validators.min(2024), Validators.max(2100)]],
        month: [this.offerToEdit?.offerDate?.getMonth()??"", [Validators.required, Validators.min(1), Validators.max(12)]],
        day: [this.offerToEdit?.offerDate?.getDay()??"", [Validators.required, Validators.min(1), Validators.max(31)]]
      }),
      duration: [this.offerToEdit?.duration?? "", [Validators.required, Validators.min(1)]],
      packageDiscount: [this.offerToEdit?.packageDiscount?? "", [Validators.required, Validators.min(0)]],
      image: [this.offerToEdit?.image?? "", [Validators.required]]
    })
  }
  //observers
  addOfferObserver = {
    next: (data: any) => {
      if (this.offerToEdit) {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: 'تم تعديل العرض بنجاح',
          duration: this.notificationDurationInSeconds * 1000
        })
      } else {
        this.snackBar.openFromComponent(SuccessSnackbarComponent, {
          data: 'تم اضافة العرض بنجاح',
          duration: this.notificationDurationInSeconds * 1000
        })
      }
      //navigate to the offer details
      this.router.navigate(["/admin-offers/offer-details", data])
    },
    error: (err: Error) => {
      console.log(err);
      if(this.offerToEdit) {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: 'تعذر تعديل العرض',
          duration: this.notificationDurationInSeconds * 1000
        })
      } else {
        this.snackBar.openFromComponent(FailedSnackbarComponent, {
          data: 'تعذر اضافة العرض',
          duration: this.notificationDurationInSeconds * 1000
        })
      }
    }
  }

  ngOnInit(): void {
    this.loadOfferToEdit();
  }

  loadOfferToEdit() {
    this.activatedRoute.paramMap.subscribe(params=> {
      let id = params.get("id");
      if (id) {
        this.genericService.getById("Offers",Number(id)).subscribe({
          next: (data) => {
            this.offerToEdit = data,
            this.populateFormData(data);
          },
          error: (err: Error) => {
            this.snackBar.openFromComponent(FailedSnackbarComponent, {
              data: "فشل تحميل العرض",
              duration: this.notificationDurationInSeconds * 1000
            })
          }
        })
      }
    })
  }

  populateFormData(data: IOffer) {
    this.selectedImage = this.offerToEdit?.image??"";
    this.addOfferForm.patchValue(data);

    let offerDate: Date = new Date(data.offerDate);
    this.addOfferForm.patchValue({
      offerDate: {
        year: offerDate?.getFullYear(),
        month: offerDate?.getMonth(),
        day: offerDate?.getDay()
      }
    })
  }

  //functions
  onFileSelected(event: any): void {

    //convert the file to binary
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file: File = event.target.files[0];
      // Check if the selected file is an image
      if (file.type.startsWith('image/')) {
        this.addOfferForm.get("image")?.setValue(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e: any) => {
          this.selectedImage = e.target.result;
        };
      } else {
        // If the selected file is not an image, clear the file input
        input.value = ''; // Clear the file input
        this.selectedImage = '';
      }
    }

  }

  addOffer(): void {
    if(this.addOfferForm.valid){
      let formData = new FormData();
        let offerData = this.addOfferForm.value;
        formData.append('title', offerData.title);
        formData.append('description', offerData.description);
        formData.append('offerDate', offerData.offerDate.year + '-' + offerData.offerDate.month + '-' + offerData.offerDate.day);
        formData.append('duration', offerData.duration);
        formData.append('packageDiscount', offerData.packageDiscount);
        formData.append('image', offerData.image);
      if (this.offerToEdit) {
        formData.append('offerId', this.offerToEdit.offerId.toString());
        this.subscriptions.push(this.offerService.updateOffer(formData).subscribe(this.addOfferObserver));
      } else {
        
        this.subscriptions.push(this.genericService.insert('Offers', formData).subscribe(this.addOfferObserver));
      }
    }
  }

  get title() {
    return this.addOfferForm.get('title');
  }

  get description() {
    return this.addOfferForm.get('description');
  }

  get offerDate() {
    return this.addOfferForm.get('offerDate');
  }

  get duration() {
    return this.addOfferForm.get('duration');
  }

  get packageDiscount() {
    return this.addOfferForm.get('packageDiscount');
  }

  get year() {
    return this.addOfferForm.get('offerDate.year');
  }

  get month() {
    return this.addOfferForm.get('offerDate.month');
  }

  get day() {
    return this.addOfferForm.get('offerDate.day');
  }

  get image() {
    return this.addOfferForm.get('image');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
