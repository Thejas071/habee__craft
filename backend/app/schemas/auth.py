from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class VerifyRecoveryRequest(BaseModel):
    recovery_code: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str