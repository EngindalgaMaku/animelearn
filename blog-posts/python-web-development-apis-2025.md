---
title: "Python Web Development & APIs in 2025: FastAPI, Microservices & Modern Deployment"
description: "Master modern Python web development in 2025! Learn FastAPI, microservices, containerization, and cloud deployment. Complete guide with real-world projects."
date: "2025-08-09"
author: "Zumenzu Web Development Team"
category: "Web Development"
tags:
  [
    "python",
    "web development",
    "fastapi",
    "microservices",
    "apis",
    "docker",
    "cloud",
    "2025",
  ]
readTime: "22 min"
featured: true
seoKeywords: "python web development, fastapi tutorial, python microservices, rest api python, docker python, cloud deployment python"
---

# Python Web Development & APIs in 2025: FastAPI, Microservices & Modern Deployment

Web development has evolved dramatically, and Python is leading the charge in 2025! With lightning-fast frameworks like FastAPI, containerization with Docker, and seamless cloud deployment, Python has become the go-to choice for modern web applications and APIs.

## 🚀 Why Python Dominates Web Development in 2025?

### The Modern Python Web Stack:

- ✅ **FastAPI**: Lightning-fast, automatic API documentation
- ✅ **Async/Await**: Native asynchronous programming
- ✅ **Type Hints**: Better code quality and IDE support
- ✅ **Docker**: Containerized deployment everywhere
- ✅ **Cloud Native**: Perfect for AWS, GCP, Azure
- ✅ **Microservices**: Scalable architecture patterns

### What's Hot in 2025:

- 🔥 **AI-Powered APIs**: Integrating LLMs into web services
- 🔥 **Edge Computing**: Python at the edge with serverless
- 🔥 **Real-time Apps**: WebSocket and Server-Sent Events
- 🔥 **GraphQL APIs**: Modern data fetching patterns
- 🔥 **Observability**: Advanced monitoring and tracing

## 🛠️ Setting Up Your 2025 Python Web Development Environment

### Essential Tools and Libraries

```bash
# Core web frameworks
pip install fastapi uvicorn[standard]
pip install django djangorestframework
pip install flask flask-restx

# Database and ORM
pip install sqlalchemy alembic
pip install psycopg2-binary pymongo
pip install redis celery

# Authentication and Security
pip install python-jose[cryptography]
pip install passlib[bcrypt] python-multipart
pip install authlib requests-oauthlib

# Testing and Quality
pip install pytest pytest-asyncio httpx
pip install black isort flake8 mypy

# Deployment and DevOps
pip install gunicorn
pip install python-dotenv
pip install prometheus-client

# Modern async libraries
pip install aiofiles aioredis
pip install websockets
pip install httpx
```

### Docker Development Environment

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

```yaml
# docker-compose.yml
version: "3.8"
services:
  web:
    build: .
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - .:/app

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

## ⚡ Project 1: Building a Modern FastAPI Application

### Complete E-commerce API with FastAPI

```python
from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime, timedelta
import jwt
import bcrypt
import uuid
import asyncio
import aioredis
from contextlib import asynccontextmanager

# Database setup
DATABASE_URL = "postgresql://user:password@localhost/ecommerce"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis setup
redis_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global redis_client
    redis_client = await aioredis.from_url("redis://localhost:6379")
    yield
    # Shutdown
    await redis_client.close()

# FastAPI app with lifespan management
app = FastAPI(
    title="Modern E-commerce API",
    description="A complete e-commerce API built with FastAPI in 2025",
    version="1.0.0",
    lifespan=lifespan
)

# Security
security = HTTPBearer()

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://myapp.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "*.myapp.com"]
)

# Database Models
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    orders = relationship("Order", back_populates="user")

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    stock_quantity = Column(Integer, default=0)
    category_id = Column(Integer, ForeignKey("categories.id"))
    image_url = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(Float)
    status = Column(String, default="pending")  # pending, processing, shipped, delivered
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    price = Column(Float)  # Price at time of order

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

# Pydantic Models
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    first_name: Optional[str]
    last_name: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock_quantity: int = 0
    category_id: int
    image_url: Optional[str] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    stock_quantity: int
    category_id: int
    image_url: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    items: List[dict]  # [{"product_id": 1, "quantity": 2}, ...]

