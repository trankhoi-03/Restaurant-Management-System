from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin/Manager'),
        ('cook', 'Cook'),
        ('cashier', 'Cashier'),
        ('customer', 'Customer'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    salary = models.IntegerField(default=500)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
class Meal(models.Model):
    TYPE_CHOICES = (
        ('appetizer', 'Appetizer'),
        ('main', 'Main Course'),
        ('dessert', 'Dessert'),
        ('drink', 'Dring'),
    )

    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=5, decimal_places=2)

    item_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='main'
    )

    image = models.ImageField(
        upload_to='meals/',
        blank=True,
        null=True
    )

    class Meta:
        db_table = 'menu'

    def __str__(self):
        return self.name
    
class Table(models.Model):
    table_number = models.IntegerField(unique=True)

    capacity = models.IntegerField(help_text="Number of people it fits")

    is_occupied = models.BooleanField(default=False)

    class Meta:
        db_table = 'tables'
        verbose_name = 'Table'
        verbose_name_plural = 'Tables'

    def __str__(self):
        status = "Occupied" if self.is_occupied else "Free"
        return f"Table {self.table_number} ({self.capacity} ppl) - {status}"

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('cooking', 'Cooking'),
        ('ready', 'Ready'),
        ('paid', 'Paid'),
    )

    customer_name = models.CharField(max_length=100)

    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    special_requests = models.TextField(blank=True, null=True, help_text="e.g. No onions, extra spicy")
    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    estimated_time = models.IntegerField(help_text="Minutes to prepare", null=True, blank=True)

    class Meta:
        db_table = 'orders'

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"
    
