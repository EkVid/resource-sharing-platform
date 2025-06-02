import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatGridListModule,
        MatDividerModule,
        MatMenuModule
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
    private isDarkThemeValue = false;
    private themeSubscription = new Subscription();

    @HostBinding('class.dark-theme')
    get isDarkTheme() {
        return this.isDarkThemeValue;
    }

    constructor(
        private router: Router,
        private themeService: ThemeService
    ) { }

    ngOnInit() {
        this.themeSubscription = this.themeService.darkMode$.subscribe(
            isDark => this.isDarkThemeValue = isDark
        );
    }

    ngOnDestroy() {
        this.themeSubscription.unsubscribe();
    }

    scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    onGetStarted() {
        this.router.navigate(['/verification']);
    }

    onLearnMore() {
        this.scrollToSection('how-it-works');
    }
} 