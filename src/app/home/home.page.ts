import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonDatetime, IonicModule, IonModal } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule],
})
export class HomePage {
    @ViewChild('datetime') datetime!: IonDatetime;
    @ViewChild('modal') modal!: IonModal;
    constructor() {
    }

    selectedDate: string[] = [];
    myDates: string[] = [new Date().toISOString().substring(0, 10)];
    highlightedDates: any[] = [];
    selectedText = "Select date";

    dateChanged() {
        if (this.myDates.length == 3) {
            this.myDates = [this.myDates[2]]
        }

        this.updateHighlightedDates();
    }

    updateHighlightedDates() {
        var dates = this.myDates.map(date => new Date(date));
        this.highlightedDates = [];

        if (dates.length == 2) {
            var firstDate, lastDate;
            if (dates[0] < dates[1]) {
                firstDate = dates[0];
                lastDate = dates[1];
            }
            else {
                firstDate = dates[1];
                lastDate = dates[0];
            }

            for (var date = firstDate; date <= lastDate; date.setDate(date.getDate() + 1)) {
                this.highlightedDates.push({
                    date: date.toISOString().substring(0, 10),
                    textColor: 'var(--ion-color-secondary-contrast)',
                    backgroundColor: '#3880ff'
                })

            }
        }
    }

    openDatePicker() {
        this.modal.present();
    }

    reset() {
        if (this.selectedDate.length > 0) {
            this.myDates = this.selectedDate;
        }
        else {
            this.myDates = [new Date().toISOString().substring(0, 10)];
        }
        this.updateHighlightedDates();
    }

    cancel() {
        this.modal.dismiss();
        this.reset();
    }

    confirm() {
        this.modal.dismiss();
        this.selectedDate = this.myDates;
        var length = this.selectedDate.length;
        switch (length) {
            case 0:
                this.selectedText = "Select date";
                break;
            case 1:
                this.selectedText = "Select date (" + this.selectedDate[0] + ")";
                break;
            case 2:
                this.selectedText = "Select date (" + this.selectedDate[0] + " - " + this.selectedDate[1] + ")";
                break;
            default:
                break;
        }
    }
}
