import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription, interval } from 'rxjs';
import { Photo } from '../models/photo.model';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-photo-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-display.component.html',
  styleUrl: './photo-display.component.scss',
  animations: [
    trigger('fade', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0 })),
      transition('visible => hidden', animate('{{duration}}ms ease-in-out'), { params: { duration: 1000 } }),
      transition('hidden => visible', animate('{{duration}}ms ease-in-out'), { params: { duration: 1000 } })
    ])
  ]
})
export class PhotoDisplayComponent implements OnInit, OnDestroy {
  photos: Photo[] = [];
  currentPhoto: Photo | null = null;
  currentIndex: number = 0;
  animationState: 'visible' | 'hidden' = 'visible';
  animationParams = { duration: 1000 };
  isLoading: boolean = true; // Flag for loading state

  private photosSubscription!: Subscription;
  private timerSubscription!: Subscription;
  private readonly visibleDuration = 15000; // 15 seconds for photo visibility
  private readonly fadeDuration = 1000; // 1 second for fade animation (one way)

  constructor(private photoService: PhotoService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.photosSubscription = this.photoService.getPhotos().subscribe({
      next: (photos) => {
        this.photos = photos;
        if (this.photos.length > 0) {
          this.currentIndex = 0;
          this.currentPhoto = this.photos[this.currentIndex];
          this.animationState = 'visible';
          this.startSlideshow();
        } else {
          this.currentPhoto = null;
          this.animationState = 'hidden';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching photos:', err);
        this.isLoading = false;
        this.currentPhoto = null; 
        this.animationState = 'hidden';
        this.cdr.detectChanges();
      }
    });
  }

  startSlideshow(): void {
    if (this.photos.length <= 1) return;

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubscription = interval(this.visibleDuration).subscribe(() => {
      this.changeToNextPhotoWithAnimation();
    });
  }

  changeToNextPhotoWithAnimation(): void {
    if (this.photos.length === 0) return;

    this.animationState = 'hidden';
    this.cdr.detectChanges();

    setTimeout(() => {
      this.currentPhoto = null;
      this.cdr.detectChanges();

      this.currentIndex = (this.currentIndex + 1) % this.photos.length;
      const nextPhotoToShow = this.photos[this.currentIndex];

      requestAnimationFrame(() => {
        this.currentPhoto = nextPhotoToShow;
        this.animationState = 'visible';
        this.cdr.detectChanges();
      });

    }, this.fadeDuration);
  }

  ngOnDestroy(): void {
    if (this.photosSubscription) {
      this.photosSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
