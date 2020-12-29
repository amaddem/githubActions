import { api, LightningElement, track, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
// Custom Labels Imports
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat'
import labelDetails from '@salesforce/label/c.Details'
import labelReviews from '@salesforce/label/c.Reviews'
import labelAddReview from '@salesforce/label/c.Add_Review'
import labelFullDetails from '@salesforce/label/c.Full_Details'
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';
import { subscribe, unsubscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';
import Boat__c from '@salesforce/schema/Boat__c';
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import BoatType__c from '@salesforce/schema/Boat__c.BoatType__c';
import Length__c from '@salesforce/schema/Boat__c.Length__c';
import Price__c from '@salesforce/schema/Boat__c.Price__c';
import Description__c from '@salesforce/schema/Boat__c.Description__c';
const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];
export default class BoatDetailTabs extends NavigationMixin(LightningElement) {

  @api
  boatId;
  @api
  wiredRecord;
  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat,
  };

  @track BoatType__c = BoatType__c.fieldApiName;
  @track Length__c = Length__c.fieldApiName;
  @track Price__c = Price__c.fieldApiName;
  @track Description__c = Description__c.fieldApiName;

  @wire(MessageContext)
  messageContext;

  @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS })
  wiredboat(result) {
    this.wiredRecord = result;
  }
  // Decide when to show or hide the icon
  // returns 'utility:anchor' or null
  get detailsTabIconName() {
    return this.wiredRecord.data ? 'utility:anchor' : null;
  }

  // Utilize getFieldValue to extract the boat name from the record wire
  get boatName() {
    return getFieldValue(this.wiredRecord.data, BOAT_NAME_FIELD);
  }

  // Private
  subscription = null;

  // Subscribe to the message channel
  subscribeMC() {
    // local boatId must receive the recordId from the message
    this.subscription = subscribe(this.messageContext, BOATMC, (message) => {
      this.boatId = message.recordId;
    }, { scope: APPLICATION_SCOPE });
  }

  // Calls subscribeMC()
  connectedCallback() {

    if (this.subscription || this.recordId) {
      return;
    }
    this.subscribeMC()
  }
  // Navigates to record page
  navigateToRecordViewPage() {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: this.boatId,
        objectApiName: Boat__c, 
        actionName: 'view',
      }
    })
  }

  // Navigates back to the review list, and refreshes reviews component
  /*he function handleReviewCreated() must set the <lightning-tabset> Reviews tab to active using querySelector() 
  and activeTabValue, and refresh the boatReviews component dynamically.*/
  handleReviewCreated(event) {
    this.template.querySelector('lightning-tabset').activeTabValue = 'reviews';
    //has to call the child function o refresh it 
    this.template.querySelector('c-boat-reviews').refresh(); 
   }
}