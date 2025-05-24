from flask import g
import psycopg2
from MedicineRepo import MedicineRepo

def get_db():
    if 'db' not in g:
        g.db = psycopg2.connect(
            "postgresql://neondb_owner:npg_IcM0jz5sEYhZ@ep-orange-shape-a88281lz-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
        )
    return g.db

def get_repo():
    if 'repo' not in g:
        g.repo = MedicineRepo(get_db())
    return g.repo
