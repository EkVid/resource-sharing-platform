import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormControl, FormGroup } from '@angular/forms';

interface Course {
    code: string;
    title: string;
    department: string;
    level: string;
    campus: string;
    breadthReqs: string[];
    description: string;
    materials: string[];
    updatedAt: string;
}

interface FilterGroup {
    [key: string]: boolean;
}

@Component({
    selector: 'app-courses',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatChipsModule,
        MatSelectModule,
        MatDividerModule,
        MatCheckboxModule,
        MatExpansionModule
    ],
    template: `
    <div class="courses-page">
      <!-- Search and Filter Section -->
      <div class="search-section">
        <mat-form-field class="search-field" appearance="outline">
          <mat-label>Search courses</mat-label>
          <input matInput [formControl]="searchControl" placeholder="e.g., CSC148, Calculus, Computer Science...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-accordion class="filters-accordion" multi>
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>school</mat-icon>
                Department
              </mat-panel-title>
              <mat-panel-description *ngIf="getSelectedCount('departments') > 0">
                {{getSelectedCount('departments')}} selected
              </mat-panel-description>
            </mat-expansion-panel-header>
            <div class="checkbox-group">
              <mat-checkbox *ngFor="let dept of departments" 
                          [checked]="filterForm.get('departments')?.get(dept)?.value"
                          (change)="updateFilter('departments', dept, $event.checked)">
                {{dept}}
              </mat-checkbox>
            </div>
          </mat-expansion-panel>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>format_list_numbered</mat-icon>
                Level
              </mat-panel-title>
              <mat-panel-description *ngIf="getSelectedCount('levels') > 0">
                {{getSelectedCount('levels')}} selected
              </mat-panel-description>
            </mat-expansion-panel-header>
            <div class="checkbox-group">
              <mat-checkbox *ngFor="let level of levels"
                          [checked]="filterForm.get('levels')?.get(level)?.value"
                          (change)="updateFilter('levels', level, $event.checked)">
                {{level}}
              </mat-checkbox>
            </div>
          </mat-expansion-panel>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>location_on</mat-icon>
                Campus
              </mat-panel-title>
              <mat-panel-description *ngIf="getSelectedCount('campuses') > 0">
                {{getSelectedCount('campuses')}} selected
              </mat-panel-description>
            </mat-expansion-panel-header>
            <div class="checkbox-group">
              <mat-checkbox *ngFor="let campus of campuses"
                          [checked]="filterForm.get('campuses')?.get(campus)?.value"
                          (change)="updateFilter('campuses', campus, $event.checked)">
                {{campus}}
              </mat-checkbox>
            </div>
          </mat-expansion-panel>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>category</mat-icon>
                Breadth Requirements
              </mat-panel-title>
              <mat-panel-description *ngIf="getSelectedCount('breadthReqs') > 0">
                {{getSelectedCount('breadthReqs')}} selected
              </mat-panel-description>
            </mat-expansion-panel-header>
            <div class="checkbox-group">
              <mat-checkbox *ngFor="let req of breadthRequirements"
                          [checked]="filterForm.get('breadthReqs')?.get(req)?.value"
                          (change)="updateFilter('breadthReqs', req, $event.checked)">
                {{req}}
              </mat-checkbox>
            </div>
          </mat-expansion-panel>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>library_books</mat-icon>
                Materials Available
              </mat-panel-title>
              <mat-panel-description *ngIf="getSelectedCount('materials') > 0">
                {{getSelectedCount('materials')}} selected
              </mat-panel-description>
            </mat-expansion-panel-header>
            <div class="checkbox-group">
              <mat-checkbox *ngFor="let material of availableMaterials"
                          [checked]="filterForm.get('materials')?.get(material)?.value"
                          (change)="updateFilter('materials', material, $event.checked)">
                {{material}}
              </mat-checkbox>
            </div>
          </mat-expansion-panel>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <mat-panel-title>
                <mat-icon>sort</mat-icon>
                Sort Options
              </mat-panel-title>
            </mat-expansion-panel-header>
            <mat-form-field appearance="outline">
              <mat-label>Sort by</mat-label>
              <mat-select [formControl]="sortControl">
                <mat-option value="code">Course Code</mat-option>
                <mat-option value="updated">Last Updated</mat-option>
                <mat-option value="resources">Number of Resources</mat-option>
              </mat-select>
            </mat-form-field>
          </mat-expansion-panel>
        </mat-accordion>

        <div class="active-filters">
          <mat-chip-listbox>
            <mat-chip *ngFor="let filter of activeFilters" (removed)="removeFilter(filter)">
              {{filter}}
              <mat-icon matChipRemove>cancel</mat-icon>
            </mat-chip>
          </mat-chip-listbox>
        </div>
      </div>

      <!-- Courses Grid -->
      <div class="courses-grid">
        <mat-card *ngFor="let course of filteredCourses" class="course-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>school</mat-icon>
            <mat-card-title>{{course.code}}</mat-card-title>
            <mat-card-subtitle>{{course.title}}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{course.description}}</p>
            <div class="course-info">
              <mat-chip-listbox>
                <mat-chip>{{course.campus}}</mat-chip>
                <mat-chip>{{course.level}}</mat-chip>
                <mat-chip *ngFor="let req of course.breadthReqs">{{req}}</mat-chip>
              </mat-chip-listbox>
            </div>
            <div class="materials-info">
              <h4>Available Materials:</h4>
              <mat-chip-listbox>
                <mat-chip *ngFor="let material of course.materials">{{material}}</mat-chip>
              </mat-chip-listbox>
            </div>
            <div class="update-info">
              <mat-icon>update</mat-icon>
              <span>Last updated: {{course.updatedAt}}</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="accent">View Resources</button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
    styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
    searchControl = new FormControl('');
    sortControl = new FormControl('code');

    departments = ['Computer Science', 'Mathematics', 'Physics', 'Psychology', 'Biology'];
    levels = ['A / 100', 'B / 200', 'C / 300', 'D / 400'];
    campuses = ['UTSG', 'UTM', 'UTSC'];
    breadthRequirements = [
        'Quantitative Reasoning',
        'Natural Science',
        'Social & Behavioral Science',
        'Arts, Literature, and Language',
        'History, Philosophy, and Cultural Studies'
    ];
    availableMaterials = [
        'Past Tests',
        'Tutorial Worksheets',
        'Assignments',
        'Lecture Notes',
        'Practice Problems',
        'Study Guides',
        'Course Syllabus',
        'Midterm Reviews',
        'Final Exam Prep',
        'Lab Materials'
    ];
    activeFilters: string[] = [];

    filterForm = new FormGroup({
        departments: new FormGroup({}),
        levels: new FormGroup({}),
        campuses: new FormGroup({}),
        breadthReqs: new FormGroup({}),
        materials: new FormGroup({})
    });

    courses: Course[] = [
        {
            code: 'CSC148',
            title: 'Introduction to Computer Science',
            department: 'Computer Science',
            level: 'A / 100',
            campus: 'UTSG',
            breadthReqs: ['Quantitative Reasoning'],
            description: 'Abstract data types and data structures for implementing them. Linked data structures. Object-oriented programming. Encapsulation and information-hiding. Testing. Specifications. Analyzing the efficiency of programs.',
            materials: ['Past Tests', 'Assignments', 'Lecture Notes', 'Tutorial Worksheets'],
            updatedAt: '2024-03-15'
        },
        {
            code: 'MAT137',
            title: 'Calculus with Proofs',
            department: 'Mathematics',
            level: 'A / 100',
            campus: 'UTSG',
            breadthReqs: ['Quantitative Reasoning'],
            description: 'A conceptual approach to calculus for students with a serious interest in mathematics. Attention is given to computational aspects as well as theoretical foundations and problem solving techniques.',
            materials: ['Practice Problems', 'Study Guides', 'Past Tests', 'Final Exam Prep'],
            updatedAt: '2024-03-10'
        },
        {
            code: 'PSY100',
            title: 'Introductory Psychology',
            department: 'Psychology',
            level: 'A / 100',
            campus: 'UTM',
            breadthReqs: ['Social & Behavioral Science'],
            description: 'Psychology as a biological and social science with emphasis on understanding human nature through experimental analysis of behavior.',
            materials: ['Course Syllabus', 'Lecture Notes', 'Midterm Reviews', 'Study Guides'],
            updatedAt: '2024-03-12'
        }
    ];

    filteredCourses: Course[] = [];

    ngOnInit() {
        this.initializeFilterForm();
        this.filteredCourses = this.courses;
        this.setupFilterSubscriptions();
    }

    private initializeFilterForm() {
        // Initialize form controls for each filter category
        this.departments.forEach(dept => {
            (this.filterForm.get('departments') as FormGroup).addControl(dept, new FormControl(false));
        });
        this.levels.forEach(level => {
            (this.filterForm.get('levels') as FormGroup).addControl(level, new FormControl(false));
        });
        this.campuses.forEach(campus => {
            (this.filterForm.get('campuses') as FormGroup).addControl(campus, new FormControl(false));
        });
        this.breadthRequirements.forEach(req => {
            (this.filterForm.get('breadthReqs') as FormGroup).addControl(req, new FormControl(false));
        });
        this.availableMaterials.forEach(material => {
            (this.filterForm.get('materials') as FormGroup).addControl(material, new FormControl(false));
        });
    }

    private setupFilterSubscriptions() {
        // Subscribe to search and sort changes
        this.searchControl.valueChanges.subscribe(() => this.applyFilters());
        this.sortControl.valueChanges.subscribe(() => this.applyFilters());

        // Subscribe to filter form changes
        this.filterForm.valueChanges.subscribe(() => this.applyFilters());
    }

    updateFilter(category: string, value: string, checked: boolean) {
        const control = this.filterForm.get(category)?.get(value);
        if (control) {
            control.setValue(checked);
        }
    }

    private applyFilters() {
        let filtered = [...this.courses];
        const searchTerm = this.searchControl.value?.toLowerCase() || '';
        const filterValues = this.filterForm.value;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(course =>
                course.code.toLowerCase().includes(searchTerm) ||
                course.title.toLowerCase().includes(searchTerm) ||
                course.description.toLowerCase().includes(searchTerm)
            );
        }

        // Apply department filters
        const selectedDepartments = Object.entries(filterValues.departments || {})
            .filter(([_, selected]) => selected)
            .map(([dept]) => dept);
        if (selectedDepartments.length > 0) {
            filtered = filtered.filter(course => selectedDepartments.includes(course.department));
        }

        // Apply level filters
        const selectedLevels = Object.entries(filterValues.levels || {})
            .filter(([_, selected]) => selected)
            .map(([level]) => level);
        if (selectedLevels.length > 0) {
            filtered = filtered.filter(course => selectedLevels.includes(course.level));
        }

        // Apply campus filters
        const selectedCampuses = Object.entries(filterValues.campuses || {})
            .filter(([_, selected]) => selected)
            .map(([campus]) => campus);
        if (selectedCampuses.length > 0) {
            filtered = filtered.filter(course => selectedCampuses.includes(course.campus));
        }

        // Apply breadth requirement filters
        const selectedBreadthReqs = Object.entries(filterValues.breadthReqs || {})
            .filter(([_, selected]) => selected)
            .map(([req]) => req);
        if (selectedBreadthReqs.length > 0) {
            filtered = filtered.filter(course =>
                course.breadthReqs.some(req => selectedBreadthReqs.includes(req))
            );
        }

        // Apply materials filter
        const selectedMaterials = Object.entries(filterValues.materials || {})
            .filter(([_, selected]) => selected)
            .map(([material]) => material);
        if (selectedMaterials.length > 0) {
            filtered = filtered.filter(course =>
                selectedMaterials.some(material => course.materials.includes(material))
            );
        }

        // Apply sorting
        const sortBy = this.sortControl.value;
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'updated':
                    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
                case 'resources':
                    return b.materials.length - a.materials.length;
                default:
                    return a.code.localeCompare(b.code);
            }
        });

        this.filteredCourses = filtered;
        this.updateActiveFilters();
    }

    private updateActiveFilters() {
        this.activeFilters = [];
        if (this.searchControl.value) {
            this.activeFilters.push(`Search: ${this.searchControl.value}`);
        }

        const filterValues = this.filterForm.value;

        // Add department filters
        Object.entries(filterValues.departments || {})
            .filter(([_, selected]) => selected)
            .forEach(([dept]) => this.activeFilters.push(`Department: ${dept}`));

        // Add level filters
        Object.entries(filterValues.levels || {})
            .filter(([_, selected]) => selected)
            .forEach(([level]) => this.activeFilters.push(`Level: ${level}`));

        // Add campus filters
        Object.entries(filterValues.campuses || {})
            .filter(([_, selected]) => selected)
            .forEach(([campus]) => this.activeFilters.push(`Campus: ${campus}`));

        // Add breadth requirement filters
        Object.entries(filterValues.breadthReqs || {})
            .filter(([_, selected]) => selected)
            .forEach(([req]) => this.activeFilters.push(`Breadth: ${req}`));

        // Add materials filters
        Object.entries(filterValues.materials || {})
            .filter(([_, selected]) => selected)
            .forEach(([material]) => this.activeFilters.push(`Material: ${material}`));
    }

    removeFilter(filter: string) {
        if (filter.startsWith('Search:')) {
            this.searchControl.setValue('');
        } else {
            const [category, value] = filter.split(': ');
            let formGroup: string;
            switch (category) {
                case 'Department':
                    formGroup = 'departments';
                    break;
                case 'Level':
                    formGroup = 'levels';
                    break;
                case 'Campus':
                    formGroup = 'campuses';
                    break;
                case 'Breadth':
                    formGroup = 'breadthReqs';
                    break;
                case 'Material':
                    formGroup = 'materials';
                    break;
                default:
                    return;
            }
            this.updateFilter(formGroup, value, false);
        }
    }

    getSelectedCount(category: string): number {
        const group = this.filterForm.get(category) as FormGroup;
        if (!group) return 0;
        return Object.values(group.value).filter(value => value).length;
    }
} 