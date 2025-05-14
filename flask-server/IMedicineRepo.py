# Interface for data access repository
from abc import ABC, abstractmethod

repo_instance = None

class AbstractRepository(ABC):

    @abstractmethod
    def get_medicines(self):
        """Gets all medicines"""
        raise NotImplementedError
    
    
    @abstractmethod
    def get_medicine_by_id(self, id):
        """Gets medicine according to id"""
        raise NotImplementedError

    
    @abstractmethod
    def get_medicine_by_barcode(self, barcode):
        """Gets medicine by the barcode"""
        raise NotImplementedError

    @abstractmethod
    def search_medicine_by_name(self, string):
        """Returns medicines that match what user is typing in the search bar"""
        raise NotImplementedError

    @abstractmethod
    def get_cmi_sheet_by_medicine_id(self, id):
        """Returns cmi sheet by the medicine id"""
        """Can use the get_medicine_by_barcode to find id if we have barcode only"""
        raise NotImplementedError
    
    @abstractmethod
    def get_ingredients_by_medicine_id(self, id):
        """Return medicine ingredients by medicine_id"""
        """Can use the get_medicine_by_barcode to find id if we have barcode only"""
        raise NotImplementedError
    
    @abstractmethod
    def get_recalls(self):
        """Gets all recalls from our database"""
        raise NotImplementedError
    
    @abstractmethod
    def update_recalls(self):
        """Inserts new recall data into our database"""
        raise NotImplementedError
    
    
