from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.core.security import authenticate_user, create_access_token, get_password_hash, create_refresh_token
from app.db.base import get_db
from app.db.models.user import User
from app.schemas.user import UserCreate, Token
from app.config import settings
from app.core.security import verify_password

router = APIRouter()

@router.post("/test")
def test_connection():
    """
    测试 API 连通性
    
    简单的测试端点，用于验证 API 是否正常工作
    
    返回:
        dict: 包含状态和消息的 JSON 响应
    """
    return {
        "status": "success",
        "message": "API connection successful",
        "timestamp": datetime.datetime.now().isoformat()
    }


from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Body
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.core.security import verify_password, create_access_token, create_refresh_token
from app.db.base import get_db
from app.db.models.user import User
from app.config import settings

router = APIRouter()

# —— 新增：定义一个 Pydantic 模型来接收前端 JSON —— 
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


@router.post("/login")
def login_for_access_token(
    login_req: LoginRequest,         # ← 直接接收 JSON
    response: Response,
    db: Session = Depends(get_db),
):
    """
    用户登录（接收 JSON 格式）
    
    请求体:
    {
      "email": "user@example.com",
      "password": "secret"
    }
    
    返回用户信息，并在 Cookie 中设置 access_token / refresh_token
    """
    # 根据 email 查用户
    user = db.query(User).filter(User.email == login_req.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found. Please check your email or register a new account.",
        )

    # 验证密码
    if not verify_password(login_req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Please try again.",
        )

    # 检查账号状态
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled. Please contact support.",
        )

    # （可选）检查锁定状态
    if getattr(user, "is_locked", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is locked due to multiple failed attempts.",
        )

    # 创建并设置访问令牌
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=(settings.ENVIRONMENT == "production"),
        path="/"
    )

    # 创建并设置刷新令牌
    refresh_token_expires = timedelta(days=7)
    refresh_token = create_refresh_token(
        subject=user.id, expires_delta=refresh_token_expires
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=7 * 24 * 60 * 60,
        expires=7 * 24 * 60 * 60,
        samesite="lax",
        secure=(settings.ENVIRONMENT == "production"),
        path="/api/v1/auth/refresh"
    )

    return {
        "message": "Login successful",
        "user_id": user.id,
        "email": user.email
    }


