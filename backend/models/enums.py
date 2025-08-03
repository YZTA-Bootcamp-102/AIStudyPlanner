from enum import Enum as PyEnum

class TreeStage(PyEnum):
    SEED = "tohum"
    SPROUT = "filiz"
    SAPLING = "fidan"
    TREE = "ağaç"
    MATURE_TREE = "olgun_ağaç"

class NotificationMethod(PyEnum):
    EMAIL = "email"
    PUSH = "push"
    BOTH = "both"

class UserRole(PyEnum):
    USER = "kullanıcı"
    ADMIN = "yönetici"

class OptionKey(PyEnum):
    A = 'A'
    B = 'B'
    C = 'C'
    D = 'D'
class RepeatType(PyEnum):
    none = "none"
    daily = "daily"
    weekly = "weekly"
    weekdays = "weekdays"
    monthly = "monthly"
    yearly = "yearly"
    custom = "custom"

class PriorityType(PyEnum):
    low = "low"
    medium = "medium"
    high = "high"

class CategoryType(PyEnum):
    study = "study"
    exam = "exam"
    project = "project"
    homework = "homework"
    lab = "lab"
    language = "language"
    reading = "reading"
    other = "other"