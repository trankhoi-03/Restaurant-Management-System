from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Meal, Order, Table
from .forms import EmployeeCreationForm, CustomUserChangeForm

class CustomUserAdmin(UserAdmin):
    add_form = EmployeeCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ['username', 'email', 'role', 'is_staff', 'salary']

    # 1. "Change User" Page
    # We take the default Django layout and ADD our section at the bottom
    fieldsets = UserAdmin.fieldsets + (
        ('Restaurant Staff Info', {'fields': ('role', 'phone_number', 'salary')}),
    )
    
    # 2. "Add User" Page
    # CRITICAL FIX: We take the default Django layout (which handles password_1 and 2 safely)
    # And we just ADD our extra fields in a new section.
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Restaurant Staff Info', {'fields': ('email', 'role', 'phone_number')}),
    )

class MealAdmin(admin.ModelAdmin):
    list_display = ('name', 'item_type', 'price', 'description')
    list_filter = ('item_type',)
    search_fields = ('name')


class TableAdmin(admin.ModelAdmin):
    list_display = ('table_number', 'capacity', 'is_occupied')
    list_filter = ('is_occupied', 'capacity')
    ordering = ('table_number',)

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Meal)
admin.site.register(Order)
admin.site.register(Table, TableAdmin)