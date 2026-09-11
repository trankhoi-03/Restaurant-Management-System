from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', auth_views.LoginView.as_view(template_name='users/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('update-employee/<int:user_id>/', views.update_employee, name='update_employee'),
    path('', views.customer_order, name='home'),
    path('order-status/<int:order_id>/', views.order_status, name='order_status'),
    path('cook/dashboard/', views.cook_dashboard, name='cook_dashboard'),
    path('cook/dashboard/<int:order_id>/', views.update_order, name='update_order'),
    path('cashier/dashboard/', views.cashier_dashboard, name='cashier_dashboard'),
    path('cashier/pay/<int:order_id>/', views.confirm_payment, name='confirm_payment'),
]