import { api, LightningElement, track, wire } from "lwc";
import {  MessageContext, publish } from 'lightning/messageService';

import getBoats from "@salesforce/apex/BoatDataService.getBoats";
import { updateRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import { refreshApex } from "@salesforce/apex";
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';

const SUCCESS_TITLE = 'Success';
const MESSAGE_SHIP_IT = 'Ship it!';
const SUCCESS_VARIANT = 'success';
const ERROR_TITLE = 'Error';
const ERROR_VARIANT = 'error';

const columns = [
  { label: 'Name', fieldName: 'Name', type: 'text', editable: true },
  { label: 'Length', fieldName: 'Length__c', type: 'number', editable: true },
  { label: 'Price', fieldName: 'Price__c', type: 'currency', editable: true },
  { label: 'Description', fieldName: 'Description__c', type: 'text', editable: true },
];

export default class BoatSearchResults extends LightningElement {
  boatTypeId = '';
  @track
  boats;
  @track draftValues = [];
  selectedBoatId = '';
  isLoading = false;
  error = undefined;
  wiredBoatsResult;
  columns = columns;

  result;

  @wire(MessageContext)
  messageContext;


  @wire(getBoats, { boatTypeId: '$boatTypeId' })
  wiredBoats(result) {
    this.boats = result;
    if (result.error) {
        this.error = result.error;
        this.boats = undefined;
    }
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }

  @api
  searchBoats(boatTypeId) {
        this.boatTypeId = boatTypeId;
        this.refresh(); 
  }
  @api
  async refresh() {
    this.isLoading = true;
    this.notifyLoading(this.isLoading);
     await refreshApex(this.boats);
    this.isLoading = false;
    this.notifyLoading(this.isLoading);
  }

  // this function must update selectedBoatId and call sendMessageService
  updateSelectedTile(event) {
    this.selectedBoatId = event.detail.boatId;
    this.sendMessageService(this.selectedBoatId);
  }

  // Publishes the selected boat Id on the BoatMC.
  sendMessageService(boatId) {
    // explicitly pass boatId to the parameter recordId
    publish(this.messageContext, BOATMC, { recordId: boatId });
  }

  // This method must save the changes in the Boat Editor
  // Show a toast message with the title
  // clear lightning-datatable draft values
  async handleSave(event) {
    this.notifyLoading(true);
    const recordInputs = event.detail.draftValues.slice().map(draft => {
      const fields = Object.assign({}, draft);
      return { fields };
    });
    const promises = recordInputs.map(recordInput => updateRecord(recordInput));
    Promise.all(promises).then(() => {
      this.notifyLoading(false);
      this.dispatchEvent(new ShowToastEvent({ title: SUCCESS_TITLE, message: MESSAGE_SHIP_IT, variant: SUCCESS_VARIANT }));
      this.draftValues = [];
      return this.refresh();
    }).catch(error => {
      // Handle error
      this.dispatchEvent(new ShowToastEvent({ title: ERROR_TITLE, variant: ERROR_VARIANT }));
      this.error = error
    }).finally(() => {
      this.draftValues = [];
    })

  }
  // Check the current value of isLoading before dispatching the doneloading or loading custom event
  notifyLoading(isLoading) {
    this.isLoading = isLoading;
    if (this.isLoading) {
      this.dispatchEvent(new CustomEvent('loading', { detail: this.isLoading }));
    } else {
      this.dispatchEvent(new CustomEvent('doneloading', { detail: this.isLoading }));
    }
  }

}