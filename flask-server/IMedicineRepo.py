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
    
