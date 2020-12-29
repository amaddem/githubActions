import { api, LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
import BOAT_FIELD from '@salesforce/schema/BoatReview__c.Boat__c';
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name';
import RATING_FIELD from '@salesforce/schema/BoatReview__c.Rating__c';
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c';
const SUCCESS_TITLE = 'Review Created!';
const SUCCESS_VARIANT = 'success';

export default class BoatAddReviewForm extends LightningElement {

    
    // Private
    boatId;
    rating;
    boatReviewObject = BOAT_REVIEW_OBJECT;
    nameField = NAME_FIELD;
    commentField = COMMENT_FIELD;
    labelSubject = 'Review Subject';
    labelRating = 'Rating';

    // Public Getter and Setter to allow for logic to run on recordId change
    @api
    get recordId() {
        return this.boatId;
     }
    set recordId(value) {
        this.setAttribute('boatId', value);
        this.boatId = value;
    }

    handleRatingChanged(event) { 
        this.rating = event.detail;
    }

    handleSubmit(event) { 
        event.preventDefault();
        const fields = event.detail.fields;
        fields.Boat__c = this.recordId;
        fields.Rating__c = this.rating;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
     }

    handleSuccess() {
        const evt = new ShowToastEvent({
            title: SUCCESS_TITLE,
            variant: SUCCESS_VARIANT,
        });
        this.dispatchEvent(evt);
        const createreview = new CustomEvent('createreview');
        this.dispatchEvent(createreview);
        this.handleReset();
    }
    handleReset() {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        }
     }

}