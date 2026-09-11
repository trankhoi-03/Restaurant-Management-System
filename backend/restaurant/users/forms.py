from django import forms 
from django.contrib.auth.forms import UserCreationForm, UserChangeForm, AdminUserCreationForm
from .models import CustomUser, Meal, Order, Table

class CustomerSignUpForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'phone_number')

class EmployeeCreationForm(AdminUserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'role', 'phone_number')

class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'role', 'phone_number')

class OrderForm(forms.ModelForm):
    meal = forms.ModelChoiceField(
        queryset=Meal.objects.all(),
        empty_label="--Select your meal--",
        widget=forms.Select(attrs={'class': 'form-select'})
    )

    table = forms.ModelChoiceField(
        queryset=Table.objects.filter(is_occupied=False),
        empty_label="--Select your table--",
        widget=forms.Select(attrs={'class': 'form-select'})
    )

    class Meta:
        model = Order
        fields = ['customer_name', 'table', 'meal', 'special_requests']

        widgets = {
            'customer_name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your name'}),
            'special_requests': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'Any allergies or preferences?'})
        }