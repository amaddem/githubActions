import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
export default class BoatSearch extends  NavigationMixin(LightningElement) {
    @track
    boatTypeId = ''; 
    isLoading = false; 

    handleLoading() { 
        this.isLoading = true; 
    }
    handleDoneLoading() {
        this.isLoading = false; 
     }
    searchBoats(event) { 
        this.boatTypeId = event.detail.boatTypeId; 
        this.template.querySelector('c-boat-search-results').searchBoats(this.boatTypeId); 
    }
    //navigation mixin création record 
    createNewBoat() { 
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Boat__c',
                actionName: 'new',
            }
        });
    }
  
}