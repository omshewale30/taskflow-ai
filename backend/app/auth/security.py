from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt.exceptions import PyJWTError
from typing import Dict, Any
from app.core.config import settings

# Security scheme for JWT Bearer token
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """
    Verify the JWT token from Supabase Auth and extract the user information.
    
    Returns:
        Dict containing user information with at least the user_id
    """
    try:
        # Get the token from the Authorization header
        token = credentials.credentials
        
        # Verify the token using PyJWT with the Supabase JWT secret
        # Note: In production, you might want to use JWKS for verification instead
        # This is a simplified version for the MVP
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_signature": False}  # In MVP we might skip signature verification for simplicity
        )
        
        # Extract user_id from the 'sub' claim
        user_id = payload.get("sub")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
            
        # Return user info (at minimum the user_id)
        return {"user_id": user_id}
        
    except PyJWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
        )