class Token(BaseModel):
    access_token: str
    token_type: str

# Utility Functions
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, "secret-key", algorithm="HS256")
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(credentials.credentials, "secret-key", algorithms=["HS256"])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Background Tasks
async def send_order_confirmation_email(user_email: str, order_id: int):
    """Send order confirmation email (simulated)"""
    await asyncio.sleep(2)  # Simulate email sending delay
    print(f"Order confirmation email sent to {user_email} for order {order_id}")

async def update_inventory(product_id: int, quantity: int):
    """Update inventory in background"""
    await asyncio.sleep(1)  # Simulate inventory update
    print(f"Inventory updated for product {product_id}: -{quantity}")

# API Routes

@app.get("/")
async def root():
    return {"message": "Welcome to Modern E-commerce API 2025"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "version": "1.0.0"
    }

# Authentication Routes
@app.post("/auth/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    # Create new user
    hashed_password = hash_password(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

@app.post("/auth/login", response_model=Token)
async def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# User Routes
@app.get("/users/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user

@app.get("/users", response_model=List[UserResponse])
async def get_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(User).offset(skip).limit(limit).all()
    return users

# Product Routes
@app.post("/products", response_model=ProductResponse)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    # Cache the product
    await redis_client.setex(f"product:{db_product.id}", 3600, db_product.name)

    return db_product

@app.get("/products", response_model=List[ProductResponse])
async def get_products(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product).filter(Product.is_active == True)

    if category_id:
        query = query.filter(Product.category_id == category_id)

    products = query.offset(skip).limit(limit).all()
    return products

@app.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Session = Depends(get_db)):
    # Try to get from cache first
    cached_product = await redis_client.get(f"product:{product_id}")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product

# Order Routes
@app.post("/orders")
async def create_order(
    order: OrderCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Calculate total and validate products
    total_amount = 0
    order_items = []

    for item in order.items:
        product = db.query(Product).filter(Product.id == item["product_id"]).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item['product_id']} not found")

        if product.stock_quantity < item["quantity"]:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")

        item_total = product.price * item["quantity"]
        total_amount += item_total

        order_items.append({
            "product_id": product.id,
            "quantity": item["quantity"],
            "price": product.price
        })

    # Create order
    db_order = Order(
        user_id=current_user.id,
        total_amount=total_amount
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Create order items
    for item in order_items:
        db_order_item = OrderItem(
            order_id=db_order.id,
            **item
        )
        db.add(db_order_item)

        # Update stock
        product = db.query(Product).filter(Product.id == item["product_id"]).first()
        product.stock_quantity -= item["quantity"]

    db.commit()

    # Background tasks
    background_tasks.add_task(send_order_confirmation_email, current_user.email, db_order.id)
    for item in order_items:
        background_tasks.add_task(update_inventory, item["product_id"], item["quantity"])

    return {"order_id": db_order.id, "total_amount": total_amount, "status": "created"}

@app.get("/orders/me")
async def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orders = db.query(Order).filter(Order.user_id == current_user.id).all()
    return orders

# WebSocket for real-time notifications
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await websocket.accept()
    try:
        while True:
            # Send periodic updates
            await websocket.send_json({
                "type": "heartbeat",
                "timestamp": datetime.utcnow().isoformat()
            })
            await asyncio.sleep(30)
    except Exception as e:
        print(f"WebSocket error: {e}")

# Analytics and Monitoring
@app.get("/analytics/sales")
async def get_sales_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")

    # Get sales data from last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)

    total_sales = db.query(Order).filter(Order.created_at >= thirty_days_ago).count()
    total_revenue = db.query(Order).filter(Order.created_at >= thirty_days_ago).with_entities(
        func.sum(Order.total_amount)
    ).scalar() or 0

    return {
        "total_sales": total_sales,
        "total_revenue": float(total_revenue),
        "period": "30_days"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
```

## 🔧 Project 2: Microservices Architecture with Python

### User Service (Microservice)

```python
# user_service/main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import Column, Integer, String, Boolean, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, EmailStr
from datetime import datetime
import httpx
import os

app = FastAPI(title="User Service", version="1.0.0")

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/users")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    first_name: str
    last_name: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    first_name: str
    last_name: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Notify other services
    await notify_user_created(db_user.id, db_user.email)

    return db_user

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def notify_user_created(user_id: int, email: str):
    """Notify other microservices about user creation"""
    notification_service_url = os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8001")

    async with httpx.AsyncClient() as client:
        try:
            await client.post(f"{notification_service_url}/send-welcome-email",
                            json={"user_id": user_id, "email": email})
        except Exception as e:
            print(f"Failed to notify notification service: {e}")

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "user-service"}
```

### Notification Service (Microservice)

```python
# notification_service/main.py
from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
import asyncio
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

app = FastAPI(title="Notification Service", version="1.0.0")

class EmailNotification(BaseModel):
    user_id: int
    email: str
    subject: str = "Welcome!"
    body: str = "Welcome to our platform!"

class SMSNotification(BaseModel):
    user_id: int
    phone: str
    message: str

async def send_email(to_email: str, subject: str, body: str):
    """Send email using SMTP"""
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")

    message = MIMEMultipart()
    message["From"] = smtp_username
    message["To"] = to_email
    message["Subject"] = subject

    message.attach(MIMEText(body, "plain"))

    try:
        await aiosmtplib.send(
            message,
            hostname=smtp_server,
            port=smtp_port,
            start_tls=True,
            username=smtp_username,
            password=smtp_password,
        )
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")

@app.post("/send-welcome-email")
async def send_welcome_email(notification: dict, background_tasks: BackgroundTasks):
    background_tasks.add_task(
        send_email,
        notification["email"],
        "Welcome to Our Platform!",
        f"Hello! Welcome to our platform. Your user ID is {notification['user_id']}"
    )
    return {"status": "email queued"}

@app.post("/send-email")
async def send_custom_email(notification: EmailNotification, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_email, notification.email, notification.subject, notification.body)
    return {"status": "email queued"}

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "notification-service"}
```

### API Gateway

```python
# gateway/main.py
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio
from typing import Dict
import time
import os

app = FastAPI(title="API Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service registry
SERVICES = {
    "users": os.getenv("USER_SERVICE_URL", "http://localhost:8000"),
    "notifications": os.getenv("NOTIFICATION_SERVICE_URL", "http://localhost:8001"),
    "products": os.getenv("PRODUCT_SERVICE_URL", "http://localhost:8002"),
}

# Rate limiting storage
request_counts: Dict[str, list] = {}

async def rate_limit(client_ip: str, limit: int = 100, window: int = 60):
    """Simple rate limiting"""
    now = time.time()

    if client_ip not in request_counts:
        request_counts[client_ip] = []

    # Remove old requests outside the window
    request_counts[client_ip] = [
        req_time for req_time in request_counts[client_ip]
        if now - req_time < window
    ]

    if len(request_counts[client_ip]) >= limit:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")

    request_counts[client_ip].append(now)

async def proxy_request(service: str, path: str, method: str, request: Request):
    """Proxy request to microservice"""
    if service not in SERVICES:
        raise HTTPException(status_code=404, detail="Service not found")

    service_url = SERVICES[service]
    url = f"{service_url}{path}"

    # Get request data
    headers = dict(request.headers)
    body = await request.body() if method in ["POST", "PUT", "PATCH"] else None

    async with httpx.AsyncClient() as client:
        try:
            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                content=body,
                timeout=30.0
            )
            return response.json() if response.content else {}
        except httpx.TimeoutException:
            raise HTTPException(status_code=504, detail="Service timeout")
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Service error: {str(e)}")

@app.api_route("/api/{service}/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def gateway(service: str, path: str, request: Request):
    # Rate limiting
    client_ip = request.client.host
    await rate_limit(client_ip)

    # Add leading slash to path
    if not path.startswith("/"):
        path = "/" + path

    # Proxy the request
    return await proxy_request(service, path, request.method, request)

@app.get("/health")
async def health():
    """Check health of all services"""
    health_status = {}

    async with httpx.AsyncClient() as client:
        for service, url in SERVICES.items():
            try:
                response = await client.get(f"{url}/health", timeout=5.0)
                health_status[service] = {
                    "status": "healthy" if response.status_code == 200 else "unhealthy",
                    "response_time": response.elapsed.total_seconds()
                }
            except Exception as e:
                health_status[service] = {
                    "status": "unhealthy",
                    "error": str(e)
                }

    return {"gateway": "healthy", "services": health_status}

@app.get("/")
async def root():
    return {"message": "API Gateway", "version": "1.0.0", "services": list(SERVICES.keys())}
```

## 🚀 Project 3: Real-time Chat Application with WebSockets

### WebSocket Chat Server

```python
# chat_service/main.py
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, DateTime, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Dict
import json
import asyncio
from datetime import datetime
import redis
import jwt

app = FastAPI(title="Real-time Chat Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = "postgresql://user:password@localhost/chat"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Redis for pub/sub
redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

class ChatRoom(Base):
    __tablename__ = "chat_rooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer)
    user_id = Column(Integer)
    username = Column(String)
    content = Column(Text)
    message_type = Column(String, default="text")  # text, image, file
    created_at = Column(DateTime, default=datetime.utcnow)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        self.user_connections: Dict[int, WebSocket] = {}

    async def connect(self, websocket: WebSocket, room_id: str, user_id: int):
        await websocket.accept()

        if room_id not in self.active_connections:
            self.active_connections[room_id] = []

        self.active_connections[room_id].append(websocket)
        self.user_connections[user_id] = websocket

        # Notify room about new user
        await self.broadcast_to_room(room_id, {
            "type": "user_joined",
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat()
        })

    def disconnect(self, websocket: WebSocket, room_id: str, user_id: int):
        if room_id in self.active_connections:
            self.active_connections[room_id].remove(websocket)

        if user_id in self.user_connections:
            del self.user_connections[user_id]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_to_room(self, room_id: str, data: dict):
        if room_id in self.active_connections:
            message = json.dumps(data)
            disconnected = []

            for connection in self.active_connections[room_id]:
                try:
                    await connection.send_text(message)
                except:
                    disconnected.append(connection)

            # Remove disconnected clients
            for connection in disconnected:
                self.active_connections[room_id].remove(connection)

    async def send_typing_indicator(self, room_id: str, user_id: int, username: str, is_typing: bool):
        await self.broadcast_to_room(room_id, {
            "type": "typing",
            "user_id": user_id,
            "username": username,
            "is_typing": is_typing,
            "timestamp": datetime.utcnow().isoformat()
        })

manager = ConnectionManager()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_token(token: str):
    """Verify JWT token and return user info"""
    try:
        payload = jwt.decode(token, "secret-key", algorithms=["HS256"])
        return payload
    except jwt.PyJWTError:
        return None

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str, token: str):
    # Verify authentication
    user_data = verify_token(token)
    if not user_data:
        await websocket.close(code=4001, reason="Invalid token")
        return

    user_id = user_data.get("user_id")
    username = user_data.get("username")

    await manager.connect(websocket, room_id, user_id)

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)

            if message_data["type"] == "message":
                # Save message to database
                db = SessionLocal()
                try:
                    db_message = Message(
                        room_id=int(room_id),
                        user_id=user_id,
                        username=username,
                        content=message_data["content"],
                        message_type=message_data.get("message_type", "text")
                    )
                    db.add(db_message)
                    db.commit()
                    db.refresh(db_message)

                    # Broadcast to room
                    await manager.broadcast_to_room(room_id, {
                        "type": "message",
                        "id": db_message.id,
                        "user_id": user_id,
                        "username": username,
                        "content": message_data["content"],
                        "message_type": db_message.message_type,
                        "timestamp": db_message.created_at.isoformat()
                    })

                finally:
                    db.close()

            elif message_data["type"] == "typing":
                await manager.send_typing_indicator(
                    room_id, user_id, username, message_data["is_typing"]
                )

            elif message_data["type"] == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))

    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id, user_id)
        await manager.broadcast_to_room(room_id, {
            "type": "user_left",
            "user_id": user_id,
            "username": username,
            "timestamp": datetime.utcnow().isoformat()
        })

