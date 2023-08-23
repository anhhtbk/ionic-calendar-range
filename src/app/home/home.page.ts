import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule],
})
export class HomePage {
    @ViewChild('datetime') datetime!: ElementRef;
    constructor() {

    }

    myDates: string[] = [new Date().toISOString().substring(0,10)];
    highlightedDates: any[] = [];

    dateChanged() {
        console.log(this.myDates);

        if (this.myDates.length == 3) {
            this.myDates = [this.myDates[2]]
        }

        var dates = this.myDates.map(date => new Date(date));

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
            this.highlightedDates = [];
            for (var date = firstDate; date <= lastDate; date.setDate(date.getDate() + 1)) {
                this.highlightedDates.push({
                    date: date.toISOString().substring(0,10),
                    textColor: 'var(--ion-color-secondary-contrast)',
                    backgroundColor: '#3880ff'
                })

            }
            console.log(this.highlightedDates);
        }
        else {
            this.highlightedDates = [];
        }
    }

    reset() {
        // this.datetime!.reset();
        this.highlightedDates = [];
    }

    cancel() {
        // this.datetime!.cancel();
    }

    confirm() {
        // this.datetime!.confirm();
    }
}
