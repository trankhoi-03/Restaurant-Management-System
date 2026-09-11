from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required, user_passes_test
from .forms import EmployeeCreationForm, CustomUserChangeForm, CustomerSignUpForm
from .models import CustomUser, Meal, Order
from .forms import OrderForm

# Create your views here.

def register(request):
    if request.method == 'POST':
        form = CustomerSignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = CustomerSignUpForm()
    return render(request, 'users/register.html', {'form': form})

@login_required
def update_employee(request, user_id):
    if request.user.role != 'admin':
        return render(request, 'users/unauthorized.html')
    
    employee_to_update = get_object_or_404(CustomUser, id=user_id)

    if request.method == 'POST':
        form = CustomUserChangeForm(request.POST, instance=employee_to_update)
        if form.is_valid():
            form.save()
            return redirect('dashboard')
    else:
        form = CustomUserChangeForm(instance=employee_to_update)

    return render(request, 'users/update_employee.htlm', {'form': form})


def customer_order(request):
    if request.user.is_authenticated:
        if request.user.role == 'cook':
            return redirect('cook_dashboard')
        elif request.user.role == 'cashier':
            return redirect('cashier_dashboard')


    if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            selected_table = order.table
            if selected_table:
                selected_table.is_occupied = True
                selected_table.save()

            order.save()
            return redirect('order_status', order_id=order.id)
    else:
        form = OrderForm()

    return render(request, 'users/customer_order.html', {'form': form})

def order_status(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    return render(request, 'users/order_status.html', {'order': order})

def is_cook(user):
    return user.role == 'cook' or user.role == 'admin'


@login_required
@user_passes_test(is_cook)
def cook_dashboard(request):
    orders = Order.objects.filter(status__in=['pending', 'cooking']).order_by('created_at')

    return render(request, 'users/cook_dashboard.html', {'orders': orders})


@login_required
@user_passes_test(is_cook)
def update_order(request, order_id):
    if request.method == 'POST':
        order = get_object_or_404(Order, id=order_id)
        
        new_status = request.POST.get('status')
        est_time = request.POST.get('estimated_time')

        # --- DEBUG PRINTS (Look at your terminal after clicking) ---
        print(f"DEBUG: Order ID: {order_id}")
        print(f"DEBUG: New Status: {new_status}")
        print(f"DEBUG: Est Time: {est_time}")
        # ---------------------------------------------------------
        
        # Logic: If starting to cook, we need the time
        if new_status == 'cooking' and est_time:
            order.status = 'cooking'
            order.estimated_time = est_time
            order.save()
            print("DEBUG: Saved as Cooking!") # Did we get here?
            
        elif new_status == 'ready':
            order.status = 'ready'
            order.save()
            print("DEBUG: Saved as Ready!") # Did we get here?
            
    return redirect('cook_dashboard')

def is_cashier(user):
    return user.role == 'cashier' or user.role == 'admin'

@login_required
@user_passes_test(is_cashier)
def cashier_dashboard(request):
    ready_orders = Order.objects.filter(status='ready').order_by('created_at')

    return render(request, 'users/cashier_dashboard.html', {'orders': ready_orders})

@login_required
@user_passes_test(is_cashier)
def confirm_payment(request, order_id):
    # 1. Check if the request is a POST (button click)
    if request.method == 'POST':
        order = get_object_or_404(Order, id=order_id)
        
        # 2. Only update if the order is actually Ready
        if order.status == 'ready':
            order.status = 'paid'
            order.save()

            if order.table:
                order.table.is_occupied = False
                order.table.save()
            print(f"Order #{order.id} has been paid!. Table {order.table.table_number} is now free.") # Print INSIDE the block
            
    # 3. Redirect immediately. Do not try to access 'order' or 'status' here
    # because if the request wasn't POST, those variables don't exist.
    return redirect('cashier_dashboard')