@app.get("/rooms/{room_id}/messages")
async def get_room_messages(
    room_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    messages = db.query(Message).filter(Message.room_id == room_id)\
                .order_by(Message.created_at.desc())\
                .offset(skip).limit(limit).all()

    return [
        {
            "id": msg.id,
            "user_id": msg.user_id,
            "username": msg.username,
            "content": msg.content,
            "message_type": msg.message_type,
            "timestamp": msg.created_at.isoformat()
        }
        for msg in messages
    ]

@app.post("/rooms")
async def create_room(name: str, description: str = "", db: Session = Depends(get_db)):
    room = ChatRoom(name=name, description=description)
    db.add(room)
    db.commit()
    db.refresh(room)
    return {"id": room.id, "name": room.name, "description": room.description}

@app.get("/rooms")
async def get_rooms(db: Session = Depends(get_db)):
    rooms = db.query(ChatRoom).all()
    return [
        {
            "id": room.id,
            "name": room.name,
            "description": room.description,
            "active_users": len(manager.active_connections.get(str(room.id), []))
        }
        for room in rooms
    ]
```

### Chat Frontend (React/NextJS Example)

```javascript
// components/ChatRoom.js
import { useState, useEffect, useRef } from "react";

const ChatRoom = ({ roomId, token, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    connectWebSocket();
    fetchPreviousMessages();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [roomId]);

  const connectWebSocket = () => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}?token=${token}`);

    ws.onopen = () => {
      setIsConnected(true);
      console.log("Connected to chat room");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "message":
          setMessages((prev) => [...prev, data]);
          break;
        case "typing":
          if (data.is_typing && data.username !== username) {
            setTypingUsers((prev) => [
              ...prev.filter((u) => u !== data.username),
              data.username,
            ]);
          } else {
            setTypingUsers((prev) => prev.filter((u) => u !== data.username));
          }
          break;
        case "user_joined":
          console.log("User joined:", data.user_id);
          break;
        case "user_left":
          console.log("User left:", data.username);
          break;
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log("Disconnected from chat room");

      // Attempt to reconnect after 3 seconds
      setTimeout(connectWebSocket, 3000);
    };

    wsRef.current = ws;
  };

  const fetchPreviousMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/rooms/${roomId}/messages`
      );
      const data = await response.json();
      setMessages(data.reverse());
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && wsRef.current && isConnected) {
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          content: newMessage.trim(),
          message_type: "text",
        })
      );
      setNewMessage("");
    }
  };

  const sendTypingIndicator = (isTyping) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(
        JSON.stringify({
          type: "typing",
          is_typing: isTyping,
        })
      );
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h3>Chat Room {roomId}</h3>
        <div
          className={`connection-status ${isConnected ? "connected" : "disconnected"}`}
        >
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.username === username ? "own" : ""}`}
          >
            <div className="message-header">
              <strong>{message.username}</strong>
              <span className="timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
            typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage();
              sendTypingIndicator(false);
            }
          }}
          onFocus={() => sendTypingIndicator(true)}
          onBlur={() => sendTypingIndicator(false)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
```