@router.post("/refresh")
def refresh_access_token(
    request: Request,               # ← 一定要加上 Request
    response: Response,
    db: Session = Depends(get_db)
):
    """ 刷新访问令牌 """
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")

    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(status_code=401, detail="User not found or inactive")

        # 生成新 access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(subject=user.id, expires_delta=access_token_expires)
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            expires=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            samesite="lax",
            secure=(settings.ENVIRONMENT == "production"),
            path="/"
        )
        return {"message": "Token refreshed successfully"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")



# @router.post("/login")
# def login_for_access_token(
#     response: Response,
#     form_data: OAuth2PasswordRequestForm = Depends(),
#     db: Session = Depends(get_db)
# ):
#     """
#     用户登录
    
#     使用邮箱和密码登录系统，获取访问令牌
    
#     - **username**: 用户邮箱
#     - **password**: 用户密码
    
#     返回JWT访问令牌
#     """
#     # 检查用户是否存在
#     user = db.query(User).filter(User.email == form_data.username).first()
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="User not found. Please check your email or register a new account.",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
    
#     # 验证密码
#     if not verify_password(form_data.password, user.hashed_password):
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect password. Please try again.",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
    
#     # 检查账户状态
#     if not user.is_active:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Account is disabled. Please contact support for assistance.",
#         )
    
#     # 检查账户是否被锁定（可选功能）
#     if hasattr(user, 'is_locked') and user.is_locked:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Account is locked due to multiple failed login attempts. Please reset your password or try again later.",
#         )
    
#     # 创建访问令牌
#     access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#     access_token = create_access_token(
#         subject=user.id, expires_delta=access_token_expires
#     )
    
#     # 创建刷新令牌
#     refresh_token_expires = timedelta(days=7)  # 7天
#     refresh_token = create_refresh_token(
#         subject=user.id, expires_delta=refresh_token_expires
#     )
    
#     # 设置访问令牌到HttpOnly Cookie
#     response.set_cookie(
#         key="access_token",
#         value=f"Bearer {access_token}",
#         httponly=True,
#         max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
#         expires=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
#         samesite="lax",
#         secure=settings.ENVIRONMENT == "production",
#         path="/"
#     )
    
#     # 设置刷新令牌到HttpOnly Cookie
#     response.set_cookie(
#         key="refresh_token",
#         value=refresh_token,
#         httponly=True,
#         max_age=7 * 24 * 60 * 60,  # 7天
#         expires=7 * 24 * 60 * 60,
#         samesite="lax",
#         secure=settings.ENVIRONMENT == "production",
#         path="/api/v1/auth/refresh"  # 只在刷新端点可用
#     )
    
#     # 记录登录尝试
#     try:
#         # 传递request对象
#         log_login_attempt(db, user.id, True)
#     except Exception:
#         # 记录失败不应影响登录流程
#         pass
    
#     # 返回用户信息而不是token
#     return {
#         "message": "Login successful",
#         "user_id": user.id,
#         "email": user.email
#     }

# @router.post("/refresh")
# def refresh_access_token(
#     response: Response,
#     db: Session = Depends(get_db)
# ):
#     """刷新访问令牌"""
#     refresh_token = request.cookies.get("refresh_token")
#     if not refresh_token:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Missing refresh token"
#         )
    
#     try:
#         # 验证刷新令牌
#         payload = jwt.decode(
#             refresh_token, 
#             settings.SECRET_KEY, 
#             algorithms=[settings.ALGORITHM]
#         )
#         user_id: str = payload.get("sub")
#         if user_id is None:
#             raise HTTPException(status_code=401, detail="无效的刷新令牌")
        
#         # 获取用户
#         user = db.query(User).filter(User.id == user_id).first()
#         if not user or not user.is_active:
#             raise HTTPException(status_code=401, detail="用户不存在或已禁用")
        
#         # 创建新的访问令牌
#         access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
#         access_token = create_access_token(
#             subject=user.id, expires_delta=access_token_expires
#         )
        
#         # 设置新的访问令牌Cookie
#         response.set_cookie(
#             key="access_token",
#             value=f"Bearer {access_token}",
#             httponly=True,
#             max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
#             expires=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
#             samesite="lax",
#             secure=settings.ENVIRONMENT == "production",
#             path="/"
#         )
        
#         return {"message": "Token refreshed successfully"}
#     except JWTError:
#         raise HTTPException(status_code=401, detail="Invalid refresh token")

@router.post("/logout")
def logout(response: Response):
    """用户登出"""
    # 清除访问令牌
    response.delete_cookie(
        key="access_token",
        path="/",
        samesite="lax"
    )
    
    # 清除刷新令牌
    response.delete_cookie(
        key="refresh_token",
        path="/api/v1/auth/refresh",
        samesite="lax"
    )
    
    return {"message": "Logout successfully"}

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(
    user_in: UserCreate,
    db: Session = Depends(get_db)
):
    """
    用户注册
    
    创建新用户账号
    
    - **email**: 用户邮箱（必须唯一）
    - **password**: 用户密码（至少6个字符）
    
    返回成功消息
    """
    # 检查邮箱是否已存在
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email is already registered"
        )
    
    # 创建新用户
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"message": "Register successfully"}

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.security import verify_password
from app.db.base import get_db
from app.db.models.user import User
from app.schemas.user import UserResponse
from app.config import settings

# OAuth2 密码承载令牌
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    """
    获取当前用户
    
    从请求中提取并验证JWT令牌，返回对应的用户
    
    Args:
        db: 数据库会话
        token: JWT令牌
    
    Returns:
        User: 当前认证用户
    
    Raises:
        HTTPException: 如果令牌无效或用户不存在
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # 解码JWT令牌
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # 从数据库获取用户
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    # 检查用户状态
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )
    
    return user

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    获取当前登录用户信息
    
    返回当前认证用户的详细信息
    
    Returns:
        UserResponse: 用户信息响应模型
    """
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        is_active=current_user.is_active,
        is_superuser=getattr(current_user, "is_superuser", False),
        created_at=current_user.created_at,
        updated_at=current_user.updated_at
    )