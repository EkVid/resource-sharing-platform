import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private darkModeSubject = new BehaviorSubject<boolean>(false);
    darkMode$ = this.darkModeSubject.asObservable();
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);

        if (this.isBrowser) {
            // Check if there's a saved theme preference
            const savedTheme = this.getStorageItem('darkMode');
            if (savedTheme !== null) {
                this.darkModeSubject.next(JSON.parse(savedTheme));
            } else {
                // Check system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.darkModeSubject.next(prefersDark);
            }
        }
    }

    private getStorageItem(key: string): string | null {
        if (this.isBrowser) {
            try {
                return localStorage.getItem(key);
            } catch (error) {
                console.warn('Error accessing localStorage:', error);
                return null;
            }
        }
        return null;
    }

    private setStorageItem(key: string, value: string): void {
        if (this.isBrowser) {
            try {
                localStorage.setItem(key, value);
            } catch (error) {
                console.warn('Error setting localStorage:', error);
            }
        }
    }

    toggleDarkMode(): void {
        const currentValue = this.darkModeSubject.value;
        this.darkModeSubject.next(!currentValue);
        this.setStorageItem('darkMode', JSON.stringify(!currentValue));
    }
} 