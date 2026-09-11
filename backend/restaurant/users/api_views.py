from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import status
from .models import Meal, Order, Table
from .serializers import MealSerializer, TableSerializer, OrderSerializer

@api_view(['GET'])
def get_menu(request):
    meals = Meal.objects.all()
    serializer = MealSerializer(meals, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_tables(request):
    tables = Table.objects.filter(is_occupied=False)
    serializer = TableSerializer(tables, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def create_order(request):
    serializer = OrderSerializer(data=request.data)
    if serializer.is_valid():
        order = serializer.save()

        if order.table:
            order.table.is_occupied = True
            order.table.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_orders(request):
    orders = Order.objects.filter(status__in=['pending', 'cooking']).order_by('created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        new_status = request.data.get('status')
        est_time = request.data.get('estimated_time')

        if new_status:
            order.status = new_status
        if est_time:
            order.estimated_time = est_time

        order.save()
        return Response({'message': 'Order updated'}, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET'])
def get_cashier_orders(request):
    orders = Order.objects.filter(status='ready').order_by('created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def confirm_payment(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        order.status = 'paid'
        order.save()

        if order.table:
            order.table.is_occupied = False
            order.table.save()

        return Response({'message': 'Payment confirmed, table freed'}, status=status.HTTP_200_OK)
    except Order.DoesNotExist:
        return Response({'message': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        return Response({
            'username': user.username,
            'role': user.role,
            'id': user.id
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['GET'])
def get_status_by_table(request, table_id):
    """Return all active orders for a specific table"""
    # We get all orders for this table that are NOT 'paid' yet
    # (Or you can include 'paid' if you want them to see history)
    orders = Order.objects.filter(table_id=table_id).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)