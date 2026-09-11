from rest_framework import serializers
from .models import Meal, Table, Order

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = '__all__'

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    meal_details = MealSerializer(source='meal', read_only=True)
    table_number = serializers.ReadOnlyField(source='table.table_number')

    class Meta:
        model = Order
        fields = ['id', 'customer_name', 'table', 'table_number', 'meal', 'meal_details', 'status', 'special_requests', 'estimated_time', 'quantity']