## 🐳 Containerization and Deployment

### Production Dockerfile

```dockerfile
# Dockerfile.prod
FROM python:3.11-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim

WORKDIR /app

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy dependencies from builder stage
COPY --from=builder /root/.local /home/appuser/.local

# Copy application code
COPY . .

# Change ownership to appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Add user's local bin to PATH
ENV PATH=/home/appuser/.local/bin:$PATH

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

CMD ["gunicorn", "main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: python-web-app
  labels:
    app: python-web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: python-web-app
  template:
    metadata:
      labels:
        app: python-web-app
    spec:
      containers:
        - name: web-app
          image: myregistry/python-web-app:latest
          ports:
            - containerPort: 8000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: database-url
            - name: REDIS_URL
              value: "redis://redis-service:6379"
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 5
            periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: python-web-app-service
spec:
  selector:
    app: python-web-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  type: LoadBalancer
```

## 📊 Monitoring and Observability

### Prometheus Metrics

```python
# monitoring/metrics.py
from prometheus_client import Counter, Histogram, Gauge, generate_latest
from fastapi import FastAPI, Response
import time
import psutil

# Metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')
ACTIVE_CONNECTIONS = Gauge('websocket_connections_active', 'Active WebSocket connections')
SYSTEM_MEMORY = Gauge('system_memory_usage_bytes', 'System memory usage')
SYSTEM_CPU = Gauge('system_cpu_usage_percent', 'System CPU usage')

app = FastAPI()

@app.middleware("http")
async def add_metrics_middleware(request, call_next):
    start_time = time.time()

    response = await call_next(request)

    duration = time.time() - start_time
    REQUEST_DURATION.observe(duration)
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()

    return response

@app.get("/metrics")
async def get_metrics():
    # Update system metrics
    SYSTEM_MEMORY.set(psutil.virtual_memory().used)
    SYSTEM_CPU.set(psutil.cpu_percent())

    return Response(generate_latest(), media_type="text/plain")

# Custom business metrics
USER_REGISTRATIONS = Counter('user_registrations_total', 'Total user registrations')
ORDERS_CREATED = Counter('orders_created_total', 'Total orders created')
REVENUE_GENERATED = Counter('revenue_generated_total', 'Total revenue generated')

def track_user_registration():
    USER_REGISTRATIONS.inc()

def track_order_created(amount: float):
    ORDERS_CREATED.inc()
    REVENUE_GENERATED.inc(amount)
```

