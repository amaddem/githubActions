import { LightningElement, wire } from 'lwc';
import getAllBoats from '@salesforce/apex/getAllBoats.getAllBoats';
export default class BoatsList extends LightningElement {

    @wire(getAllBoats) 
    BoatsList;
    

}