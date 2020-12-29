import { LightningElement, track, wire } from 'lwc';



export default class LwcTodoContainer extends LightningElement {

    handleOnListChange(event){
        this.template.querySelector('c-lwc-list-of-todos').refreshTodos(); 
    }
}