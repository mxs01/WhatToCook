"""Domain exceptions."""


class WhatToCookError(Exception):
    """Base exception for all application errors."""


class AuthenticationError(WhatToCookError):
    """Raised when authentication fails."""


class AuthorizationError(WhatToCookError):
    """Raised when user lacks permission."""


class NotFoundError(WhatToCookError):
    """Raised when a requested resource is not found."""


class ValidationError(WhatToCookError):
    """Raised when input validation fails."""


class ExternalServiceError(WhatToCookError):
    """Raised when an external service call fails."""


class ImageAnalysisError(ExternalServiceError):
    """Raised when image analysis fails."""


class RecipeGenerationError(ExternalServiceError):
    """Raised when recipe generation fails."""


class ImageGenerationError(ExternalServiceError):
    """Raised when image generation fails."""


class StorageError(ExternalServiceError):
    """Raised when object storage operations fail."""
