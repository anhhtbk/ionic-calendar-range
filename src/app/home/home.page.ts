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
    @ViewChild('datetime', { read: ElementRef }) datetime!: ElementRef;
    @ViewChild('datetimeModal', { read: ElementRef }) datetimeModal!: ElementRef;

    constructor() {
    }

    ngAfterViewInit() {

    }

    confirmedDates: string[] = [];
    selectedDates: string[] = [new Date().toISOString().substring(0, 10)];
    highlightedDates: any[] = [];
    selectedText = "Select date";

    dateChanged() {
        if (this.selectedDates?.length == 3) {
            this.selectedDates = [this.selectedDates[2]]
        }

        this.updateHighlightedDates();
    }

    async updateHighlightedDates() {
        var dates = this.selectedDates?.map(date => new Date(date));


        let allCalendarDay = this.datetime.nativeElement.shadowRoot.querySelectorAll('.calendar-day')

        for (let index = 0; index < allCalendarDay.length; index++) {
            allCalendarDay[index].classList.remove('last-day-active');
        }

        this.highlightedDates = [];

        if (dates?.length == 2) {
            var firstDate, lastDate;
            if (dates[0] < dates[1]) {
                firstDate = dates[0];
                lastDate = dates[1];
            }
            else {
                firstDate = dates[1];
                lastDate = dates[0];
            }

            var firstHighlighted = firstDate;
            firstHighlighted.setDate(firstHighlighted.getDate() + 1);
            for (var date = firstHighlighted; date < lastDate; date.setDate(date.getDate() + 1)) {
                this.highlightedDates.push({
                    date: date.toISOString().substring(0, 10),
                    textColor: 'var(--ion-color-secondary-contrast)',
                    backgroundColor: '#3880ff'
                })
            }

            await new Promise(f => setTimeout(f, 10));

            let dayActives = this.datetime.nativeElement.shadowRoot.querySelectorAll('.calendar-day-active')

            if (dayActives?.length == 2) {
                dayActives[1].classList.add('last-day-active');
            }
            else if (dayActives?.length == 1) {
                var year = dayActives[0].getAttribute('data-year');
                var month = dayActives[0].getAttribute('data-month');

                if (month.length == 1) {
                    month = '0' + month;
                }

                const foundFirstDayOfMonth = this.highlightedDates.find((e) => e['date'] === year + "-" + month + '-01');
                if (foundFirstDayOfMonth) {
                    dayActives[0].classList.add('last-day-active');
                }
                else {
                    const foundAnyDay = this.highlightedDates.find((e) => e['date'].substring(0, 7) === year + "-" + month);
                    if (foundAnyDay === undefined) {
                        dayActives[0].classList.add('last-day-active');
                    }
                }
            }

            let style = document.createElement('style')
            style.innerHTML = `
                .calendar-day-highlight {
                    border-radius: 0px !important;
                    padding-inline: 8px !important;
                }
                .calendar-day-active .calendar-day-highlight{
                    opacity: 1 !important;
                    border-top-left-radius: 32px !important;
                    border-bottom-left-radius: 32px !important;
                    border-top-right-radius: 0px !important;
                    border-bottom-right-radius: 0px !important;
                }
                .last-day-active .calendar-day-highlight {
                    border-top-left-radius: 0px !important;
                    border-bottom-left-radius: 0px !important;
                    border-top-right-radius: 32px !important;
                    border-bottom-right-radius: 32px !important;
                }
            `;
            this.datetime.nativeElement.shadowRoot.appendChild(style);
        }
        else {
            let style = document.createElement('style')
            style.innerHTML = `
                .calendar-day-active .calendar-day-highlight{
                    border-radius: 32px !important;
                }
            `;
            this.datetime.nativeElement.shadowRoot.appendChild(style);
        }

    }

    openDatePicker() {
        this.datetimeModal.nativeElement.present().then(() => {
            let style = document.createElement('style')
            style.innerHTML = `
                .calendar-day-highlight {
                    border-radius: 0px !important;
                    padding-inline: 8px !important;
                    padding-left: 8px !important;
                    padding-right: 8px !important;
                }
                .calendar-day-active .calendar-day-highlight{
                    opacity: 1 !important;
                    border-radius: 32px !important;
                }
                .calendar-day-active {
                    color: white !important;
                    font-weight: unset !important;
                }
            `;
            this.datetime.nativeElement.shadowRoot.appendChild(style);
            this.updateHighlightedDates();

            //====
            // as you proposed initialising a MutationObserver, but adding mutationRecords to the event details
            const observer = new MutationObserver((mutationRecords) => {
                if (mutationRecords) {
                    window.dispatchEvent(new CustomEvent('datetimeMonthDidChange'));
                }
            });

            observer.observe(
                this.datetime.nativeElement
                    .shadowRoot.querySelector('.calendar-body'),
                {
                    subtree: true,
                    childList: true,
                }
            );

            window.addEventListener('datetimeMonthDidChange', () => {
                this.updateHighlightedDates();
            });
        });
    }

    reset() {
        if (this.confirmedDates.length > 0) {
            this.selectedDates = this.confirmedDates;
        }
        else {
            this.selectedDates = [new Date().toISOString().substring(0, 10)];
        }
        this.updateHighlightedDates();
    }

    cancel() {
        this.datetimeModal.nativeElement.dismiss();
        this.reset();
    }

    confirm() {
        this.datetimeModal.nativeElement.dismiss();
        this.confirmedDates = this.selectedDates;
        var length = this.confirmedDates.length;
        switch (length) {
            case 0:
                this.selectedText = "Select date";
                break;
            case 1:
                this.selectedText = "Select date (" + this.confirmedDates[0] + ")";
                break;
            case 2:
                var firstDate, lastDate;
                if (this.confirmedDates[0] < this.confirmedDates[1]) {
                    firstDate = this.confirmedDates[0];
                    lastDate = this.confirmedDates[1];
                }
                else {
                    firstDate = this.confirmedDates[1];
                    lastDate = this.confirmedDates[0];
                }
                this.selectedText = "Select date (" + firstDate + " - " + lastDate + ")";
                break;
            default:
                break;
        }
    }
}