### Structured Logging

```python
# logging_config.py
import logging
import json
from datetime import datetime
from typing import Any, Dict

class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_entry: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        if hasattr(record, 'user_id'):
            log_entry['user_id'] = record.user_id

        if hasattr(record, 'request_id'):
            log_entry['request_id'] = record.request_id

        if record.exc_info:
            log_entry['exception'] = self.formatException(record.exc_info)

        return json.dumps(log_entry)

def setup_logging():
    # Configure root logger
    logging.basicConfig(
        level=logging.INFO,
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('app.log')
        ]
    )

    # Apply JSON formatter
    for handler in logging.root.handlers:
        handler.setFormatter(JSONFormatter())

# Usage
logger = logging.getLogger(__name__)

# Log with context
def log_user_action(user_id: int, action: str, **kwargs):
    logger.info(
        f"User action: {action}",
        extra={"user_id": user_id, **kwargs}
    )
```

## 🎯 Performance Optimization Tips for 2025

### Async Best Practices

```python
import asyncio
import aiohttp
from typing import List
import asyncpg

# Efficient database operations
async def get_users_efficiently(user_ids: List[int]):
    """Fetch multiple users in a single query"""
    query = "SELECT * FROM users WHERE id = ANY($1)"

    async with asyncpg.create_pool("postgresql://...") as pool:
        async with pool.acquire() as conn:
            records = await conn.fetch(query, user_ids)
            return [dict(record) for record in records]

# Efficient HTTP requests
async def fetch_multiple_apis(urls: List[str]):
    """Fetch multiple APIs concurrently"""
    async with aiohttp.ClientSession() as session:
        tasks = [session.get(url) for url in urls]
        responses = await asyncio.gather(*tasks, return_exceptions=True)

        results = []
        for response in responses:
            if isinstance(response, Exception):
                results.append({"error": str(response)})
            else:
                results.append(await response.json())

        return results

# Background task processing
async def process_background_tasks():
    """Process background tasks efficiently"""
    tasks = await get_pending_tasks()

    # Process in batches
    batch_size = 10
    for i in range(0, len(tasks), batch_size):
        batch = tasks[i:i + batch_size]
        await asyncio.gather(*[process_task(task) for task in batch])

# Caching decorator
from functools import wraps
import pickle

def async_cache(ttl: int = 300):
    def decorator(func):
        cache = {}

        @wraps(func)
        async def wrapper(*args, **kwargs):
            key = pickle.dumps((args, kwargs))

            if key in cache:
                result, timestamp = cache[key]
                if time.time() - timestamp < ttl:
                    return result

            result = await func(*args, **kwargs)
            cache[key] = (result, time.time())
            return result

        return wrapper
    return decorator

@async_cache(ttl=600)
async def expensive_operation(param: str):
    # Simulate expensive operation
    await asyncio.sleep(2)
    return f"Result for {param}"
```

