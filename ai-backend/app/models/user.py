from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship


Base = declarative_base()

class User(Base):
    
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(256),unique=True, nullable=False, index=True)
    password_hash = Column(String(256), nullable=False)
    created_at = Column(DateTime, default = func.now())
    notes = relationship("Note", back_populates="user")
    
    def _repr(self):
        return f"<User(id={self.id}, email='{self.email}')>"
    
    def _str_(self):
        return f"User: {self.email}"
    