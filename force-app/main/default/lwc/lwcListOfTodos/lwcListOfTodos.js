import { api, LightningElement, track } from 'lwc';
import getAllTodos from '@salesforce/apex/TodoClass.getAllTodos';

import deleteTodo  from '@salesforce/apex/TodoClass.deleteTodo';

export default class LwcListOfTodos extends LightningElement {

    @track
    listofTodos = []
    @track
    isEmpty = true; 

    get isTheListEmpty(){
        return this.isEmpty
    }

    set isTheListEmpty(value){
        this.isEmpty = value; 
    }
    get getTodos(){
        return this.listofTodos; 
    }
    set getTodos(value){
        this.listofTodos = value; 
    }

    connectedCallback(){
       this.fetchTodos(); 
    }

    fetchTodos(){
        getAllTodos({}).then(res =>{
            this.listofTodos = res; 
            this.isEmpty = this.listofTodos.length === 0 ? true: false; 
        }).catch(err =>{
            this.isEmpty = true; 
        })
    }

    @api
    refreshTodos(){
        this.fetchTodos(); 
    }

    handleOnDelete(event){
        const id = event.target.dataset.id; 
        deleteTodo({recordId : id}).then(res =>{
            this.fetchTodos(); 
        }).catch(err=>{

        })
    }

}