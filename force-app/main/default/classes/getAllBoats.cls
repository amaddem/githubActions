public with sharing class getAllBoats {
    
    @AuraEnabled(cacheable=true)
    public static List<Boat__c> getAllBoats(){
        
        return [Select Id, Name, Description__c, Price__c FROM Boat__c ]; 
    }
}