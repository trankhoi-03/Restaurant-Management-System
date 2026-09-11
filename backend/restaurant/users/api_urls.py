from django.urls import path
from . import api_views

urlpatterns = [
    path('menu/', api_views.get_menu),
    path('tables/', api_views.get_tables),
    path('order/create/', api_views.create_order),
    path('kitchen/orders/', api_views.get_orders),
    path('kitchen/update/<int:order_id>/', api_views.update_order_status),
    path('cashier/orders/', api_views.get_cashier_orders),
    path('cashier/pay/<int:order_id>/', api_views.confirm_payment),
    path('login/', api_views.login),
    path('orders/table/<int:table_id>/', api_views.get_status_by_table)
]

