import { LightningElement, track, wire } from 'lwc';
import getBoatTypes from '@salesforce/apex/BoatDataService.getBoatTypes';

export default class BoatSearchForm extends LightningElement {
    
    @track
    selectedBoatTypeId = '';
    error = undefined;
    @track
    searchOptions;
    
    @wire(getBoatTypes, {})
     boatTypes({ error, data }) {
      if (data) {
        this.searchOptions = data.map(type => {
          let obj = {label:type.Name, value:type.Id } 
          return obj; 
        });
        this.searchOptions.unshift({ label: 'All Types', value: '' });
      } else if (error) {
        this.searchOptions = undefined;
        this.error = error;
      }
    }
    get options() {
      return this.searchOptions; 
    }
    handleSearchOptionChange(event) {
      this.selectedBoatTypeId = event.target.value; 
      const searchEvent = new CustomEvent('search', { detail: {boatTypeId: this.selectedBoatTypeId} });
      this.dispatchEvent(searchEvent);
    }
}