## 🚀 Deployment Strategies for 2025

### Blue-Green Deployment Script

```python
# deploy.py
import asyncio
import aiohttp
import time
from typing import Dict, List

class BlueGreenDeployer:
    def __init__(self, load_balancer_url: str, health_check_path: str = "/health"):
        self.lb_url = load_balancer_url
        self.health_path = health_check_path
        self.environments = {
            "blue": {"url": "http://blue-env:8000", "active": True},
            "green": {"url": "http://green-env:8000", "active": False}
        }

    async def health_check(self, env_url: str) -> bool:
        """Check if environment is healthy"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{env_url}{self.health_path}", timeout=5) as response:
                    return response.status == 200
        except:
            return False

    async def deploy_to_inactive_environment(self, new_version: str):
        """Deploy new version to inactive environment"""
        inactive_env = "green" if self.environments["blue"]["active"] else "blue"

        print(f"Deploying version {new_version} to {inactive_env} environment...")

        # Deploy using Docker/Kubernetes
        await self.deploy_container(inactive_env, new_version)

        # Wait for deployment to complete
        await asyncio.sleep(30)

        # Health check
        if await self.health_check(self.environments[inactive_env]["url"]):
            print(f"{inactive_env} environment is healthy")
            return inactive_env
        else:
            raise Exception(f"{inactive_env} environment failed health check")

    async def switch_traffic(self, new_env: str):
        """Switch traffic to new environment"""
        print(f"Switching traffic to {new_env} environment...")

        # Update load balancer configuration
        await self.update_load_balancer(new_env)

        # Update environment status
        for env in self.environments:
            self.environments[env]["active"] = (env == new_env)

        print("Traffic switch completed")

    async def rollback(self):
        """Rollback to previous environment"""
        active_env = "blue" if self.environments["blue"]["active"] else "green"
        inactive_env = "green" if active_env == "blue" else "blue"

        print(f"Rolling back from {active_env} to {inactive_env}")
        await self.switch_traffic(inactive_env)

    async def deploy_container(self, env: str, version: str):
        """Deploy container using Docker/K8s API"""
        # Implementation depends on your container orchestration
        print(f"Deploying container {version} to {env}")

    async def update_load_balancer(self, active_env: str):
        """Update load balancer to point to active environment"""
        # Implementation depends on your load balancer
        print(f"Load balancer updated to use {active_env}")

# Usage
async def main():
    deployer = BlueGreenDeployer("http://load-balancer:80")

    try:
        # Deploy new version
        new_env = await deployer.deploy_to_inactive_environment("v1.2.0")

        # Switch traffic
        await deployer.switch_traffic(new_env)

        print("Deployment completed successfully!")

    except Exception as e:
        print(f"Deployment failed: {e}")
        await deployer.rollback()

if __name__ == "__main__":
    asyncio.run(main())
```

