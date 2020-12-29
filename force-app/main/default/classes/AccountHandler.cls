public with sharing class AccountHandler {
    
    @AuraEnabled
    public static Account getCurrentAccountInfos(Id recordId){

        return [SELECT Name, Industry, Phone FROM Account WHERE Id = :recordId ]; 
    }


    @AuraEnabled
    public static void saveBlob(String Name, Blob fileDoc, Id recordId){
        Attachment attach = new Attachment();
        attach.Body = fileDoc;
        attach.Name = Name; 
        attach.IsPrivate = false;
        attach.ParentId = recordId;
        insert attach;
    }
}