public with sharing class TodoClass {
   
    @AuraEnabled
    public static Boolean insertTodo(Todo__c todo){
        insert new Todo__c(Name=todo.Name, Date_de_cre_ation__c=todo.Date_de_cre_ation__c, Status__c=todo.Status__c); 
        return true; 
    }

    @AuraEnabled(cacheable=false)
    public static List<Todo__c> getAllTodos(){
        return [select name, Date_de_cre_ation__c, Status__c from Todo__c]; 
    }
    @AuraEnabled
    public static void deleteTodo(Id recordId){

        delete [Select Id From Todo__c Where Id = :recordId]; 

    }
}