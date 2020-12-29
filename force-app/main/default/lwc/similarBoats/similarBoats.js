import { api, LightningElement, wire } from 'lwc';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';
import { NavigationMixin } from 'lightning/navigation';

export default class SimilarBoats extends NavigationMixin(LightningElement) {
    // Private
    currentBoat;
    relatedBoats;
    boatId;
    error;

     // public
     @api
     get recordId() {
         // returns the boatId
         return this.boatId;
       }
       set recordId(value) {
           // sets the boatId value
           this.setAttribute('boatId', value);          
           this.boatId = value;
           // sets the boatId attribute
          
       }

    // public
    @api
    similarBy;

    // Wire custom Apex call, using the import named getSimilarBoats
    // Populates the relatedBoats list
    @wire(getSimilarBoats, { boatId: '$boatId', similarBy: '$similarBy' })
    similarBoats({ error, data }) {
        if (data) {
            this.relatedBoats = data;
            console.log(JSON.stringify(this.relatedBoats));
            this.error = undefined;
            
        } else if(error) {
            this.relatedBoats = undefined;
            this.error = error;
        }
     }
    get getTitle() {
        return 'Similar boats by ' + this.similarBy;
    }
    get noBoats() {
        return !(this.relatedBoats && this.relatedBoats.length > 0);
    }

    // Navigate to record page
    openBoatDetailPage(event) {
        const boatIdFromTile = event.detail.boatId; 
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: boatIdFromTile,
                objectApiName: 'Boat__c',
                actionName: 'view'
            },
        });
    }
}