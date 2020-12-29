import { api, LightningElement, track } from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { NavigationMixin } from 'lightning/navigation';

export default class BoatReviews  extends NavigationMixin(LightningElement) {
    // Private
    boatId;
    error;
    @track
    boatReviews;
    isLoading;

    @api
    get recordId() {
        return this.boatId;
    }

    set recordId(value) {
        this.setAttribute('boatId', value);
        this.boatId = value;
        this.getReviews()
    }

    // Getter to determine if there are reviews to display
    get reviewsToShow() {
        return (this.boatReviews != undefined && this.boatReviews != null && this.boatReviews != '') ? true : false;
     }

    // Public method to force a refresh of the reviews invoking getReviews
    @api
    refresh() {
        this.getReviews(); 
     }

    // Imperative Apex call to get reviews for given boat
    // returns immediately if boatId is empty or null
    // sets isLoading to true during the process and false when it’s completed
    // Gets all the boatReviews from the result, checking for errors.
    getReviews() {
        if (this.boatId === '' || this.boatId === null) {
            return;
        }
        this.isLoading = true;
        getAllReviews({ boatId: this.boatId }).then(res => {
            this.boatReviews = res;
            console.log(this.boatReviews);
            this.error = undefined;
            this.isLoading = false;
        }).catch(err => {
            this.error = err;
            this.boatReviews = undefined;

        })
    }

    // Helper method to use NavigationMixin to navigate to a given record on click
    navigateToRecord(event) {
        const userId = event.target.dataset.recordId
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: userId ,
                objectApiName: 'User',
                actionName: 'view',
            },
        });
     }

}