## 🎯 2025 Web Development Career Guide

### In-Demand Skills:

- **FastAPI Mastery**: Modern async API development
- **Microservices Architecture**: Docker, Kubernetes, service mesh
- **Cloud Platforms**: AWS Lambda, Google Cloud Run, Azure Functions
- **Observability**: Prometheus, Grafana, distributed tracing
- **Security**: OAuth2, JWT, API security best practices

### Salary Expectations (2025):

- **Junior Python Developer**: $50,000 - $75,000
- **Senior Backend Engineer**: $90,000 - $130,000
- **Lead API Architect**: $120,000 - $180,000
- **DevOps/Platform Engineer**: $110,000 - $160,000
- **Full-Stack Python Developer**: $80,000 - $140,000

### Portfolio Projects to Build:

1. **E-commerce API**: Complete REST API with payments
2. **Real-time Chat**: WebSocket implementation
3. **Microservices Platform**: Multi-service architecture
4. **API Gateway**: Load balancing and rate limiting
5. **Monitoring Dashboard**: Metrics and observability

## 🔥 Conclusion

Python web development in 2025 is more powerful and accessible than ever. With FastAPI's performance, async programming capabilities, and modern deployment practices, Python developers are building the next generation of web applications.

The key to success is mastering the full stack: from FastAPI backends to containerized deployments, from real-time WebSockets to observability platforms. Start building these projects today and position yourself at the forefront of modern web development!

---

_Ready to build production-ready web applications? Join Zumenzu's advanced Python web development track and master FastAPI, microservices, and cloud deployment with hands-on projects!_
