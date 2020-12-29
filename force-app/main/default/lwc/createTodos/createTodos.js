import { LightningElement, track, wire } from 'lwc';
import TODO_OBJECT from '@salesforce/schema/Account';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import Status__c from '@salesforce/schema/Todo__c.Status__c';
import insertTodo from '@salesforce/apex/TodoClass.insertTodo';

export default class CreateTodos extends LightningElement {
    @track
    Name = '';
    @track
    creationDate;
    @track
    status;
    @track
    listHaschanged = false;
    @track 
    defaultValue = ''; 

    options = [];
    @track
    objectToCreate = {
        Name: '',
        Date_de_cre_ation__c: '',
        Status__c: ''
    };

    get getOptions(){
        return this.options; 
    }
    set getOptions(value){
        this.options = value; 
    }

    @wire(getObjectInfo, { objectApiName: TODO_OBJECT })
    objectInfo;
    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: Status__c })
    getStatusPicklists({ error, data }) {
        if (data) {
            const defaultVal = data.defaultValue.value;
            this.defaultValue = defaultVal; 
            this.objectToCreate.Status__c = defaultVal;
            console.log(defaultVal);
            data.values.forEach(el => {
                const obj = { label: el.label, value: el.value };
                if (defaultVal === obj.value) {
                    this.options.unshift(obj);
                }else{
                    this.options = [...this.options, obj];
                }
                 
                console.log(JSON.stringify(this.options));
            })

        } if (error) {

        }
    }

    handleOnNameChange(event) {
        this.objectToCreate.Name = event.target.value;
    }

    handleOnDateChange(event) {
        this.objectToCreate.Date_de_cre_ation__c = event.target.value;
    }
    handleOnStatusChange(event) {
        this.objectToCreate.Status__c = event.target.value;
    }

    handleOnSave() {
        insertTodo({ todo: this.objectToCreate }).then(res => {
            this.listHaschanged = true;
            this.resetFields();
            const selectedEvent = new CustomEvent('listhaschanged', { detail: this.listHaschanged });
            this.dispatchEvent(selectedEvent);


        }).catch(err => {
            console.log(err);
        })

    }

    resetFields() {
        this.template.querySelector('form').reset();
        this.objectToCreate.Status__c = this.defaultValue; 
